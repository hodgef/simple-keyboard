import './Keyboard.css';

// Services
import PhysicalKeyboard from '../services/PhysicalKeyboard';
import KeyboardLayout from '../services/KeyboardLayout';
import Utilities from '../services/Utilities';

class SimpleKeyboard {
  constructor(...params){
    let keyboardDOMQuery = typeof params[0] === "string" ? params[0] : '.simple-keyboard';
    let options = typeof params[0] === "object" ? params[0] : params[1];

    if(!options)
      options = {};

    /**
     * Initializing Utilities
     */
    this.utilities = new Utilities(this);

    /**
     * Processing options
     */
    this.keyboardDOM = document.querySelector(keyboardDOMQuery);
    this.options = options;
    this.options.layoutName = this.options.layoutName || "default";
    this.options.theme = this.options.theme || "hg-theme-default";
    this.options.inputName = this.options.inputName || "default";
    this.input = {};
    this.input[this.options.inputName] = '';
    this.keyboardDOMClass = keyboardDOMQuery.split('.').join("");
    this.timers = {};
    this.buttonElements = {};

    /**
     * Rendering keyboard
     */
    if(this.keyboardDOM)
      this.render();
    else
      console.error(`"${keyboardDOMQuery}" was not found in the DOM.`);

    /**
     * Saving instance
     * This enables multiple simple-keyboard support with easier management
     */
    if(!window['SimpleKeyboardInstances'])
      window['SimpleKeyboardInstances'] = {};
      
    window['SimpleKeyboardInstances'][this.utilities.camelCase(this.keyboardDOMClass)] = this;

    /**
     * Physical Keyboard support
     */
    this.physicalKeyboardInterface = new PhysicalKeyboard(this);
  }

  handleButtonClicked = (button) => {
    let debug = this.options.debug;
    
    /**
     * Ignoring placeholder buttons
     */
    if(button === '{//}')
      return false;

    /**
     * Calling onKeyPress
     */
    if(typeof this.options.onKeyPress === "function")
      this.options.onKeyPress(button);

    /**
     * Updating input
     */
    let options = {
      newLineOnEnter: (this.options.newLineOnEnter === true)
    }
    
    if(!this.input[this.options.inputName])
      this.input[this.options.inputName] = '';

    let updatedInput = this.utilities.getUpdatedInput(button, this.input[this.options.inputName], this.options, this.caretPosition);

    if(this.input[this.options.inputName] !== updatedInput){

      /**
       * If maxLength and handleMaxLength yield true, halting
       */
      if(this.options.maxLength && this.utilities.handleMaxLength(this.input, this.options, updatedInput)){
        return false;
      }

      this.input[this.options.inputName] = updatedInput;

      if(debug)
        console.log('Input changed:', this.input);

      /**
       * syncInstanceInputs
       */
      if(this.options.syncInstanceInputs)
        this.syncInstanceInputs(this.input);

      /**
       * Calling onChange
       */
      if(typeof this.options.onChange === "function")
        this.options.onChange(this.input[this.options.inputName]);
    }
    
    if(debug){
      console.log("Key pressed:", button);
    }
  }

  syncInstanceInputs = () => {
    this.dispatch((section) => {
      section.replaceInput(this.input);
    });
  }

  clearInput = (inputName) => {
    inputName = inputName || this.options.inputName;
    this.input[this.options.inputName] = '';

    /**
     * syncInstanceInputs
     */
    if(this.options.syncInstanceInputs)
      this.syncInstanceInputs(this.input);
  }

  getInput = (inputName) => {
    inputName = inputName || this.options.inputName;

    /**
     * syncInstanceInputs
     */
    if(this.options.syncInstanceInputs)
      this.syncInstanceInputs(this.input);

    return this.input[this.options.inputName];
  }

  setInput = (input, inputName) => {
    inputName = inputName || this.options.inputName;
    this.input[inputName] = input;

    /**
     * syncInstanceInputs
     */
    if(this.options.syncInstanceInputs)
      this.syncInstanceInputs(this.input);
  }

