/**
 * Utility Service
 */
class Utilities {
  /**
   * Creates an instance of the Utility service
   */
  constructor({ getOptions, getCaretPosition, getCaretPositionEnd, dispatch }) {
    this.getOptions = getOptions;
    this.getCaretPosition = getCaretPosition;
    this.getCaretPositionEnd = getCaretPositionEnd;
    this.dispatch = dispatch;

    /**
     * Bindings
     */
    Utilities.bindMethods(Utilities, this);
  }

  /**
   * Adds default classes to a given button
   *
   * @param  {string} button The button's layout name
   * @return {string} The classes to be added to the button
   */
  getButtonClass(button) {
    const buttonTypeClass =
      button.includes("{") && button.includes("}") && button !== "{//}"
        ? "functionBtn"
        : "standardBtn";
    const buttonWithoutBraces = button.replace("{", "").replace("}", "");
    let buttonNormalized = "";

    if (buttonTypeClass !== "standardBtn")
      buttonNormalized = ` hg-button-${buttonWithoutBraces}`;

    return `hg-${buttonTypeClass}${buttonNormalized}`;
  }

  /**
   * Default button display labels
   */
  getDefaultDiplay() {
    return {
      "{bksp}": "backspace",
      "{backspace}": "backspace",
      "{enter}": "< enter",
      "{shift}": "shift",
      "{shiftleft}": "shift",
      "{shiftright}": "shift",
      "{alt}": "alt",
      "{s}": "shift",
      "{tab}": "tab",
      "{lock}": "caps",
      "{capslock}": "caps",
      "{accept}": "Submit",
      "{space}": " ",
      "{//}": " ",
      "{esc}": "esc",
      "{escape}": "esc",
      "{f1}": "f1",
      "{f2}": "f2",
      "{f3}": "f3",
      "{f4}": "f4",
      "{f5}": "f5",
      "{f6}": "f6",
      "{f7}": "f7",
      "{f8}": "f8",
      "{f9}": "f9",
      "{f10}": "f10",
      "{f11}": "f11",
      "{f12}": "f12",
      "{numpaddivide}": "/",
      "{numlock}": "lock",
      "{arrowup}": "↑",
      "{arrowleft}": "←",
      "{arrowdown}": "↓",
      "{arrowright}": "→",
      "{prtscr}": "print",
      "{scrolllock}": "scroll",
      "{pause}": "pause",
      "{insert}": "ins",
      "{home}": "home",
      "{pageup}": "up",
      "{delete}": "del",
      "{end}": "end",
      "{pagedown}": "down",
      "{numpadmultiply}": "*",
      "{numpadsubtract}": "-",
      "{numpadadd}": "+",
      "{numpadenter}": "enter",
      "{period}": ".",
      "{numpaddecimal}": ".",
      "{numpad0}": "0",
      "{numpad1}": "1",
      "{numpad2}": "2",
      "{numpad3}": "3",
      "{numpad4}": "4",
      "{numpad5}": "5",
      "{numpad6}": "6",
      "{numpad7}": "7",
      "{numpad8}": "8",
      "{numpad9}": "9"
    };
  }
  /**
   * Returns the display (label) name for a given button
   *
   * @param  {string} button The button's layout name
   * @param  {object} display The provided display option
   * @param  {boolean} mergeDisplay Whether the provided param value should be merged with the default one.
   */
  getButtonDisplayName(button, display, mergeDisplay) {
    if (mergeDisplay) {
      display = Object.assign({}, this.getDefaultDiplay(), display);
    } else {
      display = display || this.getDefaultDiplay();
    }

    return display[button] || button;
  }

