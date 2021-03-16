import Keyboard from "../lib";
import "./css/RTLDemo.css";

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
      rtl: true,
      layout: {
        default: [
          "\u05e5 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
          "{tab} \u05e3 \u05df \u05e7 \u05e8 \u05d0 \u05d8 \u05d5 \u05ea \u05dd \u05e4 ] [ \\",
          "{lock} \u05e9 \u05d3 \u05d2 \u05db \u05e2 \u05d9 \u05d7 \u05dc \u05da : ' {enter}",
          "{shift} \u05d6 \u05e1 \u05d1 \u05d4 \u05e0 \u05de \u05e6 , . / {shift}",
          ".com @ {space}"
        ],
        shift: [
          "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
          "{tab} Q W E R T Y U I O P { } |",
          '{lock} A S D F G H J K L : " {enter}',
          "{shift} Z X C V B N M < > ? {shift}",
          ".com @ {space}"
        ]
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
    document.querySelector(".input").value = input;
    console.log("Input changed", input, input.split(""));
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
