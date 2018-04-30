import Keyboard from '../lib';
import './css/MultipleInputsDemo.css';

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
      onKeyPress: button => this.onKeyPress(button)
    });

    /**
     * Adding preview (demo only)
     * In production, this would be part of your HTML file
     */
    document.querySelector('.simple-keyboard').insertAdjacentHTML('beforebegin', `
      <div>
        <label>Input 1</label>
        <input class="input" id="input1" value=""/>
      </div>
      <div>
        <label>Input 2</label>
        <input class="input" id="input2" value=""/>
      </div>
    `);

    /**
     * Changing active input onFocus
     */
    document.querySelectorAll('.input')
      .forEach(input => input.addEventListener('focus', this.onInputFocus));
  
    console.log(this.keyboard);
  }

  onInputFocus = event => {
    this.selectedInput = `#${event.target.id}`;
    
    this.keyboard.setOptions({
      inputName: event.target.id
    });
  }

  onChange = input => {
    let currentInput = this.selectedInput || '.input';
    document.querySelector(currentInput).value = input;
  }

  onKeyPress = button => {
    console.log("Button pressed", button);
  
      /**
       * Shift functionality
       */
      if(button === "{lock}" || button === "{shift}")
        this.handleShiftButton();
  }

  handleShiftButton = () => {
    let layoutName = this.layoutName;
    let shiftToggle = this.layoutName = layoutName === "default" ? "shift" : "default";
  
    this.keyboard.setOptions({
      layoutName: shiftToggle
    });
  }

}

export default App;