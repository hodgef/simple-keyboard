// ==--------------------------==
// Private stuff
// ==--------------------------==

// Property name used for extended regex instance data
const REGEX_DATA = 'xregexp';
// Optional features that can be installed and uninstalled
const features = {
  astral: false,
  namespacing: true
};
// Storage for fixed/extended native methods
const fixed = {};
// Storage for regexes cached by `XRegExp.cache`
let regexCache = {};
// Storage for pattern details cached by the `XRegExp` constructor
let patternCache = {};
// Storage for regex syntax tokens added internally or by `XRegExp.addToken`
const tokens = [];
// Token scopes
const defaultScope = 'default';
const classScope = 'class';
// Regexes that match native regex syntax, including octals
const nativeTokens = {
  // Any native multicharacter token in default scope, or any single character
  'default': /\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9]\d*|x[\dA-Fa-f]{2}|u(?:[\dA-Fa-f]{4}|{[\dA-Fa-f]+})|c[A-Za-z]|[\s\S])|\(\?(?:[:=!]|<[=!])|[?*+]\?|{\d+(?:,\d*)?}\??|[\s\S]/,
  // Any native multicharacter token in character class scope, or any single character
  'class': /\\(?:[0-3][0-7]{0,2}|[4-7][0-7]?|x[\dA-Fa-f]{2}|u(?:[\dA-Fa-f]{4}|{[\dA-Fa-f]+})|c[A-Za-z]|[\s\S])|[\s\S]/
};
// Any backreference or dollar-prefixed character in replacement strings
const replacementToken = /\$(?:\{([^\}]+)\}|<([^>]+)>|(\d\d?|[\s\S]?))/g;
// Check for correct `exec` handling of nonparticipating capturing groups
const correctExecNpcg = /()??/.exec('')[1] === undefined;
// Check for ES6 `flags` prop support
const hasFlagsProp = /x/.flags !== undefined;

const hasNativeFlag = (flag) => {
  // Can't check based on the presence of properties/getters since browsers might support such
  // properties even when they don't support the corresponding flag in regex construction (tested
  // in Chrome 48, where `'unicode' in /x/` is true but trying to construct a regex with flag `u`
  // throws an error)
  let isSupported = true;
  try {
    // Can't use regex literals for testing even in a `try` because regex literals with
    // unsupported flags cause a compilation error in IE
    new RegExp('', flag);

    // Work around a broken/incomplete IE11 polyfill for sticky introduced in core-js 3.6.0
    if (flag === 'y') {
      // Using function to avoid babel transform to regex literal
      const gy = (() => 'gy')();
      const incompleteY = '.a'.replace(new RegExp('a', gy), '.') === '..';
      if (incompleteY) {
        isSupported = false;
      }
    }
  } catch (exception) {
    isSupported = false;
  }
  return isSupported;
}
// Check for ES2021 `d` flag support
const hasNativeD = hasNativeFlag('d');
// Check for ES2018 `s` flag support
const hasNativeS = hasNativeFlag('s');
// Check for ES6 `u` flag support
const hasNativeU = hasNativeFlag('u');
// Check for ES6 `y` flag support
const hasNativeY = hasNativeFlag('y');
// Tracker for known flags, including addon flags
const registeredFlags = {
  d: hasNativeD,
  g: true,
  i: true,
  m: true,
  s: hasNativeS,
  u: hasNativeU,
  y: hasNativeY
};
// Flags to remove when passing to native `RegExp` constructor
const nonnativeFlags = hasNativeS ? /[^dgimsuy]+/g : /[^dgimuy]+/g;

/**
 * Attaches extended data and `XRegExp.prototype` properties to a regex object.
 *
 * @private
 * @param {RegExp} regex Regex to augment.
 * @param {Array} captureNames Array with capture names, or `null`.
 * @param {String} xSource XRegExp pattern used to generate `regex`, or `null` if N/A.
 * @param {String} xFlags XRegExp flags used to generate `regex`, or `null` if N/A.
 * @param {Boolean} [isInternalOnly=false] Whether the regex will be used only for internal
 *   operations, and never exposed to users. For internal-only regexes, we can improve perf by
 *   skipping some operations like attaching `XRegExp.prototype` properties.
 * @returns {!RegExp} Augmented regex.
 */
