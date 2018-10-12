class Utilities {
  constructor(simpleKeyboardInstance){
    this.simpleKeyboardInstance = simpleKeyboardInstance;
  }

  normalizeString(string){
    let output;

    if(string === "@")
      output = 'at';
    else if(string === ",")
      output = 'comma';
    else if(string === ".")
      output = 'dot';
    else if(string === "\\")
      output = 'backslash';
    else if(string === "/")
      output = 'fordardslash';
    else if(string === "*")
      output = 'asterisk';
    else if(string === "&")
      output = 'ampersand';
    else if(string === "$")
      output = 'dollarsign';
    else if(string === "=")
      output = 'equals';
    else if(string === "+")
      output = 'plus';
    else if(string === "-")
      output = 'minus';
    else if(string === "'")
      output = 'apostrophe';
    else if(string === ";")
      output = 'colon';
    else if(string === "[")
      output = 'openbracket';
    else if(string === "]")
      output = 'closebracket';
    else if(string === "//")
      output = 'emptybutton';
    else if(string === ".com")
      output = 'com';
    else
      output = '';

    return output ? ` hg-button-${output}` : '';
  }

  getButtonClass = button => {
    let buttonTypeClass = (button.includes("{") && button.includes("}") && button !== '{//}') ? "functionBtn" : "standardBtn";
    let buttonWithoutBraces = button.replace("{", "").replace("}", "");

    let buttonNormalized =
      buttonTypeClass === "standardBtn" ?
        this.normalizeString(buttonWithoutBraces) : ` hg-button-${buttonWithoutBraces}`;

    return `hg-${buttonTypeClass}${buttonNormalized}`;
  }

  getDefaultDiplay(){
    return {
      '{bksp}': 'backspace',
      '{backspace}': 'backspace',
      '{enter}': '< enter',
      '{shift}': 'shift',
      '{shiftleft}': 'shift',
      '{shiftright}': 'shift',
      '{alt}': 'alt',
      '{s}': 'shift',
      '{tab}': 'tab',
      '{lock}': 'caps',
      '{capslock}': 'caps',
      '{accept}': 'Submit',
      '{space}': ' ',
      '{//}': ' ',
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
      '{numpaddivide}': '/',
      '{numlock}': 'lock',
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
      "{numpad9}": "9",
    };
  }

  getButtonDisplayName = (button, display, mergeDisplay) => {
    if(mergeDisplay){
      display = Object.assign({}, this.getDefaultDiplay(), display);
    } else {
      display = display || this.getDefaultDiplay();
    }

    return display[button] || button;
  }

  getUpdatedInput = (button, input, options, caretPos) => {
    
    let output = input;

    if((button === "{bksp}" || button === "{backspace}") && output.length > 0){
      output = this.removeAt(output, caretPos);

    } else if(button === "{space}")
      output = this.addStringAt(output, " ", caretPos);

    else if(button === "{tab}" && !(typeof options.tabCharOnTab === "boolean" && options.tabCharOnTab === false)){
      output = this.addStringAt(output, "\t", caretPos);

    } else if((button === "{enter}" || button === "{numpadenter}") && options.newLineOnEnter)
      output = this.addStringAt(output, "\n", caretPos);

    else if(button.includes("numpad") && Number.isInteger(Number(button[button.length - 2]))){
      output = this.addStringAt(output, button[button.length - 2], caretPos);
    }
    else if(button === "{numpaddivide}")
      output = this.addStringAt(output, '/', caretPos);

    else if(button === "{numpadmultiply}")
      output = this.addStringAt(output, '*', caretPos);
    else if(button === "{numpadsubtract}")
      output = this.addStringAt(output, '-', caretPos);

    else if(button === "{numpadadd}")
      output = this.addStringAt(output, '+', caretPos);

    else if(button === "{numpadadd}")
      output = this.addStringAt(output, '+', caretPos);

    else if(button === "{numpaddecimal}")
      output = this.addStringAt(output, '.', caretPos);

    else if(button === "{" || button === "}")
      output = this.addStringAt(output, button, caretPos);

    else if(!button.includes("{") && !button.includes("}"))
      output = this.addStringAt(output, button, caretPos);

    return output;
  }

  updateCaretPos = (length, minus) => {
    if(minus){
      if(this.simpleKeyboardInstance.caretPosition > 0)
        this.simpleKeyboardInstance.caretPosition = this.simpleKeyboardInstance.caretPosition - length
    } else {
      this.simpleKeyboardInstance.caretPosition = this.simpleKeyboardInstance.caretPosition + length;
    }
  }

  addStringAt(source, string, position){
    let output;

    if(this.simpleKeyboardInstance.options.debug){
      console.log("Caret at:", position);
    }

    if(!position && position !== 0){
      output = source + string;
    } else {
      output = [source.slice(0, position), string, source.slice(position)].join('');

      /**
       * Avoid caret position change when maxLength is set
       */
      if(!this.isMaxLengthReached()){
        this.updateCaretPos(string.length);
      }

    }

    return output;
  }

  removeAt(source, position){
    if(this.simpleKeyboardInstance.caretPosition === 0){
      return source;
    }

    let output;
    let prevTwoChars;
    let emojiMatched;
    let emojiMatchedReg = /([\uD800-\uDBFF][\uDC00-\uDFFF])/g;

    /**
     * Emojis are made out of two characters, so we must take a custom approach to trim them.
     * For more info: https://mathiasbynens.be/notes/javascript-unicode
     */
    if(position && position >= 0){
      prevTwoChars = source.substring(position - 2, position)
      emojiMatched = prevTwoChars.match(emojiMatchedReg);

      if(emojiMatched){
        output = source.substr(0, (position - 2)) + source.substr(position);
        this.updateCaretPos(2, true);
      } else {
        output = source.substr(0, (position - 1)) + source.substr(position);
        this.updateCaretPos(1, true);
      }
    } else {
      prevTwoChars = source.slice(-2);
      emojiMatched = prevTwoChars.match(emojiMatchedReg);

      if(emojiMatched){
        output = source.slice(0, -2);
        this.updateCaretPos(2, true);
      } else {
        output = source.slice(0, -1);
        this.updateCaretPos(1, true);
      }
    }

    return output;
  }

  handleMaxLength(inputObj, options, updatedInput){
    let maxLength = options.maxLength;
    let currentInput = inputObj[options.inputName];
    let condition = currentInput.length === maxLength;


    if(
      /**
       * If pressing this button won't add more characters
       * We exit out of this limiter function
       */
      updatedInput.length <= currentInput.length
    ){
      return false;
    }

    if(Number.isInteger(maxLength)){
      if(options.debug){
        console.log("maxLength (num) reached:", condition);
      }

      if(condition){
        this.maxLengthReached = true;
        return true;
      } else {
        this.maxLengthReached = false;
        return false;
      }
    }

    if(typeof maxLength === "object"){
      let condition = currentInput.length === maxLength[options.inputName];

      if(options.debug){
        console.log("maxLength (obj) reached:", condition);
      }

      if(condition){
        this.maxLengthReached = true;
        return true;
      } else {
        this.maxLengthReached = false;
        return false;
      }
    }
  }

  isMaxLengthReached = () => {
    return Boolean(this.maxLengthReached);
  }

  camelCase = (string) => {
    return string.toLowerCase().trim().split(/[.\-_\s]/g).reduce((string, word) => string + word[0].toUpperCase() + word.slice(1));
  };

}

export default Utilities;