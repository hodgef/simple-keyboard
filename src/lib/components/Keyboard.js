import "./Keyboard.css";

// Services
import { getDefaultLayout } from "../services/KeyboardLayout";
import PhysicalKeyboard from "../services/PhysicalKeyboard";
import Utilities from "../services/Utilities";

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
  constructor(...params) {
    const { keyboardDOMClass, keyboardDOM, options = {} } = this.handleParams(
      params
    );

    /**
     * Initializing Utilities
     */
    this.utilities = new Utilities({
      getOptions: this.getOptions,
      getCaretPosition: this.getCaretPosition,
      getCaretPositionEnd: this.getCaretPositionEnd,
      dispatch: this.dispatch
    });

    /**
     * Caret position
     */
    this.caretPosition = null;

    /**
     * Caret position end
     */
    this.caretPositionEnd = null;

    /**
     * Processing options
     */
    this.keyboardDOM = keyboardDOM;

    /**
     * @type {object}
     * @property {object} layout Modify the keyboard layout.
     * @property {string} layoutName Specifies which layout should be used.
     * @property {object} display Replaces variable buttons (such as {bksp}) with a human-friendly name (e.g.: “backspace”).
     * @property {boolean} mergeDisplay By default, when you set the display property, you replace the default one. This setting merges them instead.
     * @property {string} theme A prop to add your own css classes to the keyboard wrapper. You can add multiple classes separated by a space.
     * @property {array} buttonTheme A prop to add your own css classes to one or several buttons.
     * @property {array} buttonAttributes A prop to add your own attributes to one or several buttons.
     * @property {boolean} debug Runs a console.log every time a key is pressed. Displays the buttons pressed and the current input.
     * @property {boolean} newLineOnEnter Specifies whether clicking the “ENTER” button will input a newline (\n) or not.
     * @property {boolean} tabCharOnTab Specifies whether clicking the “TAB” button will input a tab character (\t) or not.
     * @property {string} inputName Allows you to use a single simple-keyboard instance for several inputs.
     * @property {number} maxLength Restrains all of simple-keyboard inputs to a certain length. This should be used in addition to the input element’s maxlengthattribute.
     * @property {object} maxLength Restrains simple-keyboard’s individual inputs to a certain length. This should be used in addition to the input element’s maxlengthattribute.
     * @property {boolean} syncInstanceInputs When set to true, this option synchronizes the internal input of every simple-keyboard instance.
     * @property {boolean} physicalKeyboardHighlight Enable highlighting of keys pressed on physical keyboard.
     * @property {boolean} physicalKeyboardHighlightPress Presses keys highlighted by physicalKeyboardHighlight
     * @property {string} physicalKeyboardHighlightTextColor Define the text color that the physical keyboard highlighted key should have.
     * @property {string} physicalKeyboardHighlightBgColor Define the background color that the physical keyboard highlighted key should have.
     * @property {boolean} preventMouseDownDefault Calling preventDefault for the mousedown events keeps the focus on the input.
     * @property {boolean} preventMouseUpDefault Calling preventDefault for the mouseup events.
     * @property {boolean} stopMouseDownPropagation Stops pointer down events on simple-keyboard buttons from bubbling to parent elements.
     * @property {boolean} stopMouseUpPropagation Stops pointer up events on simple-keyboard buttons from bubbling to parent elements.
     * @property {function(button: string):string} onKeyPress Executes the callback function on key press. Returns button layout name (i.e.: “{shift}”).
     * @property {function(input: string):string} onChange Executes the callback function on input change. Returns the current input’s string.
     * @property {function} onRender Executes the callback function every time simple-keyboard is rendered (e.g: when you change layouts).
     * @property {function} onInit Executes the callback function once simple-keyboard is rendered for the first time (on initialization).
     * @property {function(inputs: object):object} onChangeAll Executes the callback function on input change. Returns the input object with all defined inputs.
     * @property {boolean} useButtonTag Render buttons as a button element instead of a div element.
     * @property {boolean} disableCaretPositioning A prop to ensure characters are always be added/removed at the end of the string.
     * @property {object} inputPattern Restrains input(s) change to the defined regular expression pattern.
     * @property {boolean} useTouchEvents Instructs simple-keyboard to use touch events instead of click events.
     * @property {boolean} autoUseTouchEvents Enable useTouchEvents automatically when touch device is detected.
     * @property {boolean} useMouseEvents Opt out of PointerEvents handling, falling back to the prior mouse event logic.
     * @property {function} destroy Clears keyboard listeners and DOM elements.
     * @property {boolean} disableButtonHold Disable button hold action.
     * @property {boolean} rtl Adds unicode right-to-left control characters to input return values.
     * @property {function} onKeyReleased Executes the callback function on key release.
     * @property {array} modules Module classes to be loaded by simple-keyboard.
     */
    this.options = options;
    this.options.layoutName = this.options.layoutName || "default";
    this.options.theme = this.options.theme || "hg-theme-default";
    this.options.inputName = this.options.inputName || "default";
    this.options.preventMouseDownDefault =
      this.options.preventMouseDownDefault || false;

    /**
     * @type {object} Classes identifying loaded plugins
     */
    this.keyboardPluginClasses = "";

    /**
     * Bindings
     */
    Utilities.bindMethods(SimpleKeyboard, this);

    /**
     * simple-keyboard uses a non-persistent internal input to keep track of the entered string (the variable `keyboard.input`).
     * This removes any dependency to input DOM elements. You can type and directly display the value in a div element, for example.
     * @example
     * // To get entered input
     * const input = keyboard.getInput();
     *
     * // To clear entered input.
     * keyboard.clearInput();
     *
     * @type {object}
     * @property {object} default Default SimpleKeyboard internal input.
     * @property {object} myInputName Example input that can be set through `options.inputName:"myInputName"`.
     */
    this.input = {};
    this.input[this.options.inputName] = "";

    /**
     * @type {string} DOM class of the keyboard wrapper, normally "simple-keyboard" by default.
     */
    this.keyboardDOMClass = keyboardDOMClass;

    /**
     * @type {object} Contains the DOM elements of every rendered button, the key being the button's layout name (e.g.: "{enter}").
     */
    this.buttonElements = {};

    /**
     * Simple-keyboard Instances
     * This enables multiple simple-keyboard support with easier management
     */
    if (!window["SimpleKeyboardInstances"])
      window["SimpleKeyboardInstances"] = {};

    this.currentInstanceName = this.utilities.camelCase(this.keyboardDOMClass);
    window["SimpleKeyboardInstances"][this.currentInstanceName] = this;

    /**
     * Instance vars
     */
    this.allKeyboardInstances = window["SimpleKeyboardInstances"];
    this.keyboardInstanceNames = Object.keys(window["SimpleKeyboardInstances"]);
    this.isFirstKeyboardInstance =
      this.keyboardInstanceNames[0] === this.currentInstanceName;

    /**
     * Physical Keyboard support
     */
    this.physicalKeyboard = new PhysicalKeyboard({
      dispatch: this.dispatch,
      getOptions: this.getOptions
    });

    /**
     * Rendering keyboard
     */
    if (this.keyboardDOM) this.render();
    else {
      console.warn(`".${keyboardDOMClass}" was not found in the DOM.`);
      throw new Error("KEYBOARD_DOM_ERROR");
    }

    /**
     * Modules
     */
    this.modules = {};
    this.loadModules();
  }

  /**
   * parseParams
   */
  handleParams = params => {
    let keyboardDOMClass;
    let keyboardDOM;
    let options;

    /**
     * If first parameter is a string:
     * Consider it as an element's class
     */
    if (typeof params[0] === "string") {
      keyboardDOMClass = params[0].split(".").join("");
      keyboardDOM = document.querySelector(`.${keyboardDOMClass}`);
      options = params[1];

      /**
       * If first parameter is an HTMLDivElement
       * Consider it as the keyboard DOM element
       */
    } else if (params[0] instanceof HTMLDivElement) {
      /**
       * This element must have a class, otherwise throw
       */
      if (!params[0].className) {
        console.warn("Any DOM element passed as parameter must have a class.");
        throw new Error("KEYBOARD_DOM_CLASS_ERROR");
      }

      keyboardDOMClass = params[0].className.split(" ")[0];
      keyboardDOM = params[0];
      options = params[1];

      /**
       * Otherwise, search for .simple-keyboard DOM element
       */
    } else {
      keyboardDOMClass = "simple-keyboard";
      keyboardDOM = document.querySelector(`.${keyboardDOMClass}`);
      options = params[0];
    }

    return {
      keyboardDOMClass,
      keyboardDOM,
      options
    };
  };

  /**
   * Getters
   */
  getOptions = () => this.options;
  getCaretPosition = () => this.caretPosition;
  getCaretPositionEnd = () => this.caretPositionEnd;

  /**
   * Setters
   */
  setCaretPosition(position, endPosition) {
    this.caretPosition = position;
    this.caretPositionEnd = endPosition || position;
  }

  /**
   * Handles clicks made to keyboard buttons
   * @param  {string} button The button's layout name.
   */
  handleButtonClicked(button) {
    const debug = this.options.debug;

    /**
     * Ignoring placeholder buttons
     */
    if (button === "{//}") return false;

    /**
     * Calling onKeyPress
     */
    if (typeof this.options.onKeyPress === "function")
      this.options.onKeyPress(button);

    if (!this.input[this.options.inputName])
      this.input[this.options.inputName] = "";

    const updatedInput = this.utilities.getUpdatedInput(
      button,
      this.input[this.options.inputName],
      this.caretPosition,
      this.caretPositionEnd
    );

    if (
      // If input will change as a result of this button press
      this.input[this.options.inputName] !== updatedInput &&
      // This pertains to the "inputPattern" option:
      // If inputPattern isn't set
      (!this.options.inputPattern ||
        // Or, if it is set and if the pattern is valid - we proceed.
        (this.options.inputPattern && this.inputPatternIsValid(updatedInput)))
    ) {
      /**
       * If maxLength and handleMaxLength yield true, halting
       */
      if (
        this.options.maxLength &&
        this.utilities.handleMaxLength(this.input, updatedInput)
      ) {
        return false;
      }

      this.input[this.options.inputName] = this.utilities.getUpdatedInput(
        button,
        this.input[this.options.inputName],
        this.caretPosition,
        this.caretPositionEnd,
        true
      );

      if (debug) console.log("Input changed:", this.getAllInputs());

      if (this.options.debug) {
        console.log(
          "Caret at: ",
          this.getCaretPosition(),
          this.getCaretPositionEnd(),
          `(${this.keyboardDOMClass})`
        );
      }

      /**
       * Enforce syncInstanceInputs, if set
       */
      if (this.options.syncInstanceInputs) this.syncInstanceInputs();

      /**
       * Calling onChange
       */
      if (typeof this.options.onChange === "function")
        this.options.onChange(this.getInput(this.options.inputName, true));

      /**
       * Calling onChangeAll
       */
      if (typeof this.options.onChangeAll === "function")
        this.options.onChangeAll(this.getAllInputs());
    }

    if (debug) {
      console.log("Key pressed:", button);
    }
  }

  /**
   * Handles button mousedown
   */
  /* istanbul ignore next */
  handleButtonMouseDown(button, e) {
    if (e) {
      /**
       * Handle event options
       */
      if (this.options.preventMouseDownDefault) e.preventDefault();
      if (this.options.stopMouseDownPropagation) e.stopPropagation();

      /**
       * Add active class
       */
      e.target.classList.add(this.activeButtonClass);
    }

    if (this.holdInteractionTimeout) clearTimeout(this.holdInteractionTimeout);
    if (this.holdTimeout) clearTimeout(this.holdTimeout);

    /**
     * @type {boolean} Whether the mouse is being held onKeyPress
     */
    this.isMouseHold = true;

    /**
     * @type {object} Time to wait until a key hold is detected
     */
    if (!this.options.disableButtonHold) {
      this.holdTimeout = setTimeout(() => {
        if (
          (this.isMouseHold &&
            // TODO: This needs to be configurable through options
            ((!button.includes("{") && !button.includes("}")) ||
              button === "{delete}" ||
              button === "{backspace}" ||
              button === "{bksp}" ||
              button === "{space}" ||
              button === "{tab}")) ||
          button === "{arrowright}" ||
          button === "{arrowleft}" ||
          button === "{arrowup}" ||
          button === "{arrowdown}"
        ) {
          if (this.options.debug) console.log("Button held:", button);

          this.handleButtonHold(button, e);
        }
        clearTimeout(this.holdTimeout);
      }, 500);
    }
  }

  /**
   * Handles button mouseup
   */
  handleButtonMouseUp(button = null, e = null) {
    if (e) {
      /**
       * Handle event options
       */
      if (this.options.preventMouseUpDefault) e.preventDefault();
      if (this.options.stopMouseUpPropagation) e.stopPropagation();
    }

    /**
     * Remove active class
     */
    this.recurseButtons(buttonElement => {
      buttonElement.classList.remove(this.activeButtonClass);
    });

    this.isMouseHold = false;
    if (this.holdInteractionTimeout) clearTimeout(this.holdInteractionTimeout);

    /**
     * Calling onKeyReleased
     */
    if (button && typeof this.options.onKeyReleased === "function")
      this.options.onKeyReleased(button);
  }

  /**
   * Handles container mousedown
   */
  handleKeyboardContainerMouseDown(e) {
    /**
     * Handle event options
     */
    if (this.options.preventMouseDownDefault) e.preventDefault();
  }

  /**
   * Handles button hold
   */
  /* istanbul ignore next */
  handleButtonHold(button) {
    if (this.holdInteractionTimeout) clearTimeout(this.holdInteractionTimeout);

    /**
     * @type {object} Timeout dictating the speed of key hold iterations
     */
    this.holdInteractionTimeout = setTimeout(() => {
      if (this.isMouseHold) {
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
  syncInstanceInputs() {
    this.dispatch(instance => {
      instance.replaceInput(this.input);
      instance.setCaretPosition(this.caretPosition, this.caretPositionEnd);
    });
  }

  /**
   * Clear the keyboard’s input.
   * @param {string} [inputName] optional - the internal input to select
   */
  clearInput(inputName) {
    inputName = inputName || this.options.inputName;
    this.input[inputName] = "";

    /**
     * Reset caretPosition
     */
    this.setCaretPosition(0);

    /**
     * Enforce syncInstanceInputs, if set
     */
    if (this.options.syncInstanceInputs) this.syncInstanceInputs();
  }

  /**
   * Get the keyboard’s input (You can also get it from the onChange prop).
   * @param  {string} [inputName] optional - the internal input to select
   */
  getInput(inputName, skipSync = false) {
    inputName = inputName || this.options.inputName;

    /**
     * Enforce syncInstanceInputs, if set
     */
    if (this.options.syncInstanceInputs && !skipSync) this.syncInstanceInputs();

    if (this.options.rtl) {
      // Remove existing control chars
      const inputWithoutRTLControl = this.input[inputName]
        .replace("\u202B", "")
        .replace("\u202C", "");

      return "\u202B" + inputWithoutRTLControl + "\u202C";
    } else {
      return this.input[inputName];
    }
  }

  /**
   * Get all simple-keyboard inputs
   */
  getAllInputs() {
    const output = {};
    const inputNames = Object.keys(this.input);

    inputNames.forEach(inputName => {
      output[inputName] = this.getInput(inputName, true);
    });

    return output;
  }

  /**
   * Set the keyboard’s input.
   * @param  {string} input the input value
   * @param  {string} inputName optional - the internal input to select
   */
  setInput(input, inputName) {
    inputName = inputName || this.options.inputName;
    this.input[inputName] = input;

    /**
     * Enforce syncInstanceInputs, if set
     */
    if (this.options.syncInstanceInputs) this.syncInstanceInputs();
  }

  /**
   * Replace the input object (`keyboard.input`)
   * @param  {object} inputObj The input object
   */
  replaceInput(inputObj) {
    this.input = inputObj;
  }

  /**
   * Set new option or modify existing ones after initialization.
   * @param  {object} options The options to set
   */
  setOptions(options = {}) {
    const changedOptions = this.changedOptions(options);
    this.options = Object.assign(this.options, options);

    if (changedOptions.length) {
      if (this.options.debug) {
        console.log("changedOptions", changedOptions);
      }

      /**
       * Some option changes require adjustments before re-render
       */
      this.onSetOptions(options);

      /**
       * Rendering
       */
      this.render();
    }
  }

  /**
   * Detecting changes to non-function options
   * This allows us to ascertain whether a button re-render is needed
   */
  changedOptions(newOptions) {
    return Object.keys(newOptions).filter(
      optionName =>
        JSON.stringify(newOptions[optionName]) !==
        JSON.stringify(this.options[optionName])
    );
  }

  /**
   * Executing actions depending on changed options
   * @param  {object} options The options to set
   */
  onSetOptions(options) {
    if (options.inputName) {
      /**
       * inputName changed. This requires a caretPosition reset
       */
      if (this.options.debug) {
        console.log("inputName changed. caretPosition reset.");
      }
      this.setCaretPosition(null);
    }
  }

  /**
   * Remove all keyboard rows and reset keyboard values.
   * Used internally between re-renders.
   */
  clear() {
    this.keyboardDOM.innerHTML = "";
    this.keyboardDOM.className = this.keyboardDOMClass;
    this.buttonElements = {};
  }

  /**
   * Send a command to all simple-keyboard instances at once (if you have multiple instances).
   * @param  {function(instance: object, key: string)} callback Function to run on every instance
   */
  dispatch(callback) {
    if (!window["SimpleKeyboardInstances"]) {
      console.warn(
        `SimpleKeyboardInstances is not defined. Dispatch cannot be called.`
      );
      throw new Error("INSTANCES_VAR_ERROR");
    }

    return Object.keys(window["SimpleKeyboardInstances"]).forEach(key => {
      callback(window["SimpleKeyboardInstances"][key], key);
    });
  }

  /**
   * Adds/Modifies an entry to the `buttonTheme`. Basically a way to add a class to a button.
   * @param  {string} buttons List of buttons to select (separated by a space).
   * @param  {string} className Classes to give to the selected buttons (separated by space).
   */
  addButtonTheme(buttons, className) {
    if (!className || !buttons) return false;

    buttons.split(" ").forEach(button => {
      className.split(" ").forEach(classNameItem => {
        if (!this.options.buttonTheme) this.options.buttonTheme = [];

        let classNameFound = false;

        /**
         * If class is already defined, we add button to class definition
         */
        this.options.buttonTheme.map(buttonTheme => {
          if (buttonTheme.class.split(" ").includes(classNameItem)) {
            classNameFound = true;

            const buttonThemeArray = buttonTheme.buttons.split(" ");
            if (!buttonThemeArray.includes(button)) {
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
        if (!classNameFound) {
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
  removeButtonTheme(buttons, className) {
    /**
     * When called with empty parameters, remove all button themes
     */
    if (!buttons && !className) {
      this.options.buttonTheme = [];
      this.render();
      return false;
    }

    /**
     * If buttons are passed and buttonTheme has items
     */
    if (
      buttons &&
      Array.isArray(this.options.buttonTheme) &&
      this.options.buttonTheme.length
    ) {
      const buttonArray = buttons.split(" ");
      buttonArray.forEach(button => {
        this.options.buttonTheme.map((buttonTheme, index) => {
          /**
           * If className is set, we affect the buttons only for that class
           * Otherwise, we afect all classes
           */
          if (
            (className && className.includes(buttonTheme.class)) ||
            !className
          ) {
            const filteredButtonArray = buttonTheme.buttons
              .split(" ")
              .filter(item => item !== button);

            /**
             * If buttons left, return them, otherwise, remove button Theme
             */
            if (filteredButtonArray.length) {
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
  getButtonElement(button) {
    let output;

    const buttonArr = this.buttonElements[button];
    if (buttonArr) {
      if (buttonArr.length > 1) {
        output = buttonArr;
      } else {
        output = buttonArr[0];
      }
    }

    return output;
  }

  /**
   * This handles the "inputPattern" option
   * by checking if the provided inputPattern passes
   */
  inputPatternIsValid(inputVal) {
    const inputPatternRaw = this.options.inputPattern;
    let inputPattern;

    /**
     * Check if input pattern is global or targeted to individual inputs
     */
    if (inputPatternRaw instanceof RegExp) {
      inputPattern = inputPatternRaw;
    } else {
      inputPattern = inputPatternRaw[this.options.inputName];
    }

    if (inputPattern && inputVal) {
      const didInputMatch = inputPattern.test(inputVal);

      if (this.options.debug) {
        console.log(
          `inputPattern ("${inputPattern}"): ${
            didInputMatch ? "passed" : "did not pass!"
          }`
        );
      }

      return didInputMatch;
    } else {
      /**
       * inputPattern doesn't seem to be set for the current input, or input is empty. Pass.
       */
      return true;
    }
  }

  /**
   * Handles simple-keyboard event listeners
   */
  setEventListeners() {
    /**
     * Only first instance should set the event listeners
     */
    if (this.isFirstKeyboardInstance || !this.allKeyboardInstances) {
      if (this.options.debug) {
        console.log(`Caret handling started (${this.keyboardDOMClass})`);
      }

      /**
       * Event Listeners
       */
      document.addEventListener("keyup", this.handleKeyUp);
      document.addEventListener("keydown", this.handleKeyDown);
      document.addEventListener("mouseup", this.handleMouseUp);
      document.addEventListener("touchend", this.handleTouchEnd);
    }
  }

  /**
   * Event Handler: KeyUp
   */
  handleKeyUp(event) {
    this.caretEventHandler(event);

    if (this.options.physicalKeyboardHighlight) {
      this.physicalKeyboard.handleHighlightKeyUp(event);
    }
  }

  /**
   * Event Handler: KeyDown
   */
  handleKeyDown(event) {
    if (this.options.physicalKeyboardHighlight) {
      this.physicalKeyboard.handleHighlightKeyDown(event);
    }
  }

  /**
   * Event Handler: MouseUp
   */
  handleMouseUp(event) {
    this.caretEventHandler(event);
  }

  /**
   * Event Handler: TouchEnd
   */
  /* istanbul ignore next */
  handleTouchEnd(event) {
    this.caretEventHandler(event);
  }

  /**
   * Called by {@link setEventListeners} when an event that warrants a cursor position update is triggered
   */
  caretEventHandler(event) {
    let targetTagName;
    if (event.target.tagName) {
      targetTagName = event.target.tagName.toLowerCase();
    }

    this.dispatch(instance => {
      const isKeyboard =
        event.target === instance.keyboardDOM ||
        (event.target && instance.keyboardDOM.contains(event.target));

      if (instance.isMouseHold) {
        instance.isMouseHold = false;
      }

      if (
        (targetTagName === "textarea" || targetTagName === "input") &&
        !instance.options.disableCaretPositioning
      ) {
        /**
         * Tracks current cursor position
         * As keys are pressed, text will be added/removed at that position within the input.
         */
        instance.setCaretPosition(
          event.target.selectionStart,
          event.target.selectionEnd
        );

        if (instance.options.debug) {
          console.log(
            "Caret at: ",
            instance.getCaretPosition(),
            instance.getCaretPositionEnd(),
            event && event.target.tagName.toLowerCase(),
            `(${instance.keyboardDOMClass})`
          );
        }
      } else if (instance.options.disableCaretPositioning || !isKeyboard) {
        /**
         * If we toggled off disableCaretPositioning, we must ensure caretPosition doesn't persist once reactivated.
         */
        instance.setCaretPosition(null);
      }
    });
  }

  /**
   * Execute an operation on each button
   */
  recurseButtons(fn) {
    if (!fn) return;

    Object.keys(this.buttonElements).forEach(buttonName =>
      this.buttonElements[buttonName].forEach(fn)
    );
  }

  /**
   * Destroy keyboard listeners and DOM elements
   */
  destroy() {
    if (this.options.debug)
      console.log(
        `Destroying simple-keyboard instance: ${this.currentInstanceName}`
      );

    /**
     * Remove document listeners
     */
    document.removeEventListener("keyup", this.handleKeyUp);
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("mouseup", this.handleMouseUp);
    document.removeEventListener("touchend", this.handleTouchEnd);
    document.onpointerup = null;
    document.ontouchend = null;
    document.ontouchcancel = null;
    document.onmouseup = null;

    /**
     * Remove buttons
     */
    let deleteButton = buttonElement => {
      buttonElement.onpointerdown = null;
      buttonElement.onpointerup = null;
      buttonElement.onpointercancel = null;
      buttonElement.ontouchstart = null;
      buttonElement.ontouchend = null;
      buttonElement.ontouchcancel = null;
      buttonElement.onclick = null;
      buttonElement.onmousedown = null;
      buttonElement.onmouseup = null;

      buttonElement.remove();
      buttonElement = null;
    };

    this.recurseButtons(deleteButton);

    this.recurseButtons = null;
    deleteButton = null;

    /**
     * Remove wrapper events
     */
    this.keyboardDOM.onpointerdown = null;
    this.keyboardDOM.ontouchstart = null;
    this.keyboardDOM.onmousedown = null;

    /**
     * Clearing keyboard wrapper
     */
    this.clear();

    /**
     * Remove instance
     */
    window["SimpleKeyboardInstances"][this.currentInstanceName] = null;
    delete window["SimpleKeyboardInstances"][this.currentInstanceName];

    /**
     * Reset initialized flag
     */
    this.initialized = false;
  }

  /**
   * Process buttonTheme option
   */
  getButtonThemeClasses(button) {
    const buttonTheme = this.options.buttonTheme;
    let buttonClasses = [];

    if (Array.isArray(buttonTheme)) {
      buttonTheme.forEach(themeObj => {
        if (
          themeObj.class &&
          typeof themeObj.class === "string" &&
          themeObj.buttons &&
          typeof themeObj.buttons === "string"
        ) {
          const themeObjClasses = themeObj.class.split(" ");
          const themeObjButtons = themeObj.buttons.split(" ");

          if (themeObjButtons.includes(button)) {
            buttonClasses = [...buttonClasses, ...themeObjClasses];
          }
        } else {
          console.warn(
            `Incorrect "buttonTheme". Please check the documentation.`,
            themeObj
          );
        }
      });
    }

    return buttonClasses;
  }

  /**
   * Process buttonAttributes option
   */
  setDOMButtonAttributes(button, callback) {
    const buttonAttributes = this.options.buttonAttributes;

    if (Array.isArray(buttonAttributes)) {
      buttonAttributes.forEach(attrObj => {
        if (
          attrObj.attribute &&
          typeof attrObj.attribute === "string" &&
          attrObj.value &&
          typeof attrObj.value === "string" &&
          attrObj.buttons &&
          typeof attrObj.buttons === "string"
        ) {
          const attrObjButtons = attrObj.buttons.split(" ");

          if (attrObjButtons.includes(button)) {
            callback(attrObj.attribute, attrObj.value);
          }
        } else {
          console.warn(
            `Incorrect "buttonAttributes". Please check the documentation.`,
            attrObj
          );
        }
      });
    }
  }

  onTouchDeviceDetected() {
    /**
     * Processing autoTouchEvents
     */
    this.processAutoTouchEvents();

    /**
     * Disabling contextual window on touch devices
     */
    this.disableContextualWindow();
  }

  /**
   * Disabling contextual window for hg-button
   */
  /* istanbul ignore next */
  disableContextualWindow() {
    window.oncontextmenu = event => {
      if (event.target.classList.contains("hg-button")) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    };
  }

  /**
   * Process autoTouchEvents option
   */
  processAutoTouchEvents() {
    if (this.options.autoUseTouchEvents) {
      this.options.useTouchEvents = true;

      if (this.options.debug) {
        console.log(
          `autoUseTouchEvents: Touch device detected, useTouchEvents enabled.`
        );
      }
    }
  }

  /**
   * Executes the callback function once simple-keyboard is rendered for the first time (on initialization).
   */
  onInit() {
    if (this.options.debug) {
      console.log(`${this.keyboardDOMClass} Initialized`);
    }

    /**
     * setEventListeners
     */
    this.setEventListeners();

    if (typeof this.options.onInit === "function") this.options.onInit();
  }

  /**
   * Executes the callback function before a simple-keyboard render.
   */
  beforeFirstRender() {
    /**
     * Performing actions when touch device detected
     */
    if (this.utilities.isTouchDevice()) {
      this.onTouchDeviceDetected();
    }

    if (typeof this.options.beforeFirstRender === "function")
      this.options.beforeFirstRender();

    /**
     * Notify about PointerEvents usage
     */
    if (
      this.isFirstKeyboardInstance &&
      this.utilities.pointerEventsSupported() &&
      !this.options.useTouchEvents &&
      !this.options.useMouseEvents
    ) {
      if (this.options.debug) {
        console.log("Using PointerEvents as it is supported by this browser");
      }
    }

    /**
     * Notify about touch events usage
     */
    if (this.options.useTouchEvents) {
      if (this.options.debug) {
        console.log(
          "useTouchEvents has been enabled. Only touch events will be used."
        );
      }
    }
  }

  /**
   * Executes the callback function before a simple-keyboard render.
   */
  beforeRender() {
    if (typeof this.options.beforeRender === "function")
      this.options.beforeRender();
  }

  /**
   * Executes the callback function every time simple-keyboard is rendered (e.g: when you change layouts).
   */
  onRender() {
    if (typeof this.options.onRender === "function") this.options.onRender();
  }

  /**
   * Executes the callback function once all modules have been loaded
   */
  onModulesLoaded() {
    if (typeof this.options.onModulesLoaded === "function")
      this.options.onModulesLoaded(this);
  }

  /**
   * Register module
   */
  registerModule = (name, initCallback) => {
    if (!this.modules[name]) this.modules[name] = {};

    initCallback(this.modules[name]);
  };

  /**
   * Load modules
   */
  loadModules() {
    if (Array.isArray(this.options.modules)) {
      this.options.modules.forEach(KeyboardModule => {
        const keyboardModule = new KeyboardModule();
        keyboardModule.init(this);
      });

      this.keyboardPluginClasses = "modules-loaded";

      this.render();
      this.onModulesLoaded();
    }
  }

  /**
   * Get module prop
   */
  getModuleProp(name, prop) {
    if (!this.modules[name]) return false;

    return this.modules[name][prop];
  }

  /**
   * getModulesList
   */
  getModulesList() {
    return Object.keys(this.modules);
  }

  /**
   * Parse Row DOM containers
   */
  parseRowDOMContainers(
    rowDOM,
    rowIndex,
    containerStartIndexes,
    containerEndIndexes
  ) {
    const rowDOMArray = Array.from(rowDOM.children);
    let removedElements = 0;

    if (rowDOMArray.length) {
      containerStartIndexes.forEach((startIndex, arrIndex) => {
        const endIndex = containerEndIndexes[arrIndex];

        /**
         * If there exists a respective end index
         * if end index comes after start index
         */
        if (!endIndex || !(endIndex > startIndex)) {
          return false;
        }

        /**
         * Updated startIndex, endIndex
         * This is since the removal of buttons to place a single button container
         * results in a modified array size
         */
        const updated_startIndex = startIndex - removedElements;
        const updated_endIndex = endIndex - removedElements;

        /**
         * Create button container
         */
        const containerDOM = document.createElement("div");
        containerDOM.className += "hg-button-container";
        const containerUID = `${this.options.layoutName}-r${rowIndex}c${arrIndex}`;
        containerDOM.setAttribute("data-skUID", containerUID);

        /**
         * Taking elements due to be inserted into container
         */
        const containedElements = rowDOMArray.splice(
          updated_startIndex,
          updated_endIndex - updated_startIndex + 1
        );
        removedElements = updated_endIndex - updated_startIndex;

        /**
         * Inserting elements to container
         */
        containedElements.forEach(element => containerDOM.appendChild(element));

        /**
         * Adding container at correct position within rowDOMArray
         */
        rowDOMArray.splice(updated_startIndex, 0, containerDOM);

        /**
         * Clearing old rowDOM children structure
         */
        rowDOM.innerHTML = "";

        /**
         * Appending rowDOM new children list
         */
        rowDOMArray.forEach(element => rowDOM.appendChild(element));

        if (this.options.debug) {
          console.log(
            "rowDOMContainer",
            containedElements,
            updated_startIndex,
            updated_endIndex,
            removedElements + 1
          );
        }
      });
    }

    return rowDOM;
  }

  /**
   * getKeyboardClassString
   */
  getKeyboardClassString = (...baseDOMClasses) => {
    const keyboardClasses = [this.keyboardDOMClass, ...baseDOMClasses].filter(
      DOMClass => !!DOMClass
    );

    return keyboardClasses.join(" ");
  };

  /**
   * Renders rows and buttons as per options
   */
  render() {
    /**
     * Clear keyboard
     */
    this.clear();

    /**
     * Calling beforeFirstRender
     */
    if (!this.initialized) {
      this.beforeFirstRender();
    }

    /**
     * Calling beforeRender
     */
    this.beforeRender();

    const layoutClass = `hg-layout-${this.options.layoutName}`;
    const layout = this.options.layout || getDefaultLayout();
    const useTouchEvents = this.options.useTouchEvents || false;
    const useTouchEventsClass = useTouchEvents ? "hg-touch-events" : "";
    const useMouseEvents = this.options.useMouseEvents || false;
    const disableRowButtonContainers = this.options.disableRowButtonContainers;

    /**
     * Adding themeClass, layoutClass to keyboardDOM
     */
    this.keyboardDOM.className = this.getKeyboardClassString(
      this.options.theme,
      layoutClass,
      this.keyboardPluginClasses,
      useTouchEventsClass
    );

    /**
     * Iterating through each row
     */
    layout[this.options.layoutName].forEach((row, rIndex) => {
      const rowArray = row.split(" ");

      /**
       * Creating empty row
       */
      let rowDOM = document.createElement("div");
      rowDOM.className += "hg-row";

      /**
       * Tracking container indicators in rows
       */
      const containerStartIndexes = [];
      const containerEndIndexes = [];

      /**
       * Iterating through each button in row
       */
      rowArray.forEach((button, bIndex) => {
        /**
         * Check if button has a container indicator
         */
        const buttonHasContainerStart =
          !disableRowButtonContainers &&
          typeof button === "string" &&
          button.length > 1 &&
          button.indexOf("[") === 0;

        const buttonHasContainerEnd =
          !disableRowButtonContainers &&
          typeof button === "string" &&
          button.length > 1 &&
          button.indexOf("]") === button.length - 1;

        /**
         * Save container start index, if applicable
         */
        if (buttonHasContainerStart) {
          containerStartIndexes.push(bIndex);

          /**
           * Removing indicator
           */
          button = button.replace(/\[/g, "");
        }

        if (buttonHasContainerEnd) {
          containerEndIndexes.push(bIndex);

          /**
           * Removing indicator
           */
          button = button.replace(/\]/g, "");
        }

        /**
         * Processing button options
         */
        const fctBtnClass = this.utilities.getButtonClass(button);
        const buttonDisplayName = this.utilities.getButtonDisplayName(
          button,
          this.options.display,
          this.options.mergeDisplay
        );

        /**
         * Creating button
         */
        const buttonType = this.options.useButtonTag ? "button" : "div";
        const buttonDOM = document.createElement(buttonType);
        buttonDOM.className += `hg-button ${fctBtnClass}`;

        /**
         * Adding buttonTheme
         */
        buttonDOM.classList.add(...this.getButtonThemeClasses(button));

        /**
         * Adding buttonAttributes
         */
        this.setDOMButtonAttributes(button, (attribute, value) => {
          buttonDOM.setAttribute(attribute, value);
        });

        this.activeButtonClass = "hg-activeButton";

        /**
         * Handle button click event
         */
        /* istanbul ignore next */
        if (
          this.utilities.pointerEventsSupported() &&
          !useTouchEvents &&
          !useMouseEvents
        ) {
          /**
           * Handle PointerEvents
           */
          buttonDOM.onpointerdown = e => {
            this.handleButtonClicked(button);
            this.handleButtonMouseDown(button, e);
          };
          buttonDOM.onpointerup = e => {
            this.handleButtonMouseUp(button, e);
          };
          buttonDOM.onpointercancel = e => {
            this.handleButtonMouseUp(button, e);
          };
        } else {
          /**
           * Fallback for browsers not supporting PointerEvents
           */
          if (useTouchEvents) {
            /**
             * Handle touch events
             */
            buttonDOM.ontouchstart = e => {
              this.handleButtonClicked(button);
              this.handleButtonMouseDown(button, e);
            };
            buttonDOM.ontouchend = e => {
              this.handleButtonMouseUp(button, e);
            };
            buttonDOM.ontouchcancel = e => {
              this.handleButtonMouseUp(button, e);
            };
          } else {
            /**
             * Handle mouse events
             */
            buttonDOM.onclick = () => {
              this.isMouseHold = false;
              this.handleButtonClicked(button);
            };
            buttonDOM.onmousedown = e => {
              this.handleButtonMouseDown(button, e);
            };
            buttonDOM.onmouseup = e => {
              this.handleButtonMouseUp(button, e);
            };
          }
        }

        /**
         * Adding identifier
         */
        buttonDOM.setAttribute("data-skBtn", button);

        /**
         * Adding unique id
         * Since there's no limit on spawning same buttons, the unique id ensures you can style every button
         */
        const buttonUID = `${this.options.layoutName}-r${rIndex}b${bIndex}`;
        buttonDOM.setAttribute("data-skBtnUID", buttonUID);

        /**
         * Adding button label to button
         */
        const buttonSpanDOM = document.createElement("span");
        buttonSpanDOM.innerHTML = buttonDisplayName;
        buttonDOM.appendChild(buttonSpanDOM);

        /**
         * Adding to buttonElements
         */
        if (!this.buttonElements[button]) this.buttonElements[button] = [];

        this.buttonElements[button].push(buttonDOM);

        /**
         * Appending button to row
         */
        rowDOM.appendChild(buttonDOM);
      });

      /**
       * Parse containers in row
       */
      rowDOM = this.parseRowDOMContainers(
        rowDOM,
        rIndex,
        containerStartIndexes,
        containerEndIndexes
      );

      /**
       * Appending row to keyboard
       */
      this.keyboardDOM.appendChild(rowDOM);
    });

    /**
     * Calling onRender
     */
    this.onRender();

    if (!this.initialized) {
      /**
       * Ensures that onInit and beforeFirstRender are only called once per instantiation
       */
      this.initialized = true;

      /**
       * Handling parent events
       */
      /* istanbul ignore next */
      if (
        this.utilities.pointerEventsSupported() &&
        !useTouchEvents &&
        !useMouseEvents
      ) {
        document.onpointerup = () => this.handleButtonMouseUp();
        this.keyboardDOM.onpointerdown = e =>
          this.handleKeyboardContainerMouseDown(e);
      } else if (useTouchEvents) {
        /**
         * Handling ontouchend, ontouchcancel
         */
        document.ontouchend = () => this.handleButtonMouseUp();
        document.ontouchcancel = () => this.handleButtonMouseUp();

        this.keyboardDOM.ontouchstart = e =>
          this.handleKeyboardContainerMouseDown(e);
      } else if (!useTouchEvents) {
        /**
         * Handling mouseup
         */
        document.onmouseup = () => this.handleButtonMouseUp();
        this.keyboardDOM.onmousedown = e =>
          this.handleKeyboardContainerMouseDown(e);
      }

      /**
       * Calling onInit
       */
      this.onInit();
    }
  }
}

export default SimpleKeyboard;
