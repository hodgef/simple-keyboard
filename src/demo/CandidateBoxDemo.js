import { is } from "core-js/core/object";
import Keyboard from "../lib";
import "./css/CandidateBoxDemo.css";
import layout from "simple-keyboard-layouts/build/layouts/arabic";
import korean from "simple-keyboard-layouts/build/layouts/korean";

const setDOM = () => {
  document.querySelector("body").innerHTML = `
    <input class="input" placeholder="Tap on the virtual keyboard to start" />
    <div class="simple-keyboard"></div>
  `;
};

class Demo {
  isShiftActive = false;
  shiftTimeout = null;

  constructor() {
    setDOM();

    /**
     * Demo Start
     */
    this.keyboard = new Keyboard({
      onChange: (input) => this.onChange(input),
      onKeyPress: (button) => this.onKeyPress(button),
      preventMouseDownDefault: true,
      ...korean,
      layoutCandidates: korean.layoutCandidates,
      layoutCandidatesPageSize: 15,
      enableLayoutCandidatesKeyPress: true,
      physicalKeyboardHighlight: true,
      physicalKeyboardHighlightPress: true,
      physicalKeyboardHighlightPressUseClick: true,
      physicalKeyboardHighlightPressUsePointerEvents: true,
      physicalKeyboardHighlightPreventDefault: true,
      physicalKeyboardHighlightPressPreventDefault: true,
    });

    /**
     * Update simple-keyboard when input is changed directly
     */
    document.querySelector(".input").addEventListener("input", (event) => {
      this.keyboard.setInput(event.target.value);
    });
  }

  onChange(input) {
    const inputElement = document.querySelector(".input");

    /**
     * Updating input's value
     */
    inputElement.value = input;

    /**
     * Synchronizing input caret position
     */
    const caretPosition = this.keyboard.caretPosition;
    if (caretPosition !== null) this.setInputCaretPosition(inputElement, caretPosition);

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

    if (button === "{shift}") {
      if (!this.isShiftActive) {
        this.isShiftActive = true;
        this.handleShift();

        if (this.shiftTimeout) {
          clearTimeout(this.shiftTimeout);
        }

        this.shiftTimeout = setTimeout(() => {
          this.isShiftActive = false;
          this.handleShift();
        }, 750); // we need to find a sweet spot for this bewteen 500 and 1200ms
      }
    } else if (button === "{lock}") {
      this.isShiftActive = !this.isShiftActive;
      this.handleShift();
    }
  }

  handleShift() {
    const currentLayout = this.keyboard.options.layoutName;
    const shiftToggle = currentLayout === "default" ? "shift" : "default";

    this.keyboard.setOptions({
      layoutName: shiftToggle,
    });
  }
}

export default Demo;
