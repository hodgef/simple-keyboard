import Keyboard from "../lib";
import "./css/App.css";

/**
 * simple-keyboard demo
 */
class App {
  /**
   * Instantiates the demo class
   */
  constructor() {
    document.addEventListener("DOMContentLoaded", this.onDOMLoaded);

    /**
     * Default input name
     * @type {string}
     */
    this.layoutName = "default";
  }

  /**
   * Executed when the DOM is ready
   */
  onDOMLoaded = () => {
    /**
     * Creates a new simple-keyboard instance
     */
    this.keyboard = new Keyboard({
      debug: true,
      layoutName: this.layoutName,
      onChange: input => this.onChange(input),
      onKeyPress: button => this.onKeyPress(button),
      newLineOnEnter: true,
      physicalKeyboardHighlight: true
    });

    /**
     * Adding preview (demo only)
     */
    document.querySelector(".simple-keyboard").insertAdjacentHTML(
      "beforebegin",
      `
    <div class="simple-keyboard-preview">
      <textarea class="input"></textarea>
    </div>
    `
    );

    document.querySelector(".input").addEventListener("input", event => {
      this.keyboard.setInput(event.target.value);
    });
  };

  /**
   * Handles shift functionality
   */
  handleShiftButton = () => {
    let layoutName = this.layoutName;
    let shiftToggle = (this.layoutName =
      layoutName === "default" ? "shift" : "default");

    this.keyboard.setOptions({
      layoutName: shiftToggle
    });
  };

  /**
   * Called when simple-keyboard input has changed
   */
  onChange = input => {
    document.querySelector(".input").value = input;
  };

  /**
   * Called when a simple-keyboard key is pressed
   */
  onKeyPress = button => {
    console.log("Button pressed", button);

    /**
     * Shift functionality
     */
    if (button === "{lock}" || button === "{shift}") this.handleShiftButton();
  };
}

export default App;