const augment = (regex, captureNames, xSource, xFlags, isInternalOnly) => {
  regex[REGEX_DATA] = {
    captureNames
  };

  if (isInternalOnly) {
    return regex;
  }

  // Can't auto-inherit these since the XRegExp constructor returns a nonprimitive value
  if (regex.__proto__) {
    regex.__proto__ = XRegExp.prototype;
  } else {
    for (const p in XRegExp.prototype) {
      // An `XRegExp.prototype.hasOwnProperty(p)` check wouldn't be worth it here, since this
      // is performance sensitive, and enumerable `Object.prototype` or `RegExp.prototype`
      // extensions exist on `regex.prototype` anyway
      regex[p] = XRegExp.prototype[p];
    }
  }

  regex[REGEX_DATA].source = xSource;
  // Emulate the ES6 `flags` prop by ensuring flags are in alphabetical order
  regex[REGEX_DATA].flags = xFlags ? xFlags.split('').sort().join('') : xFlags;

  return regex;
}

/**
 * Removes any duplicate characters from the provided string.
 *
 * @private
 * @param {String} str String to remove duplicate characters from.
 * @returns {string} String with any duplicate characters removed.
 */
const clipDuplicates = (str) => {
  return str.replace(/([\s\S])(?=[\s\S]*\1)/g, '');
}

/**
 * Copies a regex object while preserving extended data and augmenting with `XRegExp.prototype`
 * properties. The copy has a fresh `lastIndex` property (set to zero). Allows adding and removing
 * flags g and y while copying the regex.
 *
 * @private
 * @param {RegExp} regex Regex to copy.
 * @param {Object} [options] Options object with optional properties:
 *   - `addG` {Boolean} Add flag g while copying the regex.
 *   - `addY` {Boolean} Add flag y while copying the regex.
 *   - `removeG` {Boolean} Remove flag g while copying the regex.
 *   - `removeY` {Boolean} Remove flag y while copying the regex.
 *   - `isInternalOnly` {Boolean} Whether the copied regex will be used only for internal
 *     operations, and never exposed to users. For internal-only regexes, we can improve perf by
 *     skipping some operations like attaching `XRegExp.prototype` properties.
 *   - `source` {String} Overrides `<regex>.source`, for special cases.
 * @returns {RegExp} Copy of the provided regex, possibly with modified flags.
 */
const copyRegex = (regex, options) => {
  if (!XRegExp.isRegExp(regex)) {
    throw new TypeError('Type RegExp expected');
  }

  const xData = regex[REGEX_DATA] || {};
  let flags = getNativeFlags(regex);
  let flagsToAdd = '';
  let flagsToRemove = '';
  let xregexpSource = null;
  let xregexpFlags = null;

  options = options || {};

  if (options.removeG) { flagsToRemove += 'g'; }
  if (options.removeY) { flagsToRemove += 'y'; }
  if (flagsToRemove) {
    flags = flags.replace(new RegExp(`[${flagsToRemove}]+`, 'g'), '');
  }

  if (options.addG) { flagsToAdd += 'g'; }
  if (options.addY) { flagsToAdd += 'y'; }
  if (flagsToAdd) {
    flags = clipDuplicates(flags + flagsToAdd);
  }

  if (!options.isInternalOnly) {
    if (xData.source !== undefined) {
      xregexpSource = xData.source;
    }
    // null or undefined; don't want to add to `flags` if the previous value was null, since
    // that indicates we're not tracking original precompilation flags
    if (xData.flags != null) {
      // Flags are only added for non-internal regexes by `XRegExp.globalize`. Flags are never
      // removed for non-internal regexes, so don't need to handle it
      xregexpFlags = flagsToAdd ? clipDuplicates(xData.flags + flagsToAdd) : xData.flags;
    }
  }

  // Augment with `XRegExp.prototype` properties, but use the native `RegExp` constructor to avoid
  // searching for special tokens. That would be wrong for regexes constructed by `RegExp`, and
  // unnecessary for regexes constructed by `XRegExp` because the regex has already undergone the
  // translation to native regex syntax
  regex = augment(
    new RegExp(options.source || regex.source, flags),
    hasNamedCapture(regex) ? xData.captureNames.slice(0) : null,
    xregexpSource,
    xregexpFlags,
    options.isInternalOnly
  );

  return regex;
}
/**
 * Returns the object, or throws an error if it is `null` or `undefined`. This is used to follow
 * the ES5 abstract operation `ToObject`.
 *
 * @private
 * @param {*} value Object to check and return.
 * @returns {*} The provided object.
 */
