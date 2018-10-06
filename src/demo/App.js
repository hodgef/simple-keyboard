import Keyboard from '../lib';
import './css/App.css';

class App {
  constructor(){
    document.addEventListener('DOMContentLoaded', this.onDOMLoaded);

    this.layoutName = "default";
  }

  onDOMLoaded = () => {
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
    document.querySelector('.simple-keyboard').insertAdjacentHTML('beforebegin', `
    <div class="simple-keyboard-preview">
      <textarea class="input"></textarea>
    </div>
    `);
  
    document.querySelector('.input').addEventListener('change', (event) => {
      this.keyboard.setInput(event.target.value);
    });

    console.log(this.keyboard);
  }

  handleShiftButton = () => {
    let layoutName = this.layoutName;
    let shiftToggle = this.layoutName = layoutName === "default" ? "shift" : "default";
  
    this.keyboard.setOptions({
      layoutName: shiftToggle
    });
  }

  onChange = input => {
    document.querySelector('.input').value = input;
  }

  onKeyPress = button => {
    console.log("Button pressed", button);
  
      /**
       * Shift functionality
       */
      if(button === "{lock}" || button === "{shift}")
        this.handleShiftButton();
  }

}

export default App;