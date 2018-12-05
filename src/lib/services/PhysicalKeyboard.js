/**
 * Physical Keyboard Service
 */
class PhysicalKeyboard {
  /**
   * Creates an instance of the PhysicalKeyboard service
   */
  constructor(simpleKeyboardInstance) {
    /**
     * @type {object} A simple-keyboard instance
     */
    this.simpleKeyboardInstance = simpleKeyboardInstance;

    /**
     * Initialize key listeners
     */
    this.initKeyboardListener();
  }

  /**
   * Initializes key event listeners
   */
  initKeyboardListener = () => {
    // Adding button style on keydown
    document.addEventListener('keydown', (event) => {
      if (this.simpleKeyboardInstance.options.physicalKeyboardHighlight) {
        const buttonPressed = this.getSimpleKeyboardLayoutKey(event);

        this.simpleKeyboardInstance.dispatch(instance => {
          const buttonDOM = instance.getButtonElement(buttonPressed) || instance.getButtonElement(`{${buttonPressed}}`);

          if (buttonDOM) {
            buttonDOM.style.backgroundColor = this.simpleKeyboardInstance.options.physicalKeyboardHighlightBgColor || '#9ab4d0';
            buttonDOM.style.color = this.simpleKeyboardInstance.options.physicalKeyboardHighlightTextColor || 'white';
          }
        });
      }
    });

    // Removing button style on keyup
    document.addEventListener('keyup', event => {
      if (this.simpleKeyboardInstance.options.physicalKeyboardHighlight) {
        const buttonPressed = this.getSimpleKeyboardLayoutKey(event);

        this.simpleKeyboardInstance.dispatch(instance => {
          const buttonDOM = instance.getButtonElement(buttonPressed) || instance.getButtonElement(`{${buttonPressed}}`);

          if (buttonDOM && buttonDOM.removeAttribute) {
            buttonDOM.removeAttribute('style');
          }
        });
      }
    });
  }

  /**
   * Transforms a KeyboardEvent's 'key.code' string into a simple-keyboard layout format
   * @param  {object} event The KeyboardEvent
   */
  getSimpleKeyboardLayoutKey = ({ code, key }) => {
    let output;

    if (
      code.includes('Numpad') ||
      code.includes('Shift') ||
      code.includes('Space') ||
      code.includes('Backspace') ||
      code.includes('Control') ||
      code.includes('Alt') ||
      code.includes('Meta')
    ) {
      output = code;
    } else {
      output = key;
    }

    /**
     * If button is not uppercase, casting to lowercase
     */
    if (
      output !== output.toUpperCase() ||
      (code[0] === 'F' && Number.isInteger(Number(code[1])) && code.length <= 3)
    ) {
      output = output.toLowerCase();
    }

    return output;
  }
}

export default PhysicalKeyboard;