  /**
   * Returns the updated input resulting from clicking a given button
   *
   * @param  {string} button The button's layout name
   * @param  {string} input The input string
   * @param  {number} caretPos The cursor's current position
   * @param  {number} caretPosEnd The cursor's current end position
   * @param  {boolean} moveCaret Whether to update simple-keyboard's cursor
   */
  getUpdatedInput(
    button,
    input,
    caretPos,
    caretPosEnd = caretPos,
    moveCaret = false
  ) {
    const options = this.getOptions();
    const commonParams = [caretPos, caretPosEnd, moveCaret];

    let output = input;

    if (
      (button === "{bksp}" || button === "{backspace}") &&
      output.length > 0
    ) {
      output = this.removeAt(output, ...commonParams);
    } else if (button === "{space}")
      output = this.addStringAt(output, " ", ...commonParams);
    else if (
      button === "{tab}" &&
      !(
        typeof options.tabCharOnTab === "boolean" &&
        options.tabCharOnTab === false
      )
    ) {
      output = this.addStringAt(output, "\t", ...commonParams);
    } else if (
      (button === "{enter}" || button === "{numpadenter}") &&
      options.newLineOnEnter
    )
      output = this.addStringAt(output, "\n", ...commonParams);
    else if (
      button.includes("numpad") &&
      Number.isInteger(Number(button[button.length - 2]))
    ) {
      output = this.addStringAt(
        output,
        button[button.length - 2],
        ...commonParams
      );
    } else if (button === "{numpaddivide}")
      output = this.addStringAt(output, "/", ...commonParams);
    else if (button === "{numpadmultiply}")
      output = this.addStringAt(output, "*", ...commonParams);
    else if (button === "{numpadsubtract}")
      output = this.addStringAt(output, "-", ...commonParams);
    else if (button === "{numpadadd}")
      output = this.addStringAt(output, "+", ...commonParams);
    else if (button === "{numpaddecimal}")
      output = this.addStringAt(output, ".", ...commonParams);
    else if (button === "{" || button === "}")
      output = this.addStringAt(output, button, ...commonParams);
    else if (!button.includes("{") && !button.includes("}"))
      output = this.addStringAt(output, button, ...commonParams);

    return output;
  }

  /**
   * Moves the cursor position by a given amount
   *
   * @param  {number} length Represents by how many characters the input should be moved
   * @param  {boolean} minus Whether the cursor should be moved to the left or not.
   */
  updateCaretPos(length, minus) {
    const newCaretPos = this.updateCaretPosAction(length, minus);

    this.dispatch(instance => {
      instance.setCaretPosition(newCaretPos);
    });
  }

  /**
   * Action method of updateCaretPos
   *
   * @param  {number} length Represents by how many characters the input should be moved
   * @param  {boolean} minus Whether the cursor should be moved to the left or not.
   */
  updateCaretPosAction(length, minus) {
    const options = this.getOptions();
    let caretPosition = this.getCaretPosition();

    if (minus) {
      if (caretPosition > 0) caretPosition = caretPosition - length;
    } else {
      caretPosition = caretPosition + length;
    }

    if (options.debug) {
      console.log("Caret at:", caretPosition, `(${this.keyboardDOMClass})`);
    }

    return caretPosition;
  }

  /**
   * Adds a string to the input at a given position
   *
   * @param  {string} source The source input
   * @param  {string} str The string to add
   * @param  {number} position The (cursor) position where the string should be added
   * @param  {boolean} moveCaret Whether to update simple-keyboard's cursor
   */
  addStringAt(
    source,
    str,
    position = source.length,
    positionEnd = source.length,
    moveCaret = false
  ) {
    let output;

    if (!position && position !== 0) {
      output = source + str;
    } else {
      output = [source.slice(0, position), str, source.slice(positionEnd)].join(
        ""
      );

      /**
       * Avoid caret position change when maxLength is set
       */
      if (!this.isMaxLengthReached()) {
        if (moveCaret) this.updateCaretPos(str.length);
      }
    }

    return output;
  }

