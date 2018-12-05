import { defaultDisplay } from './display'

/**
 * Utility Service
 */
class Utilities {
  /**
   * Creates an instance of the Utility service
   */
  constructor(simpleKeyboardInstance) {
    /**
     * @type {object} A simple-keyboard instance
     */
    this.simpleKeyboardInstance = simpleKeyboardInstance;
  }

  /**
   * Adds default classes to a given button
   * 
   * @param  {string} button The button's layout name
   * @return {string} The classes to be added to the button
   */
  getButtonClass = button => {
    const buttonTypeClass = (button.includes("{") && button.includes("}") && button !== '{//}') ? "functionBtn" : "standardBtn";
    const buttonWithoutBraces = button.replace("{", "").replace("}", "");
    const buttonNormalized = buttonTypeClass !== "standardBtn" ? ` hg-button-${buttonWithoutBraces}` : '';

    return `hg-${buttonTypeClass}${buttonNormalized}`;
  }

  /**
   * Returns the display (label) name for a given button
   * 
   * @param  {string} button The button's layout name
   * @param  {object} display The provided display option
   * @param  {boolean} mergeDisplay Whether the provided param value should be merged with the default one.
   */
  getButtonDisplayName = (button, display, mergeDisplay) => {
    if (mergeDisplay) {
      display = Object.assign({}, defaultDisplay, display);
    } else {
      display = display || defaultDisplay;
    }

    return display[button] || button;
  }


  /**
   * Returns the updated input resulting from clicking a given button
   * 
   * @param  {string} button The button's layout name
   * @param  {string} input The input string
   * @param  {object} options The simple-keyboard options object
   * @param  {number} caretPos The cursor's current position
   * @param  {boolean} moveCaret Whether to update simple-keyboard's cursor
   */
  getUpdatedInput = (button, input, options, caretPos, moveCaret) => {
    let output = input;

    if ((button === "{bksp}" || button === "{backspace}") && output.length > 0) {
      output = this.removeAt(output, caretPos, moveCaret);

    } else if (button === "{space}")
      output = this.addStringAt(output, " ", caretPos, moveCaret);

    else if (button === "{tab}" && !(typeof options.tabCharOnTab === "boolean" && options.tabCharOnTab === false)) {
      output = this.addStringAt(output, "\t", caretPos, moveCaret);

    } else if ((button === "{enter}" || button === "{numpadenter}") && options.newLineOnEnter)
      output = this.addStringAt(output, "\n", caretPos, moveCaret);

    else if (button.includes("numpad") && Number.isInteger(Number(button[button.length - 2]))) {
      output = this.addStringAt(output, button[button.length - 2], caretPos, moveCaret);
    }
    else if (button === "{numpaddivide}")
      output = this.addStringAt(output, '/', caretPos, moveCaret);

    else if (button === "{numpadmultiply}")
      output = this.addStringAt(output, '*', caretPos, moveCaret);

    else if (button === "{numpadsubtract}")
      output = this.addStringAt(output, '-', caretPos, moveCaret);

    else if (button === "{numpadadd}")
      output = this.addStringAt(output, '+', caretPos, moveCaret);

    else if (button === "{numpaddecimal}")
      output = this.addStringAt(output, '.', caretPos, moveCaret);

    else if (button === "{" || button === "}")
      output = this.addStringAt(output, button, caretPos, moveCaret);

    else if (!button.includes("{") && !button.includes("}"))
      output = this.addStringAt(output, button, caretPos, moveCaret);

    return output;
  }

  /**
   * Moves the cursor position by a given amount
   * 
   * @param  {number} length Represents by how many characters the input should be moved
   * @param  {boolean} minus Whether the cursor should be moved to the left or not.
   */
  updateCaretPos = (length, minus) => {
    const newCaretPos = this.updateCaretPosAction(this.simpleKeyboardInstance, length, minus);

    if (this.simpleKeyboardInstance.options.syncInstanceInputs) {
      this.simpleKeyboardInstance.dispatch(instance => instance.caretPosition = newCaretPos);
    }
  }

  /**
   * Action method of updateCaretPos
   * 
   * @param  {object} instance The instance whose position should be updated
   * @param  {number} length Represents by how many characters the input should be moved
   * @param  {boolean} minus Whether the cursor should be moved to the left or not.
   */
  updateCaretPosAction = (instance, length, minus) => {
    if (minus) {
      if (instance.caretPosition > 0)
        instance.caretPosition = instance.caretPosition - length;
    } else {
      instance.caretPosition = instance.caretPosition + length;
    }

    if (this.simpleKeyboardInstance.options.debug) {
      console.log("Caret at:", instance.caretPosition, `(${instance.keyboardDOMClass})`);
    }

    return instance.caretPosition;
  }

  /**
   * Adds a string to the input at a given position
   * 
   * @param  {string} source The source input
   * @param  {string} string The string to add
   * @param  {number} position The (cursor) position where the string should be added
   * @param  {boolean} moveCaret Whether to update simple-keyboard's cursor
   */
  addStringAt = (source, string, position, moveCaret) => {
    let output;

    if (!position && position !== 0) {
      output = source + string;
    } else {
      output = [source.slice(0, position), string, source.slice(position)].join('');

      /**
       * Avoid caret position change when maxLength is set
       */
      if (!this.isMaxLengthReached()) {
        if (moveCaret) this.updateCaretPos(string.length);
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
  removeAt = (source, position, moveCaret) => {
    if (this.simpleKeyboardInstance.caretPosition === 0) {
      return source;
    }

    let output;
    let prevTwoChars;
    let emojiMatched;
    const emojiMatchedReg = /([\uD800-\uDBFF][\uDC00-\uDFFF])/g;

    /**
     * Emojis are made out of two characters, so we must take a custom approach to trim them.
     * For more info: https://mathiasbynens.be/notes/javascript-unicode
     */
    if (position && position >= 0) {
      prevTwoChars = source.substring(position - 2, position)
      emojiMatched = prevTwoChars.match(emojiMatchedReg);

      if (emojiMatched) {
        output = source.substr(0, (position - 2)) + source.substr(position);
        if (moveCaret) this.updateCaretPos(2, true);
      } else {
        output = source.substr(0, (position - 1)) + source.substr(position);
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

    return output;
  }
  /**
   * Determines whether the maxLength has been reached. This function is called when the maxLength option it set.
   * 
   * @param  {object} inputObj
   * @param  {object} options
   * @param  {string} updatedInput
   */
  handleMaxLength = (inputObj, options, updatedInput) => {
    const maxLength = options.maxLength;
    const currentInput = inputObj[options.inputName];
    
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
      const condition = currentInput.length === maxLength;

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
      const condition = currentInput.length === maxLength[options.inputName];

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
  isMaxLengthReached = () => Boolean(this.maxLengthReached)

  /**
   * Transforms an arbitrary string to camelCase
   * 
   * @param  {string} string The string to transform.
   */
  camelCase = string => string.toLowerCase().trim().split(/[.\-_\s]/g).reduce((acc, word) => acc + word[0].toUpperCase() + word.slice(1))

  /**
   * Counts the number of duplicates in a given array
   * 
   * @param  {Array} array The haystack to search in
   * @param  {string} value The needle to search for
   */
  countInArray = (array, value) => array.reduce((n, x) => n + Number(x === value), 0)
}

export default Utilities;