import Keyboard from "../lib";
import "./css/MultipleKeyboardsDestroyDemo.css";

const setDOM = () => {
  document.querySelector("body").innerHTML = `
    <input class="input" placeholder="Tap on the virtual keyboard to start" />
    <div class="simple-keyboard"></div>

    <input class="input2" placeholder="Tap on the virtual keyboard to start" />
    <div class="keyboard2"></div>
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
      debug: true
    });

    this.keyboard2 = new Keyboard(".keyboard2", {
      theme: "simple-keyboard hg-theme-default",
      onChange: input => this.onChange(input, "input2"),
      onKeyPress: button => this.onKeyPress(button, "keyboard2"),
      debug: true
    });

    console.log(this.keyboard);
    setTimeout(() => {
      this.keyboard.destroy();
      document.querySelector(".input").value = "";
    }, 10000);
    setTimeout(() => {
      this.keyboard = new Keyboard({
        theme: "hg-theme-default myTheme",
        onChange: input => this.onChange(input),
        onKeyPress: button => this.onKeyPress(button),
        debug: true,
        onInit: () => {
          console.log(
            "Reinitialized simple-keyboard instance:",
            this.keyboard.keyboardDOMClass
          );
        }
      });
    }, 15000);

    /**
     * Update simple-keyboard when input is changed directly
     */
    document.querySelector(".input").addEventListener("input", event => {
      this.keyboard.setInput(event.target.value);
    });

    document.querySelector(".input2").addEventListener("input", event => {
      this.keyboard2.setInput(event.target.value);
    });
  }

  onChange(input, inputClass) {
    document.querySelector(`.${inputClass || "input"}`).value = input;
    console.log("Input changed", input);
  }

  onKeyPress(button, keyboardInstanceKey) {
    console.log("Button pressed", button);

    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button === "{shift}" || button === "{lock}")
      this.handleShift(keyboardInstanceKey);
  }

  handleShift(keyboardInstanceKey) {
    const keyboard = this[keyboardInstanceKey || "keyboard"];
    const currentLayout = keyboard.options.layoutName;
    const shiftToggle = currentLayout === "default" ? "shift" : "default";

    keyboard.setOptions({
      layoutName: shiftToggle
    });
  }
}

export default Demo;