  /**
   * Removes an amount of characters at a given position
   *
   * @param  {string} source The source input
   * @param  {number} position The (cursor) position from where the characters should be removed
   * @param  {boolean} moveCaret Whether to update simple-keyboard's cursor
   */
  removeAt(
    source,
    position = source.length,
    positionEnd = source.length,
    moveCaret = false
  ) {
    if (position === 0 && positionEnd === 0) {
      return source;
    }

    let output;

    if (position === positionEnd) {
      let prevTwoChars;
      let emojiMatched;
      const emojiMatchedReg = /([\uD800-\uDBFF][\uDC00-\uDFFF])/g;

      /**
       * Emojis are made out of two characters, so we must take a custom approach to trim them.
       * For more info: https://mathiasbynens.be/notes/javascript-unicode
       */
      if (position && position >= 0) {
        prevTwoChars = source.substring(position - 2, position);
        emojiMatched = prevTwoChars.match(emojiMatchedReg);

        if (emojiMatched) {
          output = source.substr(0, position - 2) + source.substr(position);
          if (moveCaret) this.updateCaretPos(2, true);
        } else {
          output = source.substr(0, position - 1) + source.substr(position);
          if (moveCaret) this.updateCaretPos(1, true);
        }
      } else {
        prevTwoChars = source.slice(-2);
        emojiMatched = prevTwoChars.match(emojiMatchedReg);

        if (emojiMatched) {
          output = source.slice(0, -2);
          if (moveCaret) this.updateCaretPos(2, true);
        } else {
          output = source.slice(0, -1);
          if (moveCaret) this.updateCaretPos(1, true);
        }
      }
    } else {
      output = source.slice(0, position) + source.slice(positionEnd);
      if (moveCaret) {
        this.dispatch(instance => {
          instance.setCaretPosition(position);
        });
      }
    }

    return output;
  }
  /**
   * Determines whether the maxLength has been reached. This function is called when the maxLength option it set.
   *
   * @param  {object} inputObj
   * @param  {string} updatedInput
   */
  handleMaxLength(inputObj, updatedInput) {
    const options = this.getOptions();
    const maxLength = options.maxLength;
    const currentInput = inputObj[options.inputName];
    const condition = updatedInput.length - 1 >= maxLength;

    if (
      /**
       * If pressing this button won't add more characters
       * We exit out of this limiter function
       */
      updatedInput.length <= currentInput.length
    ) {
      return false;
    }

    if (Number.isInteger(maxLength)) {
      if (options.debug) {
        console.log("maxLength (num) reached:", condition);
      }

      if (condition) {
        /**
         * @type {boolean} Boolean value that shows whether maxLength has been reached
         */
        this.maxLengthReached = true;
        return true;
      } else {
        this.maxLengthReached = false;
        return false;
      }
    }

    if (typeof maxLength === "object") {
      const condition = updatedInput.length - 1 >= maxLength[options.inputName];

      if (options.debug) {
        console.log("maxLength (obj) reached:", condition);
      }

      if (condition) {
        this.maxLengthReached = true;
        return true;
      } else {
        this.maxLengthReached = false;
        return false;
      }
    }
  }

  /**
   * Gets the current value of maxLengthReached
   */
  isMaxLengthReached() {
    return Boolean(this.maxLengthReached);
  }

  /**
   * Determines whether a touch device is being used
   */
  isTouchDevice() {
    return "ontouchstart" in window || navigator.maxTouchPoints;
  }

  /**
   * Determines whether pointer events are supported
   */
  pointerEventsSupported() {
    return window.PointerEvent;
  }

  /**
   * Bind all methods in a given class
   */

  static bindMethods(myClass, instance) {
    // eslint-disable-next-line no-unused-vars
    for (const myMethod of Object.getOwnPropertyNames(myClass.prototype)) {
      const excludeMethod =
        myMethod === "constructor" || myMethod === "bindMethods";
      if (!excludeMethod) {
        instance[myMethod] = instance[myMethod].bind(instance);
      }
    }
  }

  /**
   * Transforms an arbitrary string to camelCase
   *
   * @param  {string} str The string to transform.
   */
  camelCase(str) {
    if (!str) return false;

    return str
      .toLowerCase()
      .trim()
      .split(/[.\-_\s]/g)
      .reduce((str, word) =>
        word.length ? str + word[0].toUpperCase() + word.slice(1) : str
      );
  }

  static noop = () => {};
}

export default Utilities;
