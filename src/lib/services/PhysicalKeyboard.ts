import { KeyboardOptions, PhysicalKeyboardParams } from "../interfaces";
import Utilities from "../services/Utilities";

/**
 * Physical Keyboard Service
 */
class PhysicalKeyboard {
  getOptions: () => KeyboardOptions;
  dispatch: any;

  /**
   * Creates an instance of the PhysicalKeyboard service
   */
  constructor({ dispatch, getOptions }: PhysicalKeyboardParams) {
    /**
     * @type {object} A simple-keyboard instance
     */
    this.dispatch = dispatch;
    this.getOptions = getOptions;

    /**
     * Bindings
     */
    Utilities.bindMethods(PhysicalKeyboard, this);
  }

  handleHighlightKeyDown(e: KeyboardEvent) {
    const options = this.getOptions();

    if(options.physicalKeyboardHighlightPreventDefault && this.isModifierKey(e)){
      e.preventDefault();
      e.stopImmediatePropagation();
    }

    const buttonPressed = this.getSimpleKeyboardLayoutKey(e);

    this.dispatch((instance: any) => {
      const standardButtonPressed = instance.getButtonElement(buttonPressed);
      const functionButtonPressed = instance.getButtonElement(
        `{${buttonPressed}}`
      );
      let buttonDOM;
      let buttonName: string;

      if (standardButtonPressed) {
        buttonDOM = standardButtonPressed;
        buttonName = buttonPressed;
      } else if (functionButtonPressed) {
        buttonDOM = functionButtonPressed;
        buttonName = `{${buttonPressed}}`;
      } else {
        return;
      }

      const applyButtonStyle = (buttonElement: HTMLElement) => {
        buttonElement.style.background =
          options.physicalKeyboardHighlightBgColor || "#dadce4";
          buttonElement.style.color =
          options.physicalKeyboardHighlightTextColor || "black";
      }

      if (buttonDOM) {
        if(Array.isArray(buttonDOM)){
          buttonDOM.forEach(buttonElement => applyButtonStyle(buttonElement));

          // Even though we have an array of buttons, we just want to press one of them
          if (options.physicalKeyboardHighlightPress) {
            if (options.physicalKeyboardHighlightPressUsePointerEvents) {
              buttonDOM[0]?.onpointerdown?.(e);
            } else if (options.physicalKeyboardHighlightPressUseClick) {
              buttonDOM[0]?.click();
            } else {
              instance.handleButtonClicked(buttonName, e);
            }
          }
        } else {
          applyButtonStyle(buttonDOM);

          if (options.physicalKeyboardHighlightPress) {
            if (options.physicalKeyboardHighlightPressUsePointerEvents) {
              buttonDOM?.onpointerdown?.(e);
            } else if (options.physicalKeyboardHighlightPressUseClick) {
              buttonDOM.click();
            } else {
              instance.handleButtonClicked(buttonName, e);
            }
          }
        }
      }
    });
  }

  handleHighlightKeyUp(e: KeyboardEvent) {
    const options = this.getOptions();

    if(options.physicalKeyboardHighlightPreventDefault && this.isModifierKey(e)){
      e.preventDefault();
      e.stopImmediatePropagation();
    }
    
    const buttonPressed = this.getSimpleKeyboardLayoutKey(e);

    this.dispatch((instance: any) => {
      const buttonDOM =
        instance.getButtonElement(buttonPressed) ||
        instance.getButtonElement(`{${buttonPressed}}`);

      const applyButtonStyle = (buttonElement: HTMLElement) => {
        if(buttonElement.removeAttribute){
          buttonElement.removeAttribute("style");
        }
      };

      if (buttonDOM) {
        if(Array.isArray(buttonDOM)){
          buttonDOM.forEach(buttonElement => applyButtonStyle(buttonElement));

          // Even though we have an array of buttons, we just want to press one of them
          if (options.physicalKeyboardHighlightPressUsePointerEvents) {
            buttonDOM[0]?.onpointerup?.(e);
          }
        } else {
          applyButtonStyle(buttonDOM);

          if (options.physicalKeyboardHighlightPressUsePointerEvents) {
            buttonDOM?.onpointerup?.(e);
          }
        }
      }
    });
  }

  /**
   * Transforms a KeyboardEvent's "key.code" string into a simple-keyboard layout format
   * @param  {object} e The KeyboardEvent
   */
  getSimpleKeyboardLayoutKey(e: KeyboardEvent) {
    let output = "";
    const keyId = e.code || e.key || this.keyCodeToKey(e?.keyCode);

    if (
      keyId?.includes("Numpad") ||
      keyId?.includes("Shift") ||
      keyId?.includes("Space") ||
      keyId?.includes("Backspace") ||
      keyId?.includes("Control") ||
      keyId?.includes("Alt") ||
      keyId?.includes("Meta")
    ) {
      output = e.code || "";
    } else {
      output = e.key || this.keyCodeToKey(e?.keyCode) || "";
    }

    return output.length > 1 ? output?.toLowerCase() : output;
  }

  /**
   * Retrieve key from keyCode
   */
  keyCodeToKey(keyCode: number): string {
    return {
      8: "Backspace",
      9: "Tab",
      13: "Enter",
      16: "Shift",
      17: "Ctrl",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Esc",
      32: "Space",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      48: "0",
      49: "1",
      50: "2",
      51: "3",
      52: "4",
      53: "5",
      54: "6",
      55: "7",
      56: "8",
      57: "9",
      65: "A",
      66: "B",
      67: "C",
      68: "D",
      69: "E",
      70: "F",
      71: "G",
      72: "H",
      73: "I",
      74: "J",
      75: "K",
      76: "L",
      77: "M",
      78: "N",
      79: "O",
      80: "P",
      81: "Q",
      82: "R",
      83: "S",
      84: "T",
      85: "U",
      86: "V",
      87: "W",
      88: "X",
      89: "Y",
      90: "Z",
      91: "Meta",
      96: "Numpad0",
      97: "Numpad1",
      98: "Numpad2",
      99: "Numpad3",
      100: "Numpad4",
      101: "Numpad5",
      102: "Numpad6",
      103: "Numpad7",
      104: "Numpad8",
      105: "Numpad9",
      106: "NumpadMultiply",
      107: "NumpadAdd",
      109: "NumpadSubtract",
      110: "NumpadDecimal",
      111: "NumpadDivide",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      186: ";",
      187: "=",
      188: ",",
      189: "-",
      190: ".",
      191: "/",
      192: "`",
      219: "[",
      220: "\\",
      221: "]",
      222: "'",
    }[keyCode] || "";
  }

  isModifierKey = (e: KeyboardEvent): boolean => {
    return (
      e.altKey
      || e.ctrlKey
      || e.shiftKey
      || ["Tab", "CapsLock", "Esc", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
        e.code || e.key || this.keyCodeToKey(e?.keyCode)
      )
    )
  }
}

export default PhysicalKeyboard;
