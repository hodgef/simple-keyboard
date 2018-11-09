import './Keyboard.css';

// Services
import PhysicalKeyboard from '../services/PhysicalKeyboard';
import KeyboardLayout from '../services/KeyboardLayout';
import Utilities from '../services/Utilities';

/**
 * Root class for simple-keyboard
 * This class:
 * - Parses the options
 * - Renders the rows and buttons
 * - Handles button functionality
 */
class SimpleKeyboard {
  /**
   * Creates an instance of SimpleKeyboard
   * @param {Array} params If first parameter is a string, it is considered the container class. The second parameter is then considered the options object. If first parameter is an object, it is considered the options object.
   */
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

    /**
     * @type {object}
     * @property {object} layout Modify the keyboard layout.
     * @property {string} layoutName Specifies which layout should be used.
     * @property {object} display Replaces variable buttons (such as {bksp}) with a human-friendly name (e.g.: “backspace”).
     * @property {boolean} mergeDisplay By default, when you set the display property, you replace the default one. This setting merges them instead.
     * @property {string} theme A prop to add your own css classes to the keyboard wrapper. You can add multiple classes separated by a space.
     * @property {Array} buttonTheme A prop to add your own css classes to one or several buttons.
     * @property {boolean} debug Runs a console.log every time a key is pressed. Displays the buttons pressed and the current input.
     * @property {boolean} newLineOnEnter Specifies whether clicking the “ENTER” button will input a newline (\n) or not.
     * @property {boolean} tabCharOnTab Specifies whether clicking the “TAB” button will input a tab character (\t) or not.
     * @property {string} inputName Allows you to use a single simple-keyboard instance for several inputs.
     * @property {number} maxLength Restrains all of simple-keyboard inputs to a certain length. This should be used in addition to the input element’s maxlengthattribute.
     * @property {object} maxLength Restrains simple-keyboard’s individual inputs to a certain length. This should be used in addition to the input element’s maxlengthattribute.
     * @property {boolean} syncInstanceInputs When set to true, this option synchronizes the internal input of every simple-keyboard instance.
     * @property {boolean} physicalKeyboardHighlight Enable highlighting of keys pressed on physical keyboard.
     * @property {string} physicalKeyboardHighlightTextColor Define the text color that the physical keyboard highlighted key should have.
     * @property {string} physicalKeyboardHighlightBgColor Define the background color that the physical keyboard highlighted key should have. 
     * @property {function(button: string):string} onKeyPress Executes the callback function on key press. Returns button layout name (i.e.: “{shift}”).
     * @property {function(input: string):string} onChange Executes the callback function on input change. Returns the current input’s string.
     * @property {function} onRender Executes the callback function every time simple-keyboard is rendered (e.g: when you change layouts).
     * @property {function} onInit Executes the callback function once simple-keyboard is rendered for the first time (on initialization).
     * @property {function(inputs: object):object} onChangeAll Executes the callback function on input change. Returns the input object with all defined inputs.
     */
    this.options = options;
    this.options.layoutName = this.options.layoutName || "default";
    this.options.theme = this.options.theme || "hg-theme-default";
    this.options.inputName = this.options.inputName || "default";

    /**
     * @type {object} Classes identifying loaded plugins
     */
    this.keyboardPluginClasses = '';

    /**
     * Bindings
     */
    this.handleButtonClicked = this.handleButtonClicked.bind(this);
    this.syncInstanceInputs = this.syncInstanceInputs.bind(this);
    this.clearInput = this.clearInput.bind(this);
    this.getInput = this.getInput.bind(this);
    this.setInput = this.setInput.bind(this);
    this.replaceInput = this.replaceInput.bind(this);
    this.clear = this.clear.bind(this);
    this.dispatch = this.dispatch.bind(this);
    this.addButtonTheme = this.addButtonTheme.bind(this);
    this.removeButtonTheme = this.removeButtonTheme.bind(this);
    this.getButtonElement = this.getButtonElement.bind(this);
    this.handleCaret = this.handleCaret.bind(this);
    this.caretEventHandler = this.caretEventHandler.bind(this);
    this.onInit = this.onInit.bind(this);
    this.onRender = this.onRender.bind(this);
    this.render = this.render.bind(this);
    this.loadModules = this.loadModules.bind(this);
    this.handleButtonMouseUp = this.handleButtonMouseUp.bind(this);
    this.handleButtonMouseDown = this.handleButtonMouseDown.bind(this);
    this.handleButtonHold = this.handleButtonHold.bind(this);
    this.onModulesLoaded = this.onModulesLoaded.bind(this);

