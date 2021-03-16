import Keyboard from "../lib";
import "./css/DOMElementDemo.css";

class Demo {
  constructor() {
    const rootDOM =
      document.querySelector("body") || document.createElement("div");

    const keyboard1DOM = document.createElement("div");
    keyboard1DOM.className = "my-keyboard";

    const keyboard2DOM = document.createElement("div");
    keyboard2DOM.className = "my-keyboard2";

    /**
     * Demo Start
     */
    this.keyboard1 = new Keyboard(keyboard1DOM, {
      onChange: input => console.log(this.keyboard1.keyboardDOMClass, input)
    });

    this.keyboard2 = new Keyboard(keyboard2DOM, {
      onChange: input => console.log(this.keyboard2.keyboardDOMClass, input)
    });

    rootDOM.appendChild(keyboard1DOM);
    rootDOM.appendChild(keyboard2DOM);
  }
}

export default Demo;
