import "./css/Keyboard.css";

import { getDefaultLayout } from "../services/KeyboardLayout";
import PhysicalKeyboard from "../services/PhysicalKeyboard";
import Utilities from "../services/Utilities";
import {
  KeyboardOptions,
  KeyboardInput,
  KeyboardButtonElements,
  KeyboardHandlerEvent,
  KeyboardElement,
  SKWindow,
} from "../interfaces";
import CandidateBox from "./CandidateBox";

/**
 * Root class for simple-keyboard.
 * This class:
 * - Parses the options
 * - Renders the rows and buttons
 * - Handles button functionality
 */
class SimpleKeyboard {
  input!: KeyboardInput;
  options!: KeyboardOptions;
  utilities!: Utilities;
  caretPosition!: number | null;
  caretPositionEnd!: number | null;
  keyboardDOM!: KeyboardElement;
  keyboardPluginClasses!: string;
  keyboardDOMClass!: string;
  buttonElements!: KeyboardButtonElements;
  currentInstanceName!: string;
  allKeyboardInstances!: { [key: string]: SimpleKeyboard };
  keyboardInstanceNames!: string[];
  isFirstKeyboardInstance!: boolean;
  physicalKeyboard!: PhysicalKeyboard;
  modules!: { [key: string]: any };
  activeButtonClass!: string;
  holdInteractionTimeout!: number;
  holdTimeout!: number;
  isMouseHold!: boolean;
  initialized!: boolean;
  candidateBox!: CandidateBox | null;
  keyboardRowsDOM!: KeyboardElement;
  defaultName = "default";
  activeInputElement: HTMLInputElement | HTMLTextAreaElement | null = null;

