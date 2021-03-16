import Keyboard from "../lib";
import "./css/ButtonThemeDemo.css";

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
      theme: "hg-theme-default my-theme",
      onChange: input => this.onChange(input),
      onKeyPress: button => this.onKeyPress(button),
      buttonTheme: [
        {
          class: "my-button",
          buttons: "{enter} {bksp} q Q"
        },
        {
          class: "my-button-outline",
          buttons: "q Q b B"
        }
      ],
      buttonAttributes: [
        {
          attribute: "aria-label",
          value: "bee",
          buttons: "b B"
        }
      ]
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
    console.log("Input changed", input);
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
