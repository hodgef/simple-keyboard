import Keyboard from '../lib';
import './css/FullKeyboardDemo.css';

class App {
  constructor(){
    document.addEventListener('DOMContentLoaded', this.onDOMLoaded);

    this.keyboardSections = [];
  }

  onDOMLoaded = () => {
    /**
     * Adding preview (demo only)
     * In production, this would be part of your HTML file
     */
    document.querySelector('.simple-keyboard').insertAdjacentHTML('beforebegin', `
    <input class="input" placeholder="Tap on the virtual keyboard to start" />

    <div class="keyboardContainer">
      <div class="simple-keyboard-main"></div>
  
      <div class="controlArrows">
        <div class="simple-keyboard-control"></div>
        <div class="simple-keyboard-arrows"></div>
      </div>
  
      <div class="numPad">
        <div class="simple-keyboard-numpad"></div>
        <div class="simple-keyboard-numpadEnd"></div>
      </div>
      
    </div>
    `);
    document.querySelector('.simple-keyboard').outerHTML = "";


    /**
     * Start of demo
     */
    this.commonKeyboardOptions = {
      onChange: input => this.onChange(input),
      onKeyPress: button => this.onKeyPress(button),
      theme: "simple-keyboard hg-theme-default hg-layout-default",
      physicalKeyboardHighlight: true,
      syncInstanceInputs: true,
      mergeDisplay: true
    };
    
    this.keyboard = new Keyboard(".simple-keyboard-main", {
      ...this.commonKeyboardOptions,
      layout: {
        default: [
          "{escape} {f1} {f2} {f3} {f4} {f5} {f6} {f7} {f8} {f9} {f10} {f11} {f12}",
          "` 1 2 3 4 5 6 7 8 9 0 - = {backspace}",
          "{tab} q w e r t y u i o p [ ] \\",
          "{capslock} a s d f g h j k l ; ' {enter}",
          "{shiftleft} z x c v b n m , . / {shiftright}",
          ".com @ {space}"
        ],
        shift: [
          "{escape} {f1} {f2} {f3} {f4} {f5} {f6} {f7} {f8} {f9} {f10} {f11} {f12}",
          "~ ! @ # $ % ^ & * ( ) _ + {backspace}",
          "{tab} Q W E R T Y U I O P { } |",
          '{capslock} A S D F G H J K L : " {enter}',
          "{shiftleft} Z X C V B N M < > ? {shiftright}",
          ".com @ {space}"
        ]
      }
    });
    
    this.keyboardControlPad = new Keyboard(".simple-keyboard-control", {
      ...this.commonKeyboardOptions,
      layout: {
        default: [
          "{prtscr} {scrolllock} {pause}",
          "{insert} {home} {pageup}",
          "{delete} {end} {pagedown}"
        ]
      }
    });
    
    this.keyboardArrows = new Keyboard(".simple-keyboard-arrows", {
      ...this.commonKeyboardOptions,
      layout: {
        default: ["{arrowup}", "{arrowleft} {arrowdown} {arrowright}"]
      }
    });
    
    this.keyboardNumPad = new Keyboard(".simple-keyboard-numpad", {
      ...this.commonKeyboardOptions,
      layout: {
        default: [
          "{numlock} {numpaddivide} {numpadmultiply}",
          "{numpad7} {numpad8} {numpad9}",
          "{numpad4} {numpad5} {numpad6}",
          "{numpad1} {numpad2} {numpad3}", "{numpad0} {numpaddecimal}"]
      }
    });
    
    this.keyboardNumPadEnd = new Keyboard(".simple-keyboard-numpadEnd", {
      ...this.commonKeyboardOptions,
      layout: {
        default: ["{numpadsubtract}", "{numpadadd}", "{numpadenter}"]
      }
    });

    /**
     * Physical Keyboard support
     * Whenever the input is changed with the keyboard, updating SimpleKeyboard's internal input
     */
    document.querySelector(".input").addEventListener("keyup", () => {
      let input = document.querySelector(".input").value;
      this.keyboard.setInput(input);
    });

    /*
    // Uncomment this to test the function keys (f1-12)
    document.addEventListener("keydown", (event) => {
      event.preventDefault();
    });*/
  }

  onChange = (input) => {
    document.querySelector(".input").value = input;
    this.keyboard.setInput(input);

    console.log("Input changed", input);
  }
  
  onKeyPress = (button) => {
    console.log("Button pressed", button);
  
    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button === "{shift}" || button === "{shiftleft}" || button === "{shiftright}" || button === "{capslock}") this.handleShift();
  }
  
  handleShift = () => {
    let currentLayout = this.keyboard.options.layoutName;
    let shiftToggle = currentLayout === "default" ? "shift" : "default";
  
    this.keyboard.setOptions({
      layoutName: shiftToggle
    });
  }

}

export default App;