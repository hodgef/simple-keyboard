import "./css/Keyboard.css";
import PhysicalKeyboard from "../services/PhysicalKeyboard";
import { KeyboardOptions, KeyboardInput, KeyboardButtonElements, KeyboardHandlerEvent, KeyboardElement } from "../interfaces";
import CandidateBox from "./CandidateBox";
/**
 * Root class for simple-keyboard.
 * This class:
 * - Parses the options
 * - Renders the rows and buttons
 * - Handles button functionality
 */
declare class SimpleKeyboard {
    input: KeyboardInput;
    options: KeyboardOptions;
    utilities: any;
    caretPosition: number | null;
    caretPositionEnd: number | null;
    keyboardDOM: KeyboardElement;
    keyboardPluginClasses: string;
    keyboardDOMClass: string;
    buttonElements: KeyboardButtonElements;
    currentInstanceName: string;
    allKeyboardInstances: {
        [key: string]: SimpleKeyboard;
    };
    keyboardInstanceNames: string[];
    isFirstKeyboardInstance: boolean;
    physicalKeyboard: PhysicalKeyboard;
    modules: {
        [key: string]: any;
    };
    activeButtonClass: string;
    holdInteractionTimeout: number;
    holdTimeout: number;
    isMouseHold: boolean;
    initialized: boolean;
    candidateBox: CandidateBox | null;
    keyboardRowsDOM: KeyboardElement;
    defaultName: string;
    activeInputElement: HTMLInputElement | HTMLTextAreaElement | null;
    /**
     * Creates an instance of SimpleKeyboard
     * @param {Array} params If first parameter is a string, it is considered the container class. The second parameter is then considered the options object. If first parameter is an object, it is considered the options object.
     */
    constructor(selectorOrOptions?: string | HTMLDivElement | KeyboardOptions, keyboardOptions?: KeyboardOptions);
    /**
     * parseParams
     */
    handleParams: (selectorOrOptions?: string | HTMLDivElement | KeyboardOptions, keyboardOptions?: KeyboardOptions) => {
        keyboardDOMClass: string;
        keyboardDOM: KeyboardElement;
        options: Partial<KeyboardOptions | undefined>;
    };
    /**
     * Getters
     */
    getOptions: () => KeyboardOptions;
    getCaretPosition: () => number | null;
    getCaretPositionEnd: () => number | null;
    /**
     * Changes the internal caret position
     * @param {number} position The caret's start position
     * @param {number} positionEnd The caret's end position
     */
    setCaretPosition(position: number | null, endPosition?: number | null): void;
    /**
     * Retrieve the candidates for a given input
     * @param input The input string to check
     */
    getInputCandidates(input: string): {
        candidateKey: string;
        candidateValue: string;
    } | Record<string, never>;
    /**
     * Shows a suggestion box with a list of candidate words
     * @param candidates The chosen candidates string as defined in the layoutCandidates option
     * @param targetElement The element next to which the candidates box will be shown
     */
    showCandidatesBox(candidateKey: string, candidateValue: string, targetElement: KeyboardElement): void;
    /**
     * Handles clicks made to keyboard buttons
     * @param  {string} button The button's layout name.
     */
    handleButtonClicked(button: string, e?: KeyboardHandlerEvent): void;
    /**
     * Get mouse hold state
     */
    getMouseHold(): boolean;
    /**
     * Mark mouse hold state as set
     */
    setMouseHold(value: boolean): void;
    /**
     * Handles button mousedown
     */
    handleButtonMouseDown(button: string, e: KeyboardHandlerEvent): void;
    /**
     * Handles button mouseup
     */
    handleButtonMouseUp(button?: string, e?: KeyboardHandlerEvent): void;
    /**
     * Handles container mousedown
     */
    handleKeyboardContainerMouseDown(e: KeyboardHandlerEvent): void;
    /**
     * Handles button hold
     */
    handleButtonHold(button: string): void;
    /**
     * Send a command to all simple-keyboard instances (if you have several instances).
     */
    syncInstanceInputs(): void;
    /**
     * Clear the keyboard’s input.
     * @param {string} [inputName] optional - the internal input to select
     */
    clearInput(inputName?: string): void;
    /**
     * Get the keyboard’s input (You can also get it from the onChange prop).
     * @param  {string} [inputName] optional - the internal input to select
     */
    getInput(inputName?: string, skipSync?: boolean): string;
    /**
     * Get all simple-keyboard inputs
     */
    getAllInputs(): KeyboardInput;
    /**
     * Set the keyboard’s input.
     * @param  {string} input the input value
     * @param  {string} inputName optional - the internal input to select
     */
    setInput(input: string, inputName?: string, skipSync?: boolean): void;
    /**
     * Replace the input object (`keyboard.input`)
     * @param  {object} inputObj The input object
     */
    replaceInput(inputObj: KeyboardInput): void;
    /**
     * Set new option or modify existing ones after initialization.
     * @param  {object} options The options to set
     */
    setOptions(options?: {}): void;
    /**
     * Detecting changes to non-function options
     * This allows us to ascertain whether a button re-render is needed
     */
    changedOptions(newOptions: Partial<KeyboardOptions>): string[];
    /**
     * Executing actions depending on changed options
     * @param  {object} options The options to set
     */
    onSetOptions(changedOptions?: string[]): void;
    /**
     * Remove all keyboard rows and reset keyboard values.
     * Used internally between re-renders.
     */
    resetRows(): void;
    /**
     * Send a command to all simple-keyboard instances at once (if you have multiple instances).
     * @param  {function(instance: object, key: string)} callback Function to run on every instance
     */
    dispatch(callback: (instance: SimpleKeyboard, key?: string) => void): void;
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
     * Get the DOM Element of a button. If there are several buttons with the same name, an array of the DOM Elements is returned.
     * @param  {string} button The button layout name to select
     */
    getButtonElement(button: string): KeyboardElement | KeyboardElement[] | undefined;
    /**
     * This handles the "inputPattern" option
     * by checking if the provided inputPattern passes
     */
    inputPatternIsValid(inputVal: string): boolean;
    /**
     * Handles simple-keyboard event listeners
     */
    setEventListeners(): void;
    /**
     * Event Handler: KeyUp
     */
    handleKeyUp(event: KeyboardHandlerEvent): void;
    /**
     * Event Handler: KeyDown
     */
    handleKeyDown(event: KeyboardHandlerEvent): void;
    /**
     * Event Handler: MouseUp
     */
    handleMouseUp(event: KeyboardHandlerEvent): void;
    /**
     * Event Handler: TouchEnd
     */
    handleTouchEnd(event: KeyboardHandlerEvent): void;
    /**
     * Event Handler: Select
     */
    handleSelect(event: KeyboardHandlerEvent): void;
    /**
     * Event Handler: SelectionChange
     */
    handleSelectionChange(event: KeyboardHandlerEvent): void;
    /**
     * Called by {@link setEventListeners} when an event that warrants a cursor position update is triggered
     */
    caretEventHandler(event: KeyboardHandlerEvent): void;
    /**
     * Execute an operation on each button
     */
    recurseButtons(fn: any): void;
    /**
     * Destroy keyboard listeners and DOM elements
     */
    destroy(): void;
    /**
     * Process buttonTheme option
     */
    getButtonThemeClasses(button: string): string[];
    /**
     * Process buttonAttributes option
     */
    setDOMButtonAttributes(button: string, callback: any): void;
    onTouchDeviceDetected(): void;
    /**
     * Disabling contextual window for hg-button
     */
    disableContextualWindow(): void;
    /**
     * Process autoTouchEvents option
     */
    processAutoTouchEvents(): void;
    /**
     * Executes the callback function once simple-keyboard is rendered for the first time (on initialization).
     */
    onInit(): void;
    /**
     * Executes the callback function before a simple-keyboard render.
     */
    beforeFirstRender(): void;
    /**
     * Executes the callback function before a simple-keyboard render.
     */
    beforeRender(): void;
    /**
     * Executes the callback function every time simple-keyboard is rendered (e.g: when you change layouts).
     */
    onRender(): void;
    /**
     * Executes the callback function once all modules have been loaded
     */
    onModulesLoaded(): void;
    /**
     * Register module
     */
    registerModule: (name: string, initCallback: any) => void;
    /**
     * Load modules
     */
    loadModules(): void;
    /**
     * Get module prop
     */
    getModuleProp(name: string, prop: string): any;
    /**
     * getModulesList
     */
    getModulesList(): string[];
    /**
     * Parse Row DOM containers
     */
    parseRowDOMContainers(rowDOM: HTMLDivElement, rowIndex: number, containerStartIndexes: number[], containerEndIndexes: number[]): HTMLDivElement;
    /**
     * getKeyboardClassString
     */
    getKeyboardClassString: (...baseDOMClasses: any[]) => string;
    /**
     * Renders rows and buttons as per options
     */
    render(): void;
}
export default SimpleKeyboard;