const nullThrows = (value) => {
  // null or undefined
  if (value == null) {
    throw new TypeError('Cannot convert null or undefined to object');
  }

  return value;
}

/**
 * Determines whether a value is of the specified type, by resolving its internal [[Class]].
 *
 * @private
 * @param {*} value Object to check.
 * @param {String} type Type to check for, in TitleCase.
 * @returns {boolean} Whether the object matches the type.
 */
const isType = (value, type) => {
  return Object.prototype.toString.call(value) === `[object ${type}]`;
}
/**
 * Returns native `RegExp` flags used by a regex object.
 *
 * @private
 * @param {RegExp} regex Regex to check.
 * @returns {string} Native flags in use.
 */
const getNativeFlags = (regex) => {
  return hasFlagsProp ?
    regex.flags :
    // Explicitly using `RegExp.prototype.toString` (rather than e.g. `String` or concatenation
    // with an empty string) allows this to continue working predictably when
    // `XRegExp.proptotype.toString` is overridden
    /\/([a-z]*)$/i.exec(RegExp.prototype.toString.call(regex))[1];
}
/**
 * Determines whether a regex has extended instance data used to track capture names.
 *
 * @private
 * @param {RegExp} regex Regex to check.
 * @returns {boolean} Whether the regex uses named capture.
 */
const hasNamedCapture = (regex) => {
  return !!(regex[REGEX_DATA] && regex[REGEX_DATA].captureNames);
}
// ==--------------------------==
// Fixed/extended native methods
// ==--------------------------==

/**
 * Adds named capture support (with backreferences returned as `result.name`), and fixes browser
 * bugs in the native `RegExp.prototype.exec`. Use via `XRegExp.exec`.
 *
 * @memberOf RegExp
 * @param {String} str String to search.
 * @returns {Array} Match array with named backreference properties, or `null`.
 */
