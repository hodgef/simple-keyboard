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
      '{enter}': '< enter',
      '{shift}': 'shift',
      '{s}': 'shift',
      '{tab}': 'tab',
      '{lock}': 'caps',
      '{accept}': 'Submit',
      '{space}': ' ',
      '{//}': ' '
    };
  }

  static getButtonDisplayName = (button, display) => {
    display = display || Utilities.getDefaultDiplay();
    return display[button] || button;
  }

  static getUpdatedInput = (button, input, options) => {
    let output = input;
    let newLineOnEnter = options.newLineOnEnter;

    if(button === "{bksp}" && output.length > 0)
      output = output.slice(0, -1);
    else if(button === "{space}")
      output = output + ' ';
    else if(button === "{tab}")
      output = output + "\t";
    else if(button === "{enter}" && newLineOnEnter)
      output = output + "\n";
    else if(!button.includes("{") && !button.includes("}"))
      output = output + button;

    return output;
  }
}

export default Utilities;