    /**
     * simple-keyboard uses a non-persistent internal input to keep track of the entered string (the variable `keyboard.input`).
     * This removes any dependency to input DOM elements. You can type and directly display the value in a div element, for example.
     * @example
     * // To get entered input
     * let input = keyboard.getInput();
     * 
     * // To clear entered input.
     * keyboard.clearInput();
     * 
     * @type {object}
     * @property {object} default Default SimpleKeyboard internal input.
     * @property {object} myInputName Example input that can be set through `options.inputName:"myInputName"`.
     */
    this.input = {};
    this.input[this.options.inputName] = '';

    /**
     * @type {string} DOM class of the keyboard wrapper, normally "simple-keyboard" by default.
     */
    this.keyboardDOMClass = keyboardDOMQuery.split('.').join("");

    /**
     * @type {object} Contains the DOM elements of every rendered button, the key being the button's layout name (e.g.: "{enter}").
     */
    this.buttonElements = {};

    /**
     * Rendering keyboard
     */
    if(this.keyboardDOM)
      this.render();
    else {
      console.warn(`"${keyboardDOMQuery}" was not found in the DOM.`);
      throw new Error("KEYBOARD_DOM_ERROR");
    }

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

    /**
     * Modules
     */
    this.modules = {};
    this.loadModules();
  }

  /**
   * Handles clicks made to keyboard buttons
   * @param  {string} button The button's layout name.
   */
  handleButtonClicked(button){
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
    
    if(!this.input[this.options.inputName])
      this.input[this.options.inputName] = '';

    let updatedInput = this.utilities.getUpdatedInput(
      button, this.input[this.options.inputName], this.options, this.caretPosition
    );

    if(this.input[this.options.inputName] !== updatedInput){

      /**
       * If maxLength and handleMaxLength yield true, halting
       */
      if(this.options.maxLength && this.utilities.handleMaxLength(this.input, this.options, updatedInput)){
        return false;
      }

      this.input[this.options.inputName]  = this.utilities.getUpdatedInput(
        button, this.input[this.options.inputName], this.options, this.caretPosition, true
      );

      if(debug)
        console.log('Input changed:', this.input);

      /**
       * Enforce syncInstanceInputs, if set
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

  /**
   * Handles button mousedown
   */
  /* istanbul ignore next */
  handleButtonMouseDown(button, e){
    /**
     * @type {boolean} Whether the mouse is being held onKeyPress
     */
    this.isMouseHold = true;

    if(this.holdInteractionTimeout)
      clearTimeout(this.holdInteractionTimeout);

    if(this.holdTimeout)
      clearTimeout(this.holdTimeout);

    /**
     * @type {object} Time to wait until a key hold is detected
     */
    this.holdTimeout = setTimeout(() => {
      if(
        this.isMouseHold  &&
        (
          (!button.includes("{") && !button.includes("}")) ||
          button === "{bksp}" ||
          button === "{space}" ||
          button === "{tab}"
        )
      ){
        if(this.options.debug)
          console.log("Button held:", button);

        this.handleButtonHold(button, e);
      }
      clearTimeout(this.holdTimeout);
    }, 500);
  }

  /**
   * Handles button mouseup
   */
  handleButtonMouseUp(){
    this.isMouseHold = false;
    if(this.holdInteractionTimeout)
      clearTimeout(this.holdInteractionTimeout);
  }

  /**
   * Handles button hold
   */
  /* istanbul ignore next */
  handleButtonHold(button){
    if(this.holdInteractionTimeout)
      clearTimeout(this.holdInteractionTimeout);

    /**
     * @type {object} Timeout dictating the speed of key hold iterations
     */
    this.holdInteractionTimeout = setTimeout(() => {
      if(this.isMouseHold){
        this.handleButtonClicked(button);
        this.handleButtonHold(button);
      } else {
        clearTimeout(this.holdInteractionTimeout);
      }
    }, 100);
  }

  /**
   * Send a command to all simple-keyboard instances (if you have several instances).
   */
  syncInstanceInputs(){
    this.dispatch((instance) => {
      instance.replaceInput(this.input);
    });
  }
  
  /**
   * Clear the keyboard’s input.
   * @param {string} [inputName] optional - the internal input to select
   */
  clearInput(inputName){
    inputName = inputName || this.options.inputName;
    this.input[this.options.inputName] = '';

    /**
     * Enforce syncInstanceInputs, if set
     */
    if(this.options.syncInstanceInputs)
      this.syncInstanceInputs(this.input);
  }

  /**
   * Get the keyboard’s input (You can also get it from the onChange prop).
   * @param  {string} [inputName] optional - the internal input to select
   */
  getInput(inputName){
    inputName = inputName || this.options.inputName;

    /**
     * Enforce syncInstanceInputs, if set
     */
    if(this.options.syncInstanceInputs)
      this.syncInstanceInputs(this.input);

    return this.input[this.options.inputName];
  }

  /**
   * Set the keyboard’s input.
   * @param  {string} input the input value
   * @param  {string} inputName optional - the internal input to select
   */
  setInput(input, inputName){
    inputName = inputName || this.options.inputName;
    this.input[inputName] = input;

    /**
     * Enforce syncInstanceInputs, if set
     */
    if(this.options.syncInstanceInputs)
      this.syncInstanceInputs(this.input);
  }
  
  /**
   * Replace the input object (`keyboard.input`)
   * @param  {object} inputObj The input object
   */
  replaceInput(inputObj){
    this.input = inputObj;
  }

  /**
   * Set new option or modify existing ones after initialization. 
   * @param  {object} option The option to set
   */
  setOptions = option => {
    option = option || {};
    this.options = Object.assign(this.options, option);
    this.render();
  }

  /**
   * Remove all keyboard rows and reset keyboard values.
   * Used interally between re-renders.
   */
  clear(){
    this.keyboardDOM.innerHTML = '';
    this.keyboardDOM.className = this.keyboardDOMClass;
    this.buttonElements = {};
  }

  /**
   * Send a command to all simple-keyboard instances at once (if you have multiple instances).
   * @param  {function(instance: object, key: string)} callback Function to run on every instance
   */
  dispatch(callback){
    if(!window['SimpleKeyboardInstances']){
      console.warn(`SimpleKeyboardInstances is not defined. Dispatch cannot be called.`);
      throw new Error("INSTANCES_VAR_ERROR");
    }
    
    return Object.keys(window['SimpleKeyboardInstances']).forEach((key) => {
      callback(window['SimpleKeyboardInstances'][key], key);
    })
  }

  /**
   * Adds/Modifies an entry to the `buttonTheme`. Basically a way to add a class to a button.
   * @param  {string} buttons List of buttons to select (separated by a space).
   * @param  {string} className Classes to give to the selected buttons (separated by space).
   */
  addButtonTheme(buttons, className){
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

  /**
   * Removes/Amends an entry to the `buttonTheme`. Basically a way to remove a class previously added to a button through buttonTheme or addButtonTheme.
   * @param  {string} buttons List of buttons to select (separated by a space).
   * @param  {string} className Classes to give to the selected buttons (separated by space).
   */
  removeButtonTheme(buttons, className){
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
            let filteredButtonArray = buttonTheme.buttons.split(" ").filter(item => item !== button);

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

  /**
   * Get the DOM Element of a button. If there are several buttons with the same name, an array of the DOM Elements is returned.
   * @param  {string} button The button layout name to select
   */
  getButtonElement(button){
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

  /**
   * Retrieves the current cursor position within a input or textarea (if any)
   */
  handleCaret(){
    if(this.options.debug){
      console.log("Caret handling started");
    }

    document.addEventListener("keyup", this.caretEventHandler);
    document.addEventListener("mouseup", this.caretEventHandler);
    document.addEventListener("touchend", this.caretEventHandler);
  }

  /**
   * Called by {@link handleCaret} when an event that warrants a cursor position update is triggered
   */
  caretEventHandler(event){
    let targetTagName;

    if(event.target.tagName){
      targetTagName = event.target.tagName.toLowerCase();
    }

    if(
      (targetTagName === "textarea" ||
      targetTagName === "input") &&
      !this.options.disableCaretPositioning
    ){
      /**
       * Tracks current cursor position
       * As keys are pressed, text will be added/removed at that position within the input.
       */
      this.caretPosition = event.target.selectionStart;

      if(this.options.debug){
        console.log('Caret at: ', event.target.selectionStart, event.target.tagName.toLowerCase());
      }     
    }
  }

  /**
   * Executes the callback function once simple-keyboard is rendered for the first time (on initialization).
   */
  onInit(){
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

  /**
   * Executes the callback function every time simple-keyboard is rendered (e.g: when you change layouts).
   */
  onRender(){
    if(typeof this.options.onRender === "function")
      this.options.onRender();
  }

 /**
  * Executes the callback function once all modules have been loaded
  */
  onModulesLoaded(){
    if(typeof this.options.onModulesLoaded === "function")
      this.options.onModulesLoaded();
  }

  /**
   * Register module
   */
  registerModule = (name, initCallback) => {
    if(!this.modules[name])
      this.modules[name] = {};

    initCallback(this.modules[name]);
  }

  /**
   * Load modules
   */
  loadModules(){
    if(Array.isArray(this.options.modules)){
      this.options.modules.forEach(Module => {
        let module = new Module();

        /* istanbul ignore next */
        if(module.constructor.name && module.constructor.name !== "Function"){
          let classStr = `module-${this.utilities.camelCase(module.constructor.name)}`;
          this.keyboardPluginClasses = this.keyboardPluginClasses + ` ${classStr}`;
        }

        module.init(this);
      });

      this.keyboardPluginClasses = this.keyboardPluginClasses + ' modules-loaded';

      this.render();
      this.onModulesLoaded();
    }
  }

  /**
   * Get module prop
   */
  getModuleProp = (name, prop) => {
    if(!this.modules[name])
      return false;
    
    return this.modules[name][prop];
  }

  /**
   * getModulesList
   */
  getModulesList = () => {
    return Object.keys(this.modules);
  }

  /**
   * Renders rows and buttons as per options
   */
  render(){
    /**
     * Clear keyboard
     */
    this.clear();

    let layoutClass = this.options.layout ? "hg-layout-custom" : `hg-layout-${this.options.layoutName}`;
    let layout = this.options.layout || KeyboardLayout.getDefaultLayout();

    /**
     * Account for buttonTheme, if set
     */
    let buttonThemesParsed = {};
    if(Array.isArray(this.options.buttonTheme)){
      this.options.buttonTheme.forEach(themeObj => {
        if(themeObj.buttons && themeObj.class){
          let themeButtons;

          if(typeof themeObj.buttons === "string"){
            themeButtons = themeObj.buttons.split(' ');
          }

          if(themeButtons){
            themeButtons.forEach(themeButton => {
              let themeParsed = buttonThemesParsed[themeButton];

              // If the button has already been added
              if(themeParsed){
                // Making sure we don't add duplicate classes, even when buttonTheme has duplicates
                if(!this.utilities.countInArray(themeParsed.split(" "), themeObj.class)){
                  buttonThemesParsed[themeButton] = `${themeParsed} ${themeObj.class}`;
                }
              } else {
                buttonThemesParsed[themeButton] = themeObj.class;
              }
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
    this.keyboardDOM.className += ` ${this.options.theme} ${layoutClass} ${this.keyboardPluginClasses}`;

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
        buttonDOM.onclick = () => {
          this.isMouseHold = false;
          this.handleButtonClicked(button);
        }
        buttonDOM.onmousedown = (e) => this.handleButtonMouseDown(button, e);

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
         * Adding display label
         */
        buttonDOM.setAttribute("data-displayLabel", buttonDisplayName);

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

    /**
     * Handling mouseup
     */
    document.onmouseup = () => this.handleButtonMouseUp();

    if(!this.initialized){
      /**
       * Ensures that onInit is only called once per instantiation
       */
      this.initialized = true;

      /**
       * Calling onInit
       */
      this.onInit();
    }
  }
}

export default SimpleKeyboard;