  replaceInput = (inputObj) => {
    this.input = inputObj;
  }

  setOptions = option => {
    option = option || {};
    this.options = Object.assign(this.options, option);
    this.render();
  }

  clear = () => {
    this.keyboardDOM.innerHTML = '';
    this.keyboardDOM.className = this.keyboardDOMClass;
    this.buttonElements = {};
    this.caretPosition = null;
  }

  dispatch = (callback) => {
    if(!window['SimpleKeyboardInstances']){
      console.error("SimpleKeyboardInstances is not defined. Dispatch cannot be called.")
      return false;
    }
    
    return Object.keys(window['SimpleKeyboardInstances']).forEach((key) => {
      callback(window['SimpleKeyboardInstances'][key], key);
    })
  }

  addButtonTheme = (buttons, className) => {
    if(!className || !buttons)
      return false;

    buttons.split(" ").forEach(button => {
      className.split(" ").forEach(classNameItem => {
        if(!this.options.buttonTheme)
          this.options.buttonTheme = [];

        let classNameFound = false;
  
        /**
         * If class is already defined, we add button to class definition
         */
        this.options.buttonTheme.map(buttonTheme => {

          if(buttonTheme.class.split(" ").includes(classNameItem)){
            classNameFound = true;
            
            let buttonThemeArray = buttonTheme.buttons.split(" ");
            if(!buttonThemeArray.includes(button)){
              classNameFound = true;
              buttonThemeArray.push(button);
              buttonTheme.buttons = buttonThemeArray.join(" ");
            }
          }
          return buttonTheme;
        });

        /**
         * If class is not defined, we create a new entry
         */
        if(!classNameFound){
          this.options.buttonTheme.push({
            class: classNameItem,
            buttons: buttons
          });
        }

      });
    });

    this.render();
  }

  removeButtonTheme = (buttons, className) => {
    /**
     * When called with empty parameters, remove all button themes
     */
    if(!buttons && !className){
      this.options.buttonTheme = [];
      this.render();
      return false;
    }

    /**
     * If buttons are passed and buttonTheme has items
     */
    if(buttons && Array.isArray(this.options.buttonTheme) && this.options.buttonTheme.length){
      let buttonArray = buttons.split(" ");
      buttonArray.forEach((button, key) => {
        this.options.buttonTheme.map((buttonTheme, index) => {

          /**
           * If className is set, we affect the buttons only for that class
           * Otherwise, we afect all classes
           */
          if(
            (className && className.includes(buttonTheme.class)) ||
            !className
          ){
            let filteredButtonArray;

            if(buttonArray.includes(button)){
              filteredButtonArray = buttonTheme.buttons.split(" ").filter(item => item !== button);
            }

            /**
             * If buttons left, return them, otherwise, remove button Theme
             */
            if(filteredButtonArray.length){
              buttonTheme.buttons = filteredButtonArray.join(" ");
            } else {
              this.options.buttonTheme.splice(index, 1);
              buttonTheme = null;
            }
 
          }

          return buttonTheme;
        });
      });

      this.render();
    }
  }

  getButtonElement = (button) => {
    let output;

    let buttonArr = this.buttonElements[button];
    if(buttonArr){
      if(buttonArr.length > 1){
        output = buttonArr;
      } else {
        output = buttonArr[0];
      }
    }

    return output;
  }

  handleCaret = () => {
    if(this.options.debug){
      console.log("Caret handling started");
    }

    let handler = (event) => {
      let targetTagName = event.target.tagName.toLowerCase();

      if(
        targetTagName === "textarea" ||
        targetTagName === "input"
      ){
        this.caretPosition = event.target.selectionStart;

        if(this.options.debug){
          console.log('Caret at: ', event.target.selectionStart, event.target.tagName.toLowerCase());
        }     
      }
    };

    document.addEventListener("keyup", handler);
    document.addEventListener("mouseup", handler);
    document.addEventListener("touchend", handler);
  }