fixed.exec = function (str) {
  const origLastIndex = this.lastIndex;
  const match = RegExp.prototype.exec.apply(this, arguments);

  if (match) {
    // Fix browsers whose `exec` methods don't return `undefined` for nonparticipating capturing
    // groups. This fixes IE 5.5-8, but not IE 9's quirks mode or emulation of older IEs. IE 9
    // in standards mode follows the spec.
    if (!correctExecNpcg && match.length > 1 && match.includes('')) {
      const r2 = copyRegex(this, {
        removeG: true,
        isInternalOnly: true
      });
      // Using `str.slice(match.index)` rather than `match[0]` in case lookahead allowed
      // matching due to characters outside the match
      String(str).slice(match.index).replace(r2, (...args) => {
        const len = args.length;
        // Skip index 0 and the last 2
        for (let i = 1; i < len - 2; ++i) {
          if (args[i] === undefined) {
            match[i] = undefined;
          }
        }
      });
    }

    // Attach named capture properties
    if (this[REGEX_DATA] && this[REGEX_DATA].captureNames) {
      let groupsObject = match;
      if (XRegExp.isInstalled('namespacing')) {
        // https://tc39.github.io/proposal-regexp-named-groups/#sec-regexpbuiltinexec
        match.groups = Object.create(null);
        groupsObject = match.groups;
      }
      // Skip index 0
      for (let i = 1; i < match.length; ++i) {
        const name = this[REGEX_DATA].captureNames[i - 1];
        if (name) {
          groupsObject[name] = match[i];
        }
      }
      // Preserve any existing `groups` obj that came from native ES2018 named capture
    } else if (!match.groups && XRegExp.isInstalled('namespacing')) {
      match.groups = undefined;
    }

    // Fix browsers that increment `lastIndex` after zero-length matches
    if (this.global && !match[0].length && (this.lastIndex > match.index)) {
      this.lastIndex = match.index;
    }
  }

  if (!this.global) {
    // Fixes IE, Opera bug (last tested IE 9, Opera 11.6)
    this.lastIndex = origLastIndex;
  }

  return match;
};
class XRegExp {
  /**
   * Checks whether an individual optional feature is installed.
   *
   * @memberOf XRegExp
   * @param {String} feature Name of the feature to check. One of:
   *   - `astral`
   *   - `namespacing`
   * @returns {boolean} Whether the feature is installed.
   * @example
   *
   * XRegExp.isInstalled('astral');
   */
  static isInstalled = (feature) => !!(features[feature]);
  /**
   * Returns `true` if an object is a regex; `false` if it isn't. This works correctly for regexes
   * created in another frame, when `instanceof` and `constructor` checks would fail.
   *
   * @memberOf XRegExp
   * @param {*} value Object to check.
   * @returns {boolean} Whether the object is a `RegExp` object.
   * @example
   *
   * XRegExp.isRegExp('string'); // -> false
   * XRegExp.isRegExp(/regex/i); // -> true
   * XRegExp.isRegExp(RegExp('^', 'm')); // -> true
   * XRegExp.isRegExp(XRegExp('(?s).')); // -> true
   */
  static isRegExp = (value) => Object.prototype.toString.call(value) === '[object RegExp]'
  /**
   * Returns an XRegExp object that is the union of the given patterns. Patterns can be provided as
   * regex objects or strings. Metacharacters are escaped in patterns provided as strings.
   * Backreferences in provided regex objects are automatically renumbered to work correctly within
   * the larger combined pattern. Native flags used by provided regexes are ignored in favor of the
   * `flags` argument.
   *
   * @memberOf XRegExp
   * @param {Array} patterns Regexes and strings to combine.
   * @param {String} [flags] Any combination of XRegExp flags.
   * @param {Object} [options] Options object with optional properties:
   *   - `conjunction` {String} Type of conjunction to use: 'or' (default) or 'none'.
   * @returns {RegExp} Union of the provided regexes and strings.
   * @example
   *
   * XRegExp.union(['a+b*c', /(dogs)\1/, /(cats)\1/], 'i');
   * // -> /a\+b\*c|(dogs)\1|(cats)\2/i
   *
   * XRegExp.union([/man/, /bear/, /pig/], 'i', {conjunction: 'none'});
   * // -> /manbearpig/i
   */
  static union = (patterns, flags, options) => {
    options = options || {};
    const conjunction = options.conjunction || 'or';
    let numCaptures = 0;
    let numPriorCaptures;
    let captureNames;

    const rewrite = (match, paren, backref) => {
      const name = captureNames[numCaptures - numPriorCaptures];

      // Capturing group
      if (paren) {
        ++numCaptures;
        // If the current capture has a name, preserve the name
        if (name) {
          return `(?<${name}>`;
        }
        // Backreference
      } else if (backref) {
        // Rewrite the backreference
        return `\\${+backref + numPriorCaptures}`;
      }

      return match;
    }

    if (!(isType(patterns, 'Array') && patterns.length)) {
      throw new TypeError('Must provide a nonempty array of patterns to merge');
    }

    const parts = /(\()(?!\?)|\\([1-9]\d*)|\\[\s\S]|\[(?:[^\\\]]|\\[\s\S])*\]/g;
    const output = [];
    for (const pattern of patterns) {
      if (XRegExp.isRegExp(pattern)) {
        numPriorCaptures = numCaptures;
        captureNames = (pattern[REGEX_DATA] && pattern[REGEX_DATA].captureNames) || [];

        // Rewrite backreferences. Passing to XRegExp dies on octals and ensures patterns are
        // independently valid; helps keep this simple. Named captures are put back
        output.push(XRegExp(pattern.source).source.replace(parts, rewrite));
      } else {
        output.push(XRegExp.escape(pattern));
      }
    }

