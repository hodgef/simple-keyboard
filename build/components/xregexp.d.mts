export default XRegExp;
declare class XRegExp {
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
    static isInstalled: (feature: string) => boolean;
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
    static isRegExp: (value: any) => boolean;
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
    static union: (patterns: any[], flags?: string | undefined, options?: Object | undefined) => RegExp;
    static _hasNativeFlag: (flag: any) => boolean;
    static escape: (str: any) => string;
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
    static exec: (str: string, regex: RegExp, pos?: number | undefined, sticky?: string | boolean | undefined) => any[];
    /**
     * Returns a match detail object composed of the provided values.
     *
     * @private
     */
    private static row;
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
    static matchRecursive: (str: string, left: string, right: string, flags?: string | undefined, options?: Object | undefined) => any[];
}