  onInit = () => {
    if(this.options.debug){
      console.log("Initialized");
    }

    /**
     * Caret handling
     */
    this.handleCaret();

    if(typeof this.options.onInit === "function")
      this.options.onInit();
  }

  onRender = () => {
    if(typeof this.options.onRender === "function")
      this.options.onRender();
  }

  render = () => {
    /**
     * Clear keyboard
     */
    this.clear();

    let layoutClass = this.options.layout ? "hg-layout-custom" : `hg-layout-${this.options.layoutName}`;
    let layout = this.options.layout || KeyboardLayout.getLayout(this.options.layoutName);

    /**
     * Account for buttonTheme, if set
     */
    let buttonThemesParsed = {};
    if(Array.isArray(this.options.buttonTheme)){
      this.options.buttonTheme.forEach(themeObj => {
        if(themeObj.buttons && themeObj.class){
          let themeButtons = themeObj.buttons.split(' ');

          if(Array.isArray(themeButtons)){
            themeButtons.forEach(themeButton => {
              let themeParsed = buttonThemesParsed[themeButton];

              // If the button has already been added
              if(themeParsed)
                buttonThemesParsed[themeButton] = `${themeParsed} ${themeObj.class}`;
              else
                buttonThemesParsed[themeButton] = themeObj.class;
            });
          }
        } else {
          console.warn(`buttonTheme row is missing the "buttons" or the "class". Please check the documentation.`)
        }
      });
    }

    /**
     * Adding themeClass, layoutClass to keyboardDOM
     */
    this.keyboardDOM.className += ` ${this.options.theme} ${layoutClass}`;

    /**
     * Iterating through each row
     */
    layout[this.options.layoutName].forEach((row, rIndex) => {
      let rowArray = row.split(' ');

      /**
       * Creating empty row
       */
      var rowDOM = document.createElement('div');
      rowDOM.className += "hg-row";

      /**
       * Iterating through each button in row
       */
      rowArray.forEach((button, bIndex) => {
        let fctBtnClass = this.utilities.getButtonClass(button);
        let buttonThemeClass = buttonThemesParsed[button];
        let buttonDisplayName = this.utilities.getButtonDisplayName(button, this.options.display, this.options.mergeDisplay);

        /**
         * Creating button
         */
        var buttonDOM = document.createElement('div');
        buttonDOM.className += `hg-button ${fctBtnClass}${buttonThemeClass ? " "+buttonThemeClass : ""}`;
        buttonDOM.onclick = () => this.handleButtonClicked(button);

        /**
         * Adding identifier
         */
        buttonDOM.setAttribute("data-skBtn", button);

        /**
         * Adding unique id
         * Since there's no limit on spawning same buttons, the unique id ensures you can style every button
         */
        let buttonUID = `${this.options.layoutName}-r${rIndex}b${bIndex}`;
        buttonDOM.setAttribute("data-skBtnUID", buttonUID);

        /**
         * Adding button label to button
         */
        var buttonSpanDOM = document.createElement('span');
        buttonSpanDOM.innerHTML = buttonDisplayName;
        buttonDOM.appendChild(buttonSpanDOM);

        /**
         * Adding to buttonElements
         */
        if(!this.buttonElements[button])
          this.buttonElements[button] = [];

        this.buttonElements[button].push(buttonDOM);

        /**
         * Appending button to row
         */
        rowDOM.appendChild(buttonDOM);

      });

      /**
       * Appending row to keyboard
       */
      this.keyboardDOM.appendChild(rowDOM);
    });

    /**
     * Calling onRender
     */
    this.onRender();

    if(!this.initialized){
      this.initialized = true;

      /**
       * Calling onInit
       */
      this.onInit();
    }
  }
}

export default SimpleKeyboard;
