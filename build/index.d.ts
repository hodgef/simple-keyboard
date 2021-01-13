declare module 'simple-keyboard' {
  export interface KeyboardLayoutObject {
    [key: string]: string[];
  }

  export interface KeyboardButtonTheme {
    class: string;
    buttons: string;
  }

  export interface KeyboardButtonAttributes {
    attribute: string;
    value: string;
    buttons: string;
  }

  export interface KeyboardOptions {
    /**
     * Modify the keyboard layout.
     */
    layout?: KeyboardLayoutObject;

    /**
     * Specifies which layout should be used.
     */
    layoutName?: string;

    /**
     * Replaces variable buttons (such as `{bksp}`) with a human-friendly name (e.g.: `backspace`).
     */
    display?: { [button: string]: string };

    /**
     * By default, when you set the display property, you replace the default one. This setting merges them instead.
     */
    mergeDisplay?: boolean;

    /**
     * A prop to add your own css classes to the keyboard wrapper. You can add multiple classes separated by a space.
     */
    theme?: string;

    /**
     * A prop to add your own css classes to one or several buttons.
     */
    buttonTheme?: KeyboardButtonTheme[];

    /**
     * A prop to add your own attributes to one or several buttons.
     */
    buttonAttributes?: KeyboardButtonAttributes[];

    /**
     * Runs a `console.log` every time a key is pressed. Displays the buttons pressed and the current input.
     */
    debug?: boolean;

    /**
     * Specifies whether clicking the "ENTER" button will input a newline (`\n`) or not.
     */
    newLineOnEnter?: boolean;

    /**
     * Specifies whether clicking the "TAB" button will input a tab character (`\t`) or not.
     */
    tabCharOnTab?: boolean;

    /**
     * Allows you to use a single simple-keyboard instance for several inputs.
     */
    inputName?: string;

    /**
     * `number`: Restrains all of simple-keyboard inputs to a certain length. This should be used in addition to the input element’s maxlengthattribute.
     *
     * `{ [inputName: string]: number }`: Restrains simple-keyboard’s individual inputs to a certain length. This should be used in addition to the input element’s maxlengthattribute.
     */
    maxLength?: any;

    /**
     * When set to true, this option synchronizes the internal input of every simple-keyboard instance.
     */
    syncInstanceInputs?: boolean;

    /**
     * Enable highlighting of keys pressed on physical keyboard.
     */
    physicalKeyboardHighlight?: boolean;

    /**
     * Presses keys highlighted by physicalKeyboardHighlight
     */
    physicalKeyboardHighlightPress?: boolean;

    /**
     * Define the text color that the physical keyboard highlighted key should have.
     */
    physicalKeyboardHighlightTextColor?: string;

    /**
     * Define the background color that the physical keyboard highlighted key should have.
     */
    physicalKeyboardHighlightBgColor?: string;

    /**
     * Calling preventDefault for the mousedown events keeps the focus on the input.
     */
    preventMouseDownDefault?: boolean;

    /**
     * Calling preventDefault for the mouseup events.
     */
    preventMouseUpDefault?: boolean;
    
    /**
     * Stops pointer down events on simple-keyboard buttons from bubbling to parent elements.
     */
    stopMouseDownPropagation?: boolean;

    /**
     * Stops pointer up events on simple-keyboard buttons from bubbling to parent elements.
     */
    stopMouseUpPropagation?: boolean;

    /**
     * Render buttons as a button element instead of a div element.
     */
    useButtonTag?: boolean;

    /**
     * A prop to ensure characters are always be added/removed at the end of the string.
     */
    disableCaretPositioning?: boolean;

    /**
     * Restrains input(s) change to the defined regular expression pattern.
     */
    inputPattern?: any;

    /**
     * Instructs simple-keyboard to use touch events instead of click events.
     */
    useTouchEvents?: boolean;

    /**
     * Enable useTouchEvents automatically when touch device is detected.
     */
    autoUseTouchEvents?: boolean;

    /**
     * Opt out of PointerEvents handling, falling back to the prior mouse event logic.
     */
    useMouseEvents?: boolean;

    /**
     * Disable button hold action.
     */
    disableButtonHold?: boolean;

    /**
     * Adds unicode right-to-left control characters to input return values.
     */
    rtl?: boolean;

    /**
     * Executes the callback function on key press. Returns button layout name (i.e.: "{shift}").
     */
    onKeyPress?: (button: string) => any;

    /**
     * Executes the callback function on key release.
     */
    onKeyReleased?: (button: string) => any;

    /**
     * Executes the callback function on input change. Returns the current input's string.
     */
    onChange?: (input: string) => any;

    /**
     * Executes the callback function before the first simple-keyboard render.
     */
    beforeFirstRender?: () => void;

    /**
     * Executes the callback function before a simple-keyboard render.
     */
    beforeRender?: () => void;

    /**
     * Executes the callback function every time simple-keyboard is rendered (e.g: when you change layouts).
     */
    onRender?: () => void;

    /**
     * Executes the callback function once simple-keyboard is rendered for the first time (on initialization).
     */
    onInit?: () => void;

    /**
     * Executes the callback function on input change. Returns the input object with all defined inputs.
     */
    onChangeAll?: (inputs: any) => any;

    /**
     * Module classes to be loaded by simple-keyboard.
     */
    modules?: any[];

    /**
     * Module options can have any format
     */
    [name: string]: any;
  }

  class Keyboard {
    constructor(selector: string, options: KeyboardOptions);
    constructor(selector: HTMLDivElement, options: KeyboardOptions);
    constructor(options: KeyboardOptions);

    /**
     * Options
     */
    options: KeyboardOptions;

    /**
     * Utilities
     */
    utilities?: any;

    /**
     * caretPosition
     */
    caretPosition?: number;


    /**
     * caretPositionEnd
     */
    caretPositionEnd?: number;

    /**
     * Changes the internal caret position
     * @param {number} position The caret's start position
     * @param {number} positionEnd The caret's end position
     */
    setCaretPosition(position: number, positionEnd?: number): void;

    /**
     * Retrieves the internal caret position
     */
    getCaretPosition(): number;

    /**
     * Retrieves the internal end caret position
     */
    getCaretPositionEnd(): number;

    /**
     * Adds/Modifies an entry to the `buttonTheme`. Basically a way to add a class to a button.
     * @param  {string} buttons List of buttons to select (separated by a space).
     * @param  {string} className Classes to give to the selected buttons (separated by space).
     */
    addButtonTheme(buttons: string, className: string): void;

    /**
     * Removes/Amends an entry to the `buttonTheme`. Basically a way to remove a class previously added to a button through buttonTheme or addButtonTheme.
     * @param  {string} buttons List of buttons to select (separated by a space).
     * @param  {string} className Classes to give to the selected buttons (separated by space).
     */
    removeButtonTheme(buttons: string, className: string): void;

    /**
     * Clear the keyboard's input.
     *
     * @param {string} [inputName] optional - the internal input to select
     */
    clearInput(inputName?: string): void;

    /**
     * Get the keyboard’s input (You can also get it from the onChange prop).
     * @param  {string} [inputName] optional - the internal input to select
     */
    getInput(inputName?: string): string;

    /**
     * Set the keyboard’s input.
     * @param  {string} input the input value
     * @param  {string} inputName optional - the internal input to select
     */
    setInput(input: string, inputName?: string): void;

    /**
     * Replaces the entire internal input object.
     * @param  {string} input the input object
     */
    replaceInput(input: any): void;

    /**
     * Set new option or modify existing ones after initialization.
     * @param  {KeyboardOptions} option The option to set
     */
    setOptions(options: KeyboardOptions): void;

    /**
     * Send a command to all simple-keyboard instances at once (if you have multiple instances).
     * @param  {function(instance: object, key: string)} callback Function to run on every instance
     */
    dispatch(callback: (instance: any, key: string) => void): void;

    /**
     * Get the DOM Element of a button. If there are several buttons with the same name, an array of the DOM Elements is returned.
     * @param  {string} button The button layout name to select
     */
    getButtonElement(button: string): HTMLElement | HTMLElement[];

    /**
     * Clears keyboard listeners and DOM elements.
     */
    destroy(): void;

    /**
     * Iterate on each button (ForEach)
     */
    recurseButtons(fn: any): void;
  }

  export default Keyboard;
}