    const separator = conjunction === 'none' ? '' : '|';
    return XRegExp(output.join(separator), flags);
  }
  static _hasNativeFlag = hasNativeFlag
  static escape = (str) => String(nullThrows(str)).
    // Escape most special chars with a backslash
    replace(/[\\\[\]{}()*+?.^$|]/g, '\\$&').
    // Convert to \uNNNN for special chars that can't be escaped when used with ES6 flag `u`
    replace(/[\s#\-,]/g, (match) => `\\u${pad4(hex(match.charCodeAt(0)))}`)
  /**
   * Executes a regex search in a specified string. Returns a match array or `null`. If the provided
   * regex uses named capture, named capture properties are included on the match array's `groups`
   * property. Optional `pos` and `sticky` arguments specify the search start position, and whether
   * the match must start at the specified position only. The `lastIndex` property of the provided
   * regex is not used, but is updated for compatibility. Also fixes browser bugs compared to the
   * native `RegExp.prototype.exec` and can be used reliably cross-browser.
   *
   * @memberOf XRegExp
   * @param {String} str String to search.
   * @param {RegExp} regex Regex to search with.
   * @param {Number} [pos=0] Zero-based index at which to start the search.
   * @param {Boolean|String} [sticky=false] Whether the match must start at the specified position
   *   only. The string `'sticky'` is accepted as an alternative to `true`.
   * @returns {Array} Match array with named capture properties on the `groups` object, or `null`. If
   *   the `namespacing` feature is off, named capture properties are directly on the match array.
   * @example
   *
   * // Basic use, with named capturing group
   * let match = XRegExp.exec('U+2620', XRegExp('U\\+(?<hex>[0-9A-F]{4})'));
   * match.groups.hex; // -> '2620'
   *
   * // With pos and sticky, in a loop
   * let pos = 3, result = [], match;
   * while (match = XRegExp.exec('<1><2><3><4>5<6>', /<(\d)>/, pos, 'sticky')) {
   *   result.push(match[1]);
   *   pos = match.index + match[0].length;
   * }
   * // result -> ['2', '3', '4']
   */
  static exec = (str, regex, pos, sticky) => {
    let cacheKey = 'g';
    let addY = false;
    let fakeY = false;
    let match;

    addY = hasNativeY && !!(sticky || (regex.sticky && sticky !== false));
    if (addY) {
      cacheKey += 'y';
    } else if (sticky) {
      // Simulate sticky matching by appending an empty capture to the original regex. The
      // resulting regex will succeed no matter what at the current index (set with `lastIndex`),
      // and will not search the rest of the subject string. We'll know that the original regex
      // has failed if that last capture is `''` rather than `undefined` (i.e., if that last
      // capture participated in the match).
      fakeY = true;
      cacheKey += 'FakeY';
    }

    regex[REGEX_DATA] = regex[REGEX_DATA] || {};

    // Shares cached copies with `XRegExp.match`/`replace`
    const r2 = regex[REGEX_DATA][cacheKey] || (
      regex[REGEX_DATA][cacheKey] = copyRegex(regex, {
        addG: true,
        addY,
        source: fakeY ? `${regex.source}|()` : undefined,
        removeY: sticky === false,
        isInternalOnly: true
      })
    );

    pos = pos || 0;
    r2.lastIndex = pos;

    // Fixed `exec` required for `lastIndex` fix, named backreferences, etc.
    match = fixed.exec.call(r2, str);

    // Get rid of the capture added by the pseudo-sticky matcher if needed. An empty string means
    // the original regexp failed (see above).
    if (fakeY && match && match.pop() === '') {
      match = null;
    }

    if (regex.global) {
      regex.lastIndex = match ? r2.lastIndex : 0;
    }

    return match;
  }

  /**
   * Returns a match detail object composed of the provided values.
   *
   * @private
   */
  static row = (name, value, start, end) => {
    return {
      name,
      value,
      start,
      end
    };
  }
  /**
   * Returns an array of match strings between outermost left and right delimiters, or an array of
   * objects with detailed match parts and position data. By default, an error is thrown if
   * delimiters are unbalanced within the subject string.
   *
   * @memberOf XRegExp
   * @param {String} str String to search.
   * @param {String} left Left delimiter as an XRegExp pattern.
   * @param {String} right Right delimiter as an XRegExp pattern.
   * @param {String} [flags] Any combination of XRegExp flags, used for the left and right delimiters.
   * @param {Object} [options] Options object with optional properties:
   *   - `valueNames` {Array} Providing `valueNames` changes the return value from an array of
   *     matched strings to an array of objects that provide the value and start/end positions
   *     for the matched strings as well as the matched delimiters and unmatched string segments.
   *     To use this extended information mode, provide an array of 4 strings that name the parts
   *     to be returned:
   *     1. String segments outside of (before, between, and after) matches.
   *     2. Matched outermost left delimiters.
   *     3. Matched text between the outermost left and right delimiters.
   *     4. Matched outermost right delimiters.
   *     Taken together, these parts include the entire subject string if used with flag g.
   *     Use `null` for any of these values to omit unneeded parts from the returned results.
   *   - `escapeChar` {String} Single char used to escape delimiters within the subject string.
   *   - `unbalanced` {String} Handling mode for unbalanced delimiters. Options are:
   *     - 'error' - throw (default)
   *     - 'skip' - unbalanced delimiters are treated as part of the text between delimiters, and
   *       searches continue at the end of the unbalanced delimiter.
   *     - 'skip-lazy' - unbalanced delimiters are treated as part of the text between delimiters,
   *       and searches continue one character after the start of the unbalanced delimiter.
   * @returns {Array} Array of matches, or an empty array.
   * @example
   *
   * // Basic usage
   * const str1 = '(t((e))s)t()(ing)';
   * XRegExp.matchRecursive(str1, '\\(', '\\)', 'g');
   * // -> ['t((e))s', '', 'ing']
   *
   * // Extended information mode with valueNames
   * const str2 = 'Here is <div> <div>an</div></div> example';
   * XRegExp.matchRecursive(str2, '<div\\s*>', '</div>', 'gi', {
   *   valueNames: ['between', 'left', 'match', 'right']
   * });
   * // -> [
   * // {name: 'between', value: 'Here is ',       start: 0,  end: 8},
   * // {name: 'left',    value: '<div>',          start: 8,  end: 13},
   * // {name: 'match',   value: ' <div>an</div>', start: 13, end: 27},
   * // {name: 'right',   value: '</div>',         start: 27, end: 33},
   * // {name: 'between', value: ' example',       start: 33, end: 41}
   * // ]
   *
   * // Omitting unneeded parts with null valueNames, and using escapeChar
   * const str3 = '...{1}.\\{{function(x,y){return {y:x}}}';
   * XRegExp.matchRecursive(str3, '{', '}', 'g', {
   *   valueNames: ['literal', null, 'value', null],
   *   escapeChar: '\\'
   * });
   * // -> [
   * // {name: 'literal', value: '...',  start: 0, end: 3},
   * // {name: 'value',   value: '1',    start: 4, end: 5},
   * // {name: 'literal', value: '.\\{', start: 6, end: 9},
   * // {name: 'value',   value: 'function(x,y){return {y:x}}', start: 10, end: 37}
   * // ]
   *
   * // Sticky mode via flag y
   * const str4 = '<1><<<2>>><3>4<5>';
   * XRegExp.matchRecursive(str4, '<', '>', 'gy');
   * // -> ['1', '<<2>>', '3']
   *
   * // Skipping unbalanced delimiters instead of erroring
   * const str5 = 'Here is <div> <div>an</div> unbalanced example';
   * XRegExp.matchRecursive(str5, '<div\\s*>', '</div>', 'gi', {
   *     unbalanced: 'skip'
   * });
   * // -> ['an']
   */
  static matchRecursive = (str, left, right, flags, options) => {
    flags = flags || '';
    options = options || {};
    const global = flags.includes('g');
    const sticky = flags.includes('y');
    // Flag `y` is handled manually
    const basicFlags = flags.replace(/y/g, '');
    left = new RegExp(left, basicFlags);
    right = new RegExp(right, basicFlags);

    let esc;
    let { escapeChar } = options;
    if (escapeChar) {
      if (escapeChar.length > 1) {
        throw new Error('Cannot use more than one escape character');
      }
      escapeChar = XRegExp.escape(escapeChar);
      // Example of concatenated `esc` regex:
      // `escapeChar`: '%'
      // `left`: '<'
      // `right`: '>'
      // Regex is: /(?:%[\S\s]|(?:(?!<|>)[^%])+)+/
      esc = new RegExp(
        `(?:${escapeChar}[\\S\\s]|(?:(?!${
        // Using `XRegExp.union` safely rewrites backreferences in `left` and `right`.
        // Intentionally not passing `basicFlags` to `XRegExp.union` since any syntax
        // transformation resulting from those flags was already applied to `left` and
        // `right` when they were passed through the XRegExp constructor above.
        XRegExp.union([left, right], '', { conjunction: 'or' }).source
        })[^${escapeChar}])+)+`,
        // Flags `dgy` not needed here
        flags.replace(XRegExp._hasNativeFlag('s') ? /[^imsu]/g : /[^imu]/g, '')
      );
    }

    let openTokens = 0;
    let delimStart = 0;
    let delimEnd = 0;
    let lastOuterEnd = 0;
    let outerStart;
    let innerStart;
    let leftMatch;
    let rightMatch;
    const vN = options.valueNames;
    const output = [];

    while (true) {
      // If using an escape character, advance to the delimiter's next starting position,
      // skipping any escaped characters in between
      if (escapeChar) {
        delimEnd += (XRegExp.exec(str, esc, delimEnd, 'sticky') || [''])[0].length;
      }

      leftMatch = XRegExp.exec(str, left, delimEnd);
      rightMatch = XRegExp.exec(str, right, delimEnd);
      // Keep the leftmost match only
      if (leftMatch && rightMatch) {
        if (leftMatch.index <= rightMatch.index) {
          rightMatch = null;
        } else {
          leftMatch = null;
        }
      }

      // Paths (LM: leftMatch, RM: rightMatch, OT: openTokens):
      // LM | RM | OT | Result
      // 1  | 0  | 1  | loop
      // 1  | 0  | 0  | loop
      // 0  | 1  | 1  | loop
      // 0  | 1  | 0  | throw
      // 0  | 0  | 1  | throw
      // 0  | 0  | 0  | break
      // The paths above don't include the sticky mode special case. The loop ends after the
      // first completed match if not `global`.
      if (leftMatch || rightMatch) {
        delimStart = (leftMatch || rightMatch).index;
        delimEnd = delimStart + (leftMatch || rightMatch)[0].length;
      } else if (!openTokens) {
        break;
      }
      if (sticky && !openTokens && delimStart > lastOuterEnd) {
        break;
      }
      if (leftMatch) {
        if (!openTokens) {
          outerStart = delimStart;
          innerStart = delimEnd;
        }
        openTokens += 1;
      } else if (rightMatch && openTokens) {
        openTokens -= 1;
        if (!openTokens) {
          if (vN) {
            if (vN[0] && outerStart > lastOuterEnd) {
              output.push(XRegExp.row(vN[0], str.slice(lastOuterEnd, outerStart), lastOuterEnd, outerStart));
            }
            if (vN[1]) {
              output.push(XRegExp.row(vN[1], str.slice(outerStart, innerStart), outerStart, innerStart));
            }
            if (vN[2]) {
              output.push(XRegExp.row(vN[2], str.slice(innerStart, delimStart), innerStart, delimStart));
            }
            if (vN[3]) {
              output.push(XRegExp.row(vN[3], str.slice(delimStart, delimEnd), delimStart, delimEnd));
            }
          } else {
            output.push(str.slice(innerStart, delimStart));
          }
          lastOuterEnd = delimEnd;
          if (!global) {
            break;
          }
        }
        // Found unbalanced delimiter
      } else {
        const unbalanced = options.unbalanced || 'error';
        if (unbalanced === 'skip' || unbalanced === 'skip-lazy') {
          if (rightMatch) {
            rightMatch = null;
            // No `leftMatch` for unbalanced left delimiter because we've reached the string end
          } else {
            if (unbalanced === 'skip') {
              const outerStartDelimLength = XRegExp.exec(str, left, outerStart, 'sticky')[0].length;
              delimEnd = outerStart + (outerStartDelimLength || 1);
            } else {
              delimEnd = outerStart + 1;
            }
            openTokens = 0;
          }
        } else if (unbalanced === 'error') {
          const delimSide = rightMatch ? 'right' : 'left';
          const errorPos = rightMatch ? delimStart : outerStart;
          throw new Error(`Unbalanced ${delimSide} delimiter found in string at position ${errorPos}`);
        } else {
          throw new Error(`Unsupported value for unbalanced: ${unbalanced}`);
        }
      }

      // If the delimiter matched an empty string, avoid an infinite loop
      if (delimStart === delimEnd) {
        delimEnd += 1;
      }
    }

    if (global && output.length > 0 && !sticky && vN && vN[0] && str.length > lastOuterEnd) {
      output.push(XRegExp.row(vN[0], str.slice(lastOuterEnd), lastOuterEnd, str.length));
    }

    return output;
  };
}

export default XRegExp