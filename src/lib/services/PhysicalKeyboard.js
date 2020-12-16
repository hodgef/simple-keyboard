import Utilities from "../services/Utilities";

/**
 * Physical Keyboard Service
 */
class PhysicalKeyboard {
  /**
   * Creates an instance of the PhysicalKeyboard service
   */
  constructor({ dispatch, getOptions }) {
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

  handleHighlightKeyDown(event) {
    const options = this.getOptions();
    const buttonPressed = this.getSimpleKeyboardLayoutKey(event);

    this.dispatch(instance => {
      const buttonDOM =
        instance.getButtonElement(buttonPressed) ||
        instance.getButtonElement(`{${buttonPressed}}`);

      if (buttonDOM) {
        buttonDOM.style.backgroundColor =
          options.physicalKeyboardHighlightBgColor || "#dadce4";
        buttonDOM.style.color =
          options.physicalKeyboardHighlightTextColor || "black";

        if (options.physicalKeyboardHighlightPress) {
          /**
           * Trigger pointerdown
           */
          (
            buttonDOM.onpointerdown ||
            buttonDOM.onmousedown ||
            buttonDOM.ontouchstart ||
            Utilities.noop
          )();
        }
      }
    });
  }

  handleHighlightKeyUp(event) {
    const options = this.getOptions();
    const buttonPressed = this.getSimpleKeyboardLayoutKey(event);

    this.dispatch(instance => {
      const buttonDOM =
        instance.getButtonElement(buttonPressed) ||
        instance.getButtonElement(`{${buttonPressed}}`);

      if (buttonDOM && buttonDOM.removeAttribute) {
        buttonDOM.removeAttribute("style");

        if (options.physicalKeyboardHighlightPress) {
          /**
           * Trigger pointerup
           */
          (
            buttonDOM.onpointerup ||
            buttonDOM.onmouseup ||
            buttonDOM.ontouchend ||
            Utilities.noop
          )();
        }
      }
    });
  }

  /**
   * Transforms a KeyboardEvent's "key.code" string into a simple-keyboard layout format
   * @param  {object} event The KeyboardEvent
   */
  getSimpleKeyboardLayoutKey(event) {
    let output;

    if (
      event.code.includes("Numpad") ||
      event.code.includes("Shift") ||
      event.code.includes("Space") ||
      event.code.includes("Backspace") ||
      event.code.includes("Control") ||
      event.code.includes("Alt") ||
      event.code.includes("Meta")
    ) {
      output = event.code;
    } else {
      output = event.key;
    }

    /**
     * Casting key to lowercase
     */
    if (
      (output && output !== output.toUpperCase()) ||
      (event.code[0] === "F" &&
        Number.isInteger(Number(event.code[1])) &&
        event.code.length <= 3)
    ) {
      output = output ? output.toLowerCase() : output;
    }

    return output;
  }
}

export default PhysicalKeyboard;
