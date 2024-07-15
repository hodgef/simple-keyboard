import Keyboard from "../lib";
import "./css/CandidateBoxDemo.css";

const setDOM = () => {
  document.querySelector("body").innerHTML = `
    <input class="input" placeholder="Tap on the virtual keyboard to start" />
    <div class="simple-keyboard"></div>
  `;
};

class Demo {
  constructor() {
    setDOM();

    /**
     * Demo Start
     */
    this.keyboard = new Keyboard({
      onChange: input => this.onChange(input),
      onKeyPress: button => this.onKeyPress(button),
      preventMouseDownDefault: true,
      layoutCandidatesPageSize: 15,
      layoutCandidates: {
        ni: "你 尼 你 尼 你 尼 你 尼 你 尼 你 尼 你 尼 你 尼 你 尼 你 尼",
        hao: "好 号"
      }
    });

    /**
     * Update simple-keyboard when input is changed directly
     */
    document.querySelector(".input").addEventListener("input", event => {
      this.keyboard.setInput(event.target.value);
    });
  }

  onChange(input) {
    const inputElement = document.querySelector(".input");

    /**
     * Updating input's value
     */
    inputElement.value = input;
    console.log("Input changed", input);

    /**
     * Synchronizing input caret position
     */
    const caretPosition = this.keyboard.caretPosition;
    if (caretPosition !== null)
      this.setInputCaretPosition(inputElement, caretPosition);

    console.log("caretPosition", caretPosition);
  }

  setInputCaretPosition(elem, pos) {
    if (elem.setSelectionRange) {
      elem.focus();
      elem.setSelectionRange(pos, pos);
    }
  }

  onKeyPress(button) {
    console.log("Button pressed", button);

    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button === "{shift}" || button === "{lock}") this.handleShift();
  }

  handleShift() {
    const currentLayout = this.keyboard.options.layoutName;
    const shiftToggle = currentLayout === "default" ? "shift" : "default";

    this.keyboard.setOptions({
      layoutName: shiftToggle
    });
  }
}

export default Demo;