  /**
   * Creates an instance of SimpleKeyboard
   * @param {Array} selectorOrOptions If first parameter is a string, it is considered the container class. The second parameter is then considered the options object. If first parameter is an object, it is considered the options object.
   */
  constructor(
    selectorOrOptions?: string | HTMLDivElement | KeyboardOptions,
    keyboardOptions?: KeyboardOptions
  ) {
    if (typeof window === "undefined") return;

    const {
      keyboardDOMClass,
      keyboardDOM,
      options = {},
    } = this.handleParams(selectorOrOptions, keyboardOptions);

    /**
     * Initializing Utilities
     */
    this.utilities = new Utilities({
      getOptions: this.getOptions,
      getCaretPosition: this.getCaretPosition,
      getCaretPositionEnd: this.getCaretPositionEnd,
      dispatch: this.dispatch,
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
     * @property {boolean} physicalKeyboardHighlightPressUseClick Whether physicalKeyboardHighlightPress should use clicks to trigger buttons.
     * @property {boolean} physicalKeyboardHighlightPressUsePointerEvents Whether physicalKeyboardHighlightPress should use pointer events to trigger buttons.
     * @property {boolean} physicalKeyboardHighlightPreventDefault Whether physicalKeyboardHighlight should use preventDefault to disable default browser actions.
     * @property {boolean} preventMouseDownDefault Calling preventDefault for the mousedown events keeps the focus on the input.
     * @property {boolean} preventMouseUpDefault Calling preventDefault for the mouseup events.
     * @property {boolean} stopMouseDownPropagation Stops pointer down events on simple-keyboard buttons from bubbling to parent elements.
     * @property {boolean} stopMouseUpPropagation Stops pointer up events on simple-keyboard buttons from bubbling to parent elements.
     * @property {function(button: string):string} onKeyPress Executes the callback function on key press. Returns button layout name (i.e.: “{shift}”).
     * @property {function(input: string):string} onChange Executes the callback function on input change. Returns the current input’s string.
     * @property {function} onRender Executes the callback function every time simple-keyboard is rendered (e.g: when you change layouts).
     * @property {function} onInit Executes the callback function once simple-keyboard is rendered for the first time (on initialization).
     * @property {function(keyboard: Keyboard):void} beforeInputUpdate Perform an action before any input change
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
     * @property {boolean} enableLayoutCandidates Enable input method editor candidate list support.
     * @property {object} excludeFromLayout Buttons to exclude from layout
     * @property {number} layoutCandidatesPageSize Determines size of layout candidate list
     * @property {boolean} layoutCandidatesCaseSensitiveMatch Determines whether layout candidate match should be case sensitive.
     * @property {boolean} disableCandidateNormalization Disables the automatic normalization for selected layout candidates
     * @property {boolean} enableLayoutCandidatesKeyPress Enables onKeyPress triggering for layoutCandidate items
     * @property {boolean} updateCaretOnSelectionChange Updates caret when selectionchange event is fired
     * @property {boolean} clickOnMouseDown When useMouseEvents is enabled, this option allows you to trigger a button click event on mousedown
     */
    this.options = {
      layoutName: "default",
      theme: "hg-theme-default",
      inputName: "default",
      preventMouseDownDefault: false,
      enableLayoutCandidates: true,
      excludeFromLayout: {},
      ...options,
    };

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
    const { inputName = this.defaultName } = this.options;
    this.input = {};
    this.input[inputName] = "";

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
    if (!(window as SKWindow)["SimpleKeyboardInstances"])
      (window as SKWindow)["SimpleKeyboardInstances"] = {};

    this.currentInstanceName = this.utilities.camelCase(this.keyboardDOMClass);
    (window as SKWindow)["SimpleKeyboardInstances"][this.currentInstanceName] = this;

    /**
     * Instance vars
     */
    this.allKeyboardInstances = (window as SKWindow)["SimpleKeyboardInstances"];
    this.keyboardInstanceNames = Object.keys((window as SKWindow)["SimpleKeyboardInstances"]);
    this.isFirstKeyboardInstance =
      this.keyboardInstanceNames[0] === this.currentInstanceName;

    /**
     * Physical Keyboard support
     */
    this.physicalKeyboard = new PhysicalKeyboard({
      dispatch: this.dispatch,
      getOptions: this.getOptions,
    });

    /**
     * Initializing CandidateBox
     */
    this.candidateBox = this.options.enableLayoutCandidates
      ? new CandidateBox({
          utilities: this.utilities,
          options: this.options,
        })
      : null;

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
  handleParams = (
    selectorOrOptions?: string | HTMLDivElement | KeyboardOptions,
    keyboardOptions?: KeyboardOptions
  ): {
    keyboardDOMClass: string;
    keyboardDOM: KeyboardElement;
    options: Partial<KeyboardOptions | undefined>;
  } => {
    let keyboardDOMClass;
    let keyboardDOM;
    let options;

    /**
     * If first parameter is a string:
     * Consider it as an element's class
     */
    if (typeof selectorOrOptions === "string") {
      keyboardDOMClass = selectorOrOptions.split(".").join("");
      keyboardDOM = document.querySelector(
        `.${keyboardDOMClass}`
      ) as KeyboardElement;
      options = keyboardOptions;

      /**
       * If first parameter is an KeyboardElement
       * Consider it as the keyboard DOM element
       */
    } else if (selectorOrOptions instanceof HTMLDivElement) {
      /**
       * This element must have a class, otherwise throw
       */
      if (!selectorOrOptions.className) {
        console.warn("Any DOM element passed as parameter must have a class.");
        throw new Error("KEYBOARD_DOM_CLASS_ERROR");
      }

      keyboardDOMClass = selectorOrOptions.className.split(" ")[0];
      keyboardDOM = selectorOrOptions;
      options = keyboardOptions;

      /**
       * Otherwise, search for .simple-keyboard DOM element
       */
    } else {
      keyboardDOMClass = "simple-keyboard";
      keyboardDOM = document.querySelector(
        `.${keyboardDOMClass}`
      ) as KeyboardElement;
      options = selectorOrOptions;
    }

    return {
      keyboardDOMClass,
      keyboardDOM,
      options,
    };
  };

  /**
   * Getters
   */
  getOptions = (): KeyboardOptions => this.options;
  getCaretPosition = (): number | null => this.caretPosition;
  getCaretPositionEnd = (): number | null => this.caretPositionEnd;

  /**
   * Changes the internal caret position
   * @param {number} position The caret's start position
   * @param {number} positionEnd The caret's end position
   */
  setCaretPosition(position: number | null, endPosition = position): void {
    this.caretPosition = position;
    this.caretPositionEnd = endPosition;
  }

  /**
   * Retrieve the candidates for a given input
   * @param input The input string to check
   */
  getInputCandidates(
    input: string
  ): { candidateKey: string; candidateValue: string } | Record<string, never> {
    const {
      layoutCandidates: layoutCandidatesObj,
      layoutCandidatesCaseSensitiveMatch,
    } = this.options;

    if (!layoutCandidatesObj || typeof layoutCandidatesObj !== "object") {
      return {};
    }

    const layoutCandidates = Object.keys(layoutCandidatesObj).filter(
      (layoutCandidate: string) => {
        const inputSubstr =
          input.substring(0, this.getCaretPositionEnd() || 0) || input;
        const regexp = new RegExp(
          `${this.utilities.escapeRegex(layoutCandidate)}$`,
          layoutCandidatesCaseSensitiveMatch ? "g" : "gi"
        );
        const matches = [...inputSubstr.matchAll(regexp)];
        return !!matches.length;
      }
    );

    if (layoutCandidates.length > 1) {
      const candidateKey = layoutCandidates.sort(
        (a, b) => b.length - a.length
      )[0];
      return {
        candidateKey,
        candidateValue: layoutCandidatesObj[candidateKey],
      };
    } else if (layoutCandidates.length) {
      const candidateKey = layoutCandidates[0];
      return {
        candidateKey,
        candidateValue: layoutCandidatesObj[candidateKey],
      };
    } else {
      return {};
    }
  }

  /**
   * Shows a suggestion box with a list of candidate words
   * @param candidates The chosen candidates string as defined in the layoutCandidates option
   * @param targetElement The element next to which the candidates box will be shown
   */
  showCandidatesBox(
    candidateKey: string,
    candidateValue: string,
    targetElement: KeyboardElement
  ): void {
    if (this.candidateBox) {
      this.candidateBox.show({
        candidateValue,
        targetElement,
        onSelect: (selectedCandidate: string, e: MouseEvent) => {
          const {
            layoutCandidatesCaseSensitiveMatch,
            disableCandidateNormalization,
            enableLayoutCandidatesKeyPress
          } = this.options;

          let candidateStr = selectedCandidate;

          if(!disableCandidateNormalization) {
            /**
             * Making sure that our suggestions are not composed characters
             */
            candidateStr = selectedCandidate.normalize("NFD");
          }

          /**
           * Perform an action before any input change
           */
          if (typeof this.options.beforeInputUpdate === "function") {
            this.options.beforeInputUpdate(this);
          }

          const currentInput = this.getInput(this.options.inputName, true);
          const initialCaretPosition = this.getCaretPositionEnd() || 0;
          const inputSubstr =
            currentInput.substring(0, initialCaretPosition || 0) ||
            currentInput;

          const regexp = new RegExp(
            `${this.utilities.escapeRegex(candidateKey)}$`,
            layoutCandidatesCaseSensitiveMatch ? "g" : "gi"
          );
          const newInputSubstr = inputSubstr.replace(
            regexp,
            candidateStr
          );
          const newInput = currentInput.replace(inputSubstr, newInputSubstr);

          const caretPositionDiff = newInputSubstr.length - inputSubstr.length;
          let newCaretPosition =
            (initialCaretPosition || currentInput.length) + caretPositionDiff;

          if (newCaretPosition < 0) newCaretPosition = 0;

          this.setInput(newInput, this.options.inputName, true);
          this.setCaretPosition(newCaretPosition);

          /**
           * Calling onKeyPress
           * We pass in the composed candidate instead of the decomposed one
           * To prevent confusion for users
           */
          if (enableLayoutCandidatesKeyPress && typeof this.options.onKeyPress === "function")
            this.options.onKeyPress(selectedCandidate, e);

          if (typeof this.options.onChange === "function")
            this.options.onChange(
              this.getInput(this.options.inputName, true),
              e
            );

          /**
           * Calling onChangeAll
           */
          if (typeof this.options.onChangeAll === "function")
            this.options.onChangeAll(this.getAllInputs(), e);
        },
      });
    }
  }

  /**
   * Handles clicks made to keyboard buttons
   * @param  {string} button The button's layout name.
   */
  handleButtonClicked(button: string, e?: KeyboardHandlerEvent): void {
    const { inputName = this.defaultName, debug } = this.options;
    /**
     * Ignoring placeholder buttons
     */
    if (button === "{//}") return;

    /**
     * Creating inputName if it doesn't exist
     */
    if (!this.input[inputName]) this.input[inputName] = "";

    /**
     * Perform an action before any input change
     */
    if (typeof this.options.beforeInputUpdate === "function") {
      this.options.beforeInputUpdate(this);
    }

    /**
     * Calculating new input
     */
    const updatedInput = this.utilities.getUpdatedInput(
      button,
      this.input[inputName],
      this.caretPosition,
      this.caretPositionEnd
    );

    /**
     * EDGE CASE: Check for whole input selection changes that will yield same updatedInput
     */
    if (this.utilities.isStandardButton(button) && this.activeInputElement) {
      const isEntireInputSelection =
        this.input[inputName] &&
        this.input[inputName] === updatedInput &&
        this.caretPosition === 0 &&
        this.caretPositionEnd === updatedInput.length;

      if (isEntireInputSelection) {
        this.setInput("", this.options.inputName, true);
        this.setCaretPosition(0);
        this.activeInputElement.value = "";
        this.activeInputElement.setSelectionRange(0, 0);
        this.handleButtonClicked(button, e);
        return;
      }
    }

    /**
     * Calling onKeyPress
     */
    if (typeof this.options.onKeyPress === "function")
      this.options.onKeyPress(button, e);

    if (
      // If input will change as a result of this button press
      this.input[inputName] !== updatedInput &&
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
        return;
      }

      /**
       * Updating input
       */
      const newInputValue = this.utilities.getUpdatedInput(
        button,
        this.input[inputName],
        this.caretPosition,
        this.caretPositionEnd,
        true
      );

      this.setInput(newInputValue, this.options.inputName, true);

      if (debug) console.log("Input changed:", this.getAllInputs());

      if (this.options.debug) {
        console.log(
          "Caret at: ",
          this.getCaretPosition(),
          this.getCaretPositionEnd(),
          `(${this.keyboardDOMClass})`,
          e?.type
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
        this.options.onChange(this.getInput(this.options.inputName, true), e);

      /**
       * Calling onChangeAll
       */
      if (typeof this.options.onChangeAll === "function")
        this.options.onChangeAll(this.getAllInputs(), e);

      /**
       * Check if this new input has candidates (suggested words)
       */
      if (e?.target && this.options.enableLayoutCandidates) {
        const { candidateKey, candidateValue } =
          this.getInputCandidates(updatedInput);

        if (candidateKey && candidateValue) {
          this.showCandidatesBox(
            candidateKey,
            candidateValue,
            this.keyboardDOM
          );
        } else {
          this.candidateBox?.destroy();
        }
      }
    }

    /**
     * After a button is clicked the selection (if any) will disappear
     * we should reflect this in our state, as applicable
     */
    if(this.caretPositionEnd && this.caretPosition !== this.caretPositionEnd){
      this.setCaretPosition(this.caretPositionEnd, this.caretPositionEnd);

      if(this.activeInputElement){
        this.activeInputElement.setSelectionRange(this.caretPositionEnd, this.caretPositionEnd);
      }
      
      if(this.options.debug){
        console.log("Caret position aligned", this.caretPosition);
      }
    }

    if (debug) {
      console.log("Key pressed:", button);
    }
  }

  /**
   * Get mouse hold state
   */
  getMouseHold() {
    return this.isMouseHold;
  }

  /**
   * Mark mouse hold state as set
   */
  setMouseHold(value: boolean) {
    if (this.options.syncInstanceInputs) {
      this.dispatch((instance: SimpleKeyboard) => {
        instance.isMouseHold = value;
      });
    } else {
      this.isMouseHold = value;
    }
  }

  /**
   * Handles button mousedown
   */
  /* istanbul ignore next */
  handleButtonMouseDown(button: string, e: KeyboardHandlerEvent): void {
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
    this.setMouseHold(true);

    /**
     * @type {object} Time to wait until a key hold is detected
     */
    if (!this.options.disableButtonHold) {
      this.holdTimeout = window.setTimeout(() => {
        if (
          (this.getMouseHold() &&
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

          this.handleButtonHold(button);
        }
        clearTimeout(this.holdTimeout);
      }, 500);
    }
  }

  /**
   * Handles button mouseup
   */
  handleButtonMouseUp(button?: string, e?: KeyboardHandlerEvent): void {
    if (e) {
      /**
       * Handle event options
       */
      if (this.options.preventMouseUpDefault && e.preventDefault)
        e.preventDefault();
      if (this.options.stopMouseUpPropagation && e.stopPropagation)
        e.stopPropagation();

      /* istanbul ignore next */
      const isKeyboard =
        e.target === this.keyboardDOM ||
        (e.target && this.keyboardDOM.contains(e.target)) ||
        (this.candidateBox &&
          this.candidateBox.candidateBoxElement &&
          (e.target === this.candidateBox.candidateBoxElement ||
            (e.target &&
              this.candidateBox.candidateBoxElement.contains(e.target))));

      /**
       * On click outside, remove candidateBox
       */
      if (!isKeyboard && this.candidateBox) {
        this.candidateBox.destroy();
      }
    }

    /**
     * Remove active class
     */
    this.recurseButtons((buttonElement: Element) => {
      buttonElement.classList.remove(this.activeButtonClass);
    });

    this.setMouseHold(false);
    if (this.holdInteractionTimeout) clearTimeout(this.holdInteractionTimeout);

    /**
     * Calling onKeyReleased
     */
    if (button && typeof this.options.onKeyReleased === "function")
      this.options.onKeyReleased(button, e);
  }

  /**
   * Handles container mousedown
   */
  handleKeyboardContainerMouseDown(e: KeyboardHandlerEvent): void {
    /**
     * Handle event options
     */
    if (this.options.preventMouseDownDefault) e.preventDefault();
  }

  /**
   * Handles button hold
   */
  /* istanbul ignore next */
  handleButtonHold(button: string): void {
    if (this.holdInteractionTimeout) clearTimeout(this.holdInteractionTimeout);

    /**
     * @type {object} Timeout dictating the speed of key hold iterations
     */
    this.holdInteractionTimeout = window.setTimeout(() => {
      if (this.getMouseHold()) {
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
  syncInstanceInputs(): void {
    this.dispatch((instance: SimpleKeyboard) => {
      instance.replaceInput(this.input);
      instance.setCaretPosition(this.caretPosition, this.caretPositionEnd);
    });
  }

  /**
   * Clear the keyboard’s input.
   * @param {string} [inputName] optional - the internal input to select
   */
  clearInput(
    inputName: string = this.options.inputName || this.defaultName
  ): void {
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
  getInput(
    inputName: string = this.options.inputName || this.defaultName,
    skipSync = false
  ): string {
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
  getAllInputs(): KeyboardInput {
    const output = {} as KeyboardInput;
    const inputNames = Object.keys(this.input);

    inputNames.forEach((inputName) => {
      output[inputName] = this.getInput(inputName, true);
    });

    return output;
  }

  /**
   * Set the keyboard’s input.
   * @param  {string} input the input value
   * @param  {string} inputName optional - the internal input to select
   */
  setInput(
    input: string,
    inputName: string = this.options.inputName || this.defaultName,
    skipSync?: boolean
  ): void {
    this.input[inputName] = input;

    /**
     * Enforce syncInstanceInputs, if set
     */
    if (!skipSync && this.options.syncInstanceInputs) this.syncInstanceInputs();
  }

  /**
   * Replace the input object (`keyboard.input`)
   * @param  {object} inputObj The input object
   */
  replaceInput(inputObj: KeyboardInput): void {
    this.input = inputObj;
  }

  /**
   * Set new option or modify existing ones after initialization.
   * @param  {object} options The options to set
   */
  setOptions(options = {}): void {
    const changedOptions = this.changedOptions(options);
    this.options = Object.assign(this.options, options);

    if (changedOptions.length) {
      if (this.options.debug) {
        console.log("changedOptions", changedOptions);
      }

      /**
       * Some option changes require adjustments before re-render
       */
      this.onSetOptions(changedOptions);

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
  changedOptions(newOptions: Partial<KeyboardOptions>): string[] {
    return Object.keys(newOptions).filter(
      (optionName) =>
        JSON.stringify(newOptions[optionName]) !==
        JSON.stringify(this.options[optionName])
    );
  }

  /**
   * Executing actions depending on changed options
   * @param  {object} options The options to set
   */
  onSetOptions(changedOptions: string[] = []): void {
    /**
     * Changed: layoutName
     */
    if (changedOptions.includes("layoutName")) {
      /**
       * Reset candidateBox
       */
      if (this.candidateBox) {
        this.candidateBox.destroy();
      }
    }

    /**
     * Changed: layoutCandidatesPageSize, layoutCandidates
     */
    if (
      changedOptions.includes("layoutCandidatesPageSize") ||
      changedOptions.includes("layoutCandidates")
    ) {
      /**
       * Reset and recreate candidateBox
       */
      if (this.candidateBox) {
        this.candidateBox.destroy();
        this.candidateBox = new CandidateBox({
          utilities: this.utilities,
          options: this.options,
        });
      }
    }
  }

  /**
   * Remove all keyboard rows and reset keyboard values.
   * Used internally between re-renders.
   */
  resetRows(): void {
    if (this.keyboardRowsDOM) {
      this.keyboardRowsDOM.remove();
    }

    this.keyboardDOM.className = this.keyboardDOMClass;
    this.keyboardDOM.setAttribute("data-skInstance", this.currentInstanceName);
    this.buttonElements = {};
  }

  /**
   * Send a command to all simple-keyboard instances at once (if you have multiple instances).
   * @param  {function(instance: object, key: string)} callback Function to run on every instance
   */
  // eslint-disable-next-line no-unused-vars
  dispatch(callback: (instance: SimpleKeyboard, key?: string) => void): void {
    if (!(window as SKWindow)["SimpleKeyboardInstances"]) {
      console.warn(
        `SimpleKeyboardInstances is not defined. Dispatch cannot be called.`
      );
      throw new Error("INSTANCES_VAR_ERROR");
    }

    return Object.keys((window as SKWindow)["SimpleKeyboardInstances"]).forEach((key) => {
      callback((window as SKWindow)["SimpleKeyboardInstances"][key], key);
    });
  }

  /**
   * Adds/Modifies an entry to the `buttonTheme`. Basically a way to add a class to a button.
   * @param  {string} buttons List of buttons to select (separated by a space).
   * @param  {string} className Classes to give to the selected buttons (separated by space).
   */
  addButtonTheme(buttons: string, className: string): void {
    if (!className || !buttons) return;

    buttons.split(" ").forEach((button) => {
      className.split(" ").forEach((classNameItem) => {
        if (!this.options.buttonTheme) this.options.buttonTheme = [];

        let classNameFound = false;

        /**
         * If class is already defined, we add button to class definition
         */
        this.options.buttonTheme.map((buttonTheme) => {
          if (buttonTheme?.class.split(" ").includes(classNameItem)) {
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
            buttons: buttons,
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
  removeButtonTheme(buttons: string, className: string): void {
    /**
     * When called with empty parameters, remove all button themes
     */
    if (!buttons && !className) {
      this.options.buttonTheme = [];
      this.render();
      return;
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
      buttonArray.forEach((button) => {
        this.options?.buttonTheme?.map((buttonTheme, index) => {
          /**
           * If className is set, we affect the buttons only for that class
           * Otherwise, we afect all classes
           */
          if (
            (buttonTheme &&
              className &&
              className.includes(buttonTheme.class)) ||
            !className
          ) {
            const filteredButtonArray = buttonTheme?.buttons
              .split(" ")
              .filter((item) => item !== button);

            /**
             * If buttons left, return them, otherwise, remove button Theme
             */
            if (buttonTheme && filteredButtonArray?.length) {
              buttonTheme.buttons = filteredButtonArray.join(" ");
            } else {
              this.options.buttonTheme?.splice(index, 1);
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
  getButtonElement(
    button: string
  ): KeyboardElement | KeyboardElement[] | undefined {
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
  inputPatternIsValid(inputVal: string): boolean {
    const inputPatternRaw = this.options.inputPattern;
    let inputPattern;

    /**
     * Check if input pattern is global or targeted to individual inputs
     */
    if (inputPatternRaw instanceof RegExp) {
      inputPattern = inputPatternRaw;
    } else {
      inputPattern =
        inputPatternRaw[this.options.inputName || this.defaultName];
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
  setEventListeners(): void {
    /**
     * Only first instance should set the event listeners
     */
    if (this.isFirstKeyboardInstance || !this.allKeyboardInstances) {
      if (this.options.debug) {
        console.log(`Caret handling started (${this.keyboardDOMClass})`);
      }

      const { physicalKeyboardHighlightPreventDefault = false } = this.options;

      /**
       * Event Listeners
       */
      document.addEventListener("keyup", this.handleKeyUp, physicalKeyboardHighlightPreventDefault);
      document.addEventListener("keydown", this.handleKeyDown, physicalKeyboardHighlightPreventDefault);
      document.addEventListener("mouseup", this.handleMouseUp);
      document.addEventListener("touchend", this.handleTouchEnd);

      if (this.options.updateCaretOnSelectionChange) {
        document.addEventListener("selectionchange", this.handleSelectionChange);
      }

      document.addEventListener("select", this.handleSelect);
    }
  }

  /**
   * Event Handler: KeyUp
   */
  handleKeyUp(event: KeyboardHandlerEvent): void {
    this.caretEventHandler(event);

    if (this.options.physicalKeyboardHighlight) {
      this.physicalKeyboard.handleHighlightKeyUp(event);
    }
  }

  /**
   * Event Handler: KeyDown
   */
  handleKeyDown(event: KeyboardHandlerEvent): void {
    if (this.options.physicalKeyboardHighlight) {
      this.physicalKeyboard.handleHighlightKeyDown(event);
    }
  }

  /**
   * Event Handler: MouseUp
   */
  handleMouseUp(event: KeyboardHandlerEvent): void {
    this.caretEventHandler(event);
  }

  /**
   * Event Handler: TouchEnd
   */
  /* istanbul ignore next */
  handleTouchEnd(event: KeyboardHandlerEvent): void {
    this.caretEventHandler(event);
  }

  /**
   * Event Handler: Select
   */
  /* istanbul ignore next */
  handleSelect(event: KeyboardHandlerEvent): void {
    this.caretEventHandler(event);
  }

  /**
   * Event Handler: SelectionChange
   */
  /* istanbul ignore next */
  handleSelectionChange(event: KeyboardHandlerEvent): void {
    /**
     * Firefox is not reporting the correct caret position through this event
     * https://github.com/hodgef/simple-keyboard/issues/1839
     */
    if(navigator.userAgent.includes('Firefox')){
      return;
    }
    this.caretEventHandler(event);
  }

  /**
   * Called by {@link setEventListeners} when an event that warrants a cursor position update is triggered
   */
  caretEventHandler(event: KeyboardHandlerEvent): void {
    let targetTagName: string;
    if (event.target.tagName) {
      targetTagName = event.target.tagName.toLowerCase();
    }

    this.dispatch((instance) => {
      let isKeyboard =
        event.target === instance.keyboardDOM ||
        (event.target && instance.keyboardDOM.contains(event.target));

      /**
       * If syncInstanceInputs option is enabled, make isKeyboard match any instance
       * not just the current one
       */
      if (this.options.syncInstanceInputs && Array.isArray(event.path)) {
        isKeyboard = event.path.some((item: HTMLElement) =>
          item?.hasAttribute?.("data-skInstance")
        );
      }

      if (
        (targetTagName === "textarea" ||
          (targetTagName === "input" &&
            ["text", "search", "url", "tel", "password"].includes(
              event.target.type
            ))) &&
        !instance.options.disableCaretPositioning
      ) {
        /**
         * Tracks current cursor position
         * As keys are pressed, text will be added/removed at that position within the input.
         */
        let selectionStart = event.target.selectionStart;
        let selectionEnd = event.target.selectionEnd;

        if(instance.options.rtl){
          selectionStart = instance.utilities.getRtlOffset(selectionStart, instance.getInput());
          selectionEnd = instance.utilities.getRtlOffset(selectionEnd, instance.getInput());
        }

        instance.setCaretPosition(selectionStart, selectionEnd);

        /**
         * Tracking current input in order to handle caret positioning edge cases
         */
        instance.activeInputElement = event.target;

        if (instance.options.debug) {
          console.log(
            "Caret at: ",
            instance.getCaretPosition(),
            instance.getCaretPositionEnd(),
            event && event.target.tagName.toLowerCase(),
            `(${instance.keyboardDOMClass})`,
            event?.type
          );
        }
      } else if (
        (instance.options.disableCaretPositioning || !isKeyboard) &&
        event?.type !== "selectionchange"
      ) {
        /**
         * If we toggled off disableCaretPositioning, we must ensure caretPosition doesn't persist once reactivated.
         */
        instance.setCaretPosition(null);

        /**
         * Resetting activeInputElement
         */
        instance.activeInputElement = null;

        if (instance.options.debug) {
          console.log(
            `Caret position reset due to "${event?.type}" event`,
            event
          );
        }
      }
    });
  }

  /**
   * Execute an operation on each button
   */
  recurseButtons(fn: any): void {
    if (!fn) return;

    Object.keys(this.buttonElements).forEach((buttonName) =>
      this.buttonElements[buttonName].forEach(fn)
    );
  }

  /**
   * Destroy keyboard listeners and DOM elements
   */
  destroy(): void {
    if (this.options.debug)
      console.log(
        `Destroying simple-keyboard instance: ${this.currentInstanceName}`
      );

    const { physicalKeyboardHighlightPreventDefault = false } = this.options;

    /**
     * Remove document listeners
     */
    document.removeEventListener("keyup", this.handleKeyUp, physicalKeyboardHighlightPreventDefault);
    document.removeEventListener("keydown", this.handleKeyDown, physicalKeyboardHighlightPreventDefault);
    document.removeEventListener("mouseup", this.handleMouseUp);
    document.removeEventListener("touchend", this.handleTouchEnd);
    document.removeEventListener("select", this.handleSelect);

    // selectionchange is causing caret update issues on Chrome
    // https://github.com/hodgef/simple-keyboard/issues/2346
    if (this.options.updateCaretOnSelectionChange) {
      document.removeEventListener("selectionchange", this.handleSelectionChange);
    }

    document.onpointerup = null;
    document.ontouchend = null;
    document.ontouchcancel = null;
    document.onmouseup = null;

    /**
     * Remove buttons
     */
    const deleteButton = (buttonElement: KeyboardElement | null) => {
      if (buttonElement) {
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
      }
    };

    this.recurseButtons(deleteButton);

    /**
     * Remove wrapper events
     */
    this.keyboardDOM.onpointerdown = null;
    this.keyboardDOM.ontouchstart = null;
    this.keyboardDOM.onmousedown = null;

    /**
     * Clearing keyboard rows
     */
    this.resetRows();

    /**
     * Candidate box
     */
    if (this.candidateBox) {
      this.candidateBox.destroy();
      this.candidateBox = null;
    }

    /**
     * Clearing activeInputElement
     */
    this.activeInputElement = null;

    /**
     * Removing instance attribute
     */
    this.keyboardDOM.removeAttribute("data-skInstance");

    /**
     * Clearing keyboardDOM
     */
    this.keyboardDOM.innerHTML = "";

    /**
     * Remove instance
     */
    (window as SKWindow)["SimpleKeyboardInstances"][this.currentInstanceName] = null;
    delete (window as SKWindow)["SimpleKeyboardInstances"][this.currentInstanceName];

    /**
     * Reset initialized flag
     */
    this.initialized = false;
  }

  /**
   * Process buttonTheme option
   */
  getButtonThemeClasses(button: string): string[] {
    const buttonTheme = this.options.buttonTheme;
    let buttonClasses: string[] = [];

    if (Array.isArray(buttonTheme)) {
      buttonTheme.forEach((themeObj) => {
        if (
          themeObj &&
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
  setDOMButtonAttributes(button: string, callback: any): void {
    const buttonAttributes = this.options.buttonAttributes;

    if (Array.isArray(buttonAttributes)) {
      buttonAttributes.forEach((attrObj) => {
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
    window.oncontextmenu = (event: KeyboardHandlerEvent) => {
      if (event.target.classList?.contains("hg-button")) {
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

    if (typeof this.options.onInit === "function") this.options.onInit(this);
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
      this.options.beforeFirstRender(this);

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
      this.options.beforeRender(this);
  }

  /**
   * Executes the callback function every time simple-keyboard is rendered (e.g: when you change layouts).
   */
  onRender() {
    if (typeof this.options.onRender === "function")
      this.options.onRender(this);
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
  registerModule = (name: string, initCallback: any) => {
    if (!this.modules[name]) this.modules[name] = {};

    initCallback(this.modules[name]);
  };

  /**
   * Load modules
   */
  loadModules() {
    if (Array.isArray(this.options.modules)) {
      this.options.modules.forEach((KeyboardModule) => {
        const keyboardModule = this.utilities.isConstructor(KeyboardModule) ?
          new KeyboardModule(this) : KeyboardModule(this);

        keyboardModule.init && keyboardModule.init(this);
      });

      this.keyboardPluginClasses = "modules-loaded";

      this.render();
      this.onModulesLoaded();
    }
  }

  /**
   * Get module prop
   */
  getModuleProp(name: string, prop: string) {
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
    rowDOM: HTMLDivElement,
    rowIndex: number,
    containerStartIndexes: number[],
    containerEndIndexes: number[]
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
        removedElements += updated_endIndex - updated_startIndex;

        /**
         * Inserting elements to container
         */
        containedElements.forEach((element) =>
          containerDOM.appendChild(element)
        );

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
        rowDOMArray.forEach((element) => rowDOM.appendChild(element));

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
  getKeyboardClassString = (...baseDOMClasses: any[]) => {
    const keyboardClasses = [this.keyboardDOMClass, ...baseDOMClasses].filter(
      (DOMClass) => !!DOMClass
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
    this.resetRows();

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
     * Adding keyboard identifier
     */
    this.keyboardDOM.setAttribute("data-skInstance", this.currentInstanceName);

    /**
     * Create row wrapper
     */
    this.keyboardRowsDOM = document.createElement("div");
    this.keyboardRowsDOM.className = "hg-rows";

    /**
     * Iterating through each row
     */
    layout[this.options.layoutName || this.defaultName].forEach(
      (row: string, rIndex: number) => {
        let rowArray = row.split(" ");

        /**
         * Enforce excludeFromLayout
         */
        if (
          this.options.excludeFromLayout &&
          this.options.excludeFromLayout[
            this.options.layoutName || this.defaultName
          ]
        ) {
          rowArray = rowArray.filter(
            (buttonName) =>
              this.options.excludeFromLayout &&
              !this.options.excludeFromLayout[
                this.options.layoutName || this.defaultName
              ].includes(buttonName)
          );
        }

        /**
         * Creating empty row
         */
        let rowDOM = document.createElement("div");
        rowDOM.className += "hg-row";

        /**
         * Tracking container indicators in rows
         */
        const containerStartIndexes: number[] = [];
        const containerEndIndexes: number[] = [];

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
          this.setDOMButtonAttributes(
            button,
            (attribute: string, value: string) => {
              buttonDOM.setAttribute(attribute, value);
            }
          );

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
            buttonDOM.onpointerdown = (e: KeyboardHandlerEvent) => {
              this.handleButtonClicked(button, e);
              this.handleButtonMouseDown(button, e);
            };
            buttonDOM.onpointerup = (e: KeyboardHandlerEvent) => {
              this.handleButtonMouseUp(button, e);
            };
            buttonDOM.onpointercancel = (e: KeyboardHandlerEvent) => {
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
              buttonDOM.ontouchstart = (e: KeyboardHandlerEvent) => {
                this.handleButtonClicked(button, e);
                this.handleButtonMouseDown(button, e);
              };
              buttonDOM.ontouchend = (e: KeyboardHandlerEvent) => {
                this.handleButtonMouseUp(button, e);
              };
              buttonDOM.ontouchcancel = (e: KeyboardHandlerEvent) => {
                this.handleButtonMouseUp(button, e);
              };
            } else {
              /**
               * Handle mouse events
               */
              buttonDOM.onclick = (e: KeyboardHandlerEvent) => {
                this.setMouseHold(false);
                /**
                 * Fire button handler in onclick for compatibility reasons
                 * This fires handler before onKeyReleased, therefore when that option is set we will fire the handler
                 * in onmousedown instead
                 */
                if (
                  typeof this.options.onKeyReleased !== "function" &&
                  !(this.options.useMouseEvents && this.options.clickOnMouseDown)
                ) {
                  this.handleButtonClicked(button, e);
                }
              };
              buttonDOM.onmousedown = (e: KeyboardHandlerEvent) => {
                /**
                 * Fire button handler for onKeyReleased use-case
                 */
                if (
                  (
                    typeof this.options.onKeyReleased === "function" ||
                    (this.options.useMouseEvents && this.options.clickOnMouseDown)
                  ) &&
                  !this.isMouseHold
                ) {
                  this.handleButtonClicked(button, e);
                }
                this.handleButtonMouseDown(button, e);
              };
              buttonDOM.onmouseup = (e: KeyboardHandlerEvent) => {
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
         * Appending row to hg-rows
         */
        this.keyboardRowsDOM.appendChild(rowDOM);
      }
    );

    /**
     * Appending row to keyboard
     */
    this.keyboardDOM.appendChild(this.keyboardRowsDOM);

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
        document.onpointerup = (e: KeyboardHandlerEvent) =>
          this.handleButtonMouseUp(undefined, e);
        this.keyboardDOM.onpointerdown = (e: KeyboardHandlerEvent) =>
          this.handleKeyboardContainerMouseDown(e);
      } else if (useTouchEvents) {
        /**
         * Handling ontouchend, ontouchcancel
         */
        document.ontouchend = (e: KeyboardHandlerEvent) =>
          this.handleButtonMouseUp(undefined, e);
        document.ontouchcancel = (e: KeyboardHandlerEvent) =>
          this.handleButtonMouseUp(undefined, e);

        this.keyboardDOM.ontouchstart = (e: KeyboardHandlerEvent) =>
          this.handleKeyboardContainerMouseDown(e);
      } else if (!useTouchEvents) {
        /**
         * Handling mouseup
         */
        document.onmouseup = (e: KeyboardHandlerEvent) =>
          this.handleButtonMouseUp(undefined, e);
        this.keyboardDOM.onmousedown = (e: KeyboardHandlerEvent) =>
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
