class Utilities {
  static normalizeString(string){
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

  static getButtonClass = button => {
    let buttonTypeClass = (button.includes("{") && button !== '{//}') ? "functionBtn" : "standardBtn";
    let buttonWithoutBraces = button.replace("{", "").replace("}", "");

    let buttonNormalized =
      buttonTypeClass === "standardBtn" ?
        Utilities.normalizeString(buttonWithoutBraces) : ` hg-button-${buttonWithoutBraces}`;

    return `hg-${buttonTypeClass}${buttonNormalized}`;
  }

  static getDefaultDiplay(){
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

  static getButtonDisplayName = (button, display, mergeDisplay) => {
    if(mergeDisplay){
      display = Object.assign({}, Utilities.getDefaultDiplay(), display);
    } else {
      display = display || Utilities.getDefaultDiplay();
    }

    return display[button] || button;
  }

  static getUpdatedInput = (button, input, options) => {
    let output = input;
    let newLineOnEnter = options.newLineOnEnter;

    if((button === "{bksp}" || button === "{backspace}") && output.length > 0){
      /**
       * Emojis are made out of two characters, so we must take a custom approach to trim them.
       * For more info: https://mathiasbynens.be/notes/javascript-unicode
       */
      let lastTwoChars = output.slice(-2);
      let emojiMatched = lastTwoChars.match(/([\uD800-\uDBFF][\uDC00-\uDFFF])/g);

      if(emojiMatched){
        output = output.slice(0, -2);
      } else {
        output = output.slice(0, -1);
      }
    } else if(button === "{space}")
      output = output + ' ';
    else if(button === "{tab}")
      output = output + "\t";
    else if((button === "{enter}" || button === "{numpadenter}") && newLineOnEnter)
      output = output + "\n";
    else if(button.includes("numpad") && Number.isInteger(Number(button[button.length - 2]))){
      output = output + button[button.length - 2];
    }
    else if(button === "{numpaddivide}")
      output = output + '/';
    else if(button === "{numpadmultiply}")
      output = output + '*';
    else if(button === "{numpadsubtract}")
      output = output + '-';
    else if(button === "{numpadadd}")
      output = output + '+';
    else if(button === "{numpadadd}")
      output = output + '+';
    else if(button === "{numpaddecimal}")
      output = output + '.';
    else if(!button.includes("{") && !button.includes("}"))
      output = output + button;

    return output;
  }

  static camelCase = (string) => {
    return string.toLowerCase().trim().split(/[.\-_\s]/g).reduce((string, word) => string + word[0].toUpperCase() + word.slice(1));
  };

}

export default Utilities;