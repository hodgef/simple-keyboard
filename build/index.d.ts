declare module "services/KeyboardLayout" {
    export const getDefaultLayout: () => {
        default: string[];
        shift: string[];
    };
}
declare module "interfaces" {
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
    export interface KeyboardInput {
        [key: string]: string;
    }
    export type KeyboardButton = HTMLDivElement | HTMLButtonElement;
    export type KeyboardHandlerEvent = PointerEvent & TouchEvent & KeyboardEvent & {
        target: HTMLDivElement | HTMLInputElement;
    };
    export interface KeyboardButtonElements {
        [key: string]: KeyboardButton[];
    }
    export interface UtilitiesParams {
        getOptions: () => KeyboardOptions;
        getCaretPosition: () => number;
        getCaretPositionEnd: () => number;
        dispatch: any;
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
        display?: {
            [button: string]: string;
        };
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
         * Module options can have any format
         */
        [name: string]: any;
    }
}
declare module "services/Utilities" {
    import { KeyboardInput } from "interfaces";
    import { KeyboardOptions, UtilitiesParams } from "interfaces";
    /**
     * Utility Service
     */
    class Utilities {
        getOptions: () => KeyboardOptions;
        getCaretPosition: () => number;
        getCaretPositionEnd: () => number;
        dispatch: any;
        maxLengthReached: boolean;
        /**
         * Creates an instance of the Utility service
         */
        constructor({ getOptions, getCaretPosition, getCaretPositionEnd, dispatch, }: UtilitiesParams);
        /**
         * Adds default classes to a given button
         *
         * @param  {string} button The button's layout name
         * @return {string} The classes to be added to the button
         */
        getButtonClass(button: string): string;
        /**
         * Default button display labels
         */
        getDefaultDiplay(): {
            "{bksp}": string;
            "{backspace}": string;
            "{enter}": string;
            "{shift}": string;
            "{shiftleft}": string;
            "{shiftright}": string;
            "{alt}": string;
            "{s}": string;
            "{tab}": string;
            "{lock}": string;
            "{capslock}": string;
            "{accept}": string;
            "{space}": string;
            "{//}": string;
            "{esc}": string;
            "{escape}": string;
            "{f1}": string;
            "{f2}": string;
            "{f3}": string;
            "{f4}": string;
            "{f5}": string;
            "{f6}": string;
            "{f7}": string;
            "{f8}": string;
            "{f9}": string;
            "{f10}": string;
            "{f11}": string;
            "{f12}": string;
            "{numpaddivide}": string;
            "{numlock}": string;
            "{arrowup}": string;
            "{arrowleft}": string;
            "{arrowdown}": string;
            "{arrowright}": string;
            "{prtscr}": string;
            "{scrolllock}": string;
            "{pause}": string;
            "{insert}": string;
            "{home}": string;
            "{pageup}": string;
            "{delete}": string;
            "{end}": string;
            "{pagedown}": string;
            "{numpadmultiply}": string;
            "{numpadsubtract}": string;
            "{numpadadd}": string;
            "{numpadenter}": string;
            "{period}": string;
            "{numpaddecimal}": string;
            "{numpad0}": string;
            "{numpad1}": string;
            "{numpad2}": string;
            "{numpad3}": string;
            "{numpad4}": string;
            "{numpad5}": string;
            "{numpad6}": string;
            "{numpad7}": string;
            "{numpad8}": string;
            "{numpad9}": string;
        };
        /**
         * Returns the display (label) name for a given button
         *
         * @param  {string} button The button's layout name
         * @param  {object} display The provided display option
         * @param  {boolean} mergeDisplay Whether the provided param value should be merged with the default one.
         */
        getButtonDisplayName(button: string, display: KeyboardOptions["display"], mergeDisplay: boolean): string;
        /**
         * Returns the updated input resulting from clicking a given button
         *
         * @param  {string} button The button's layout name
         * @param  {string} input The input string
         * @param  {number} caretPos The cursor's current position
         * @param  {number} caretPosEnd The cursor's current end position
         * @param  {boolean} moveCaret Whether to update simple-keyboard's cursor
         */
        getUpdatedInput(button: string, input: string, caretPos: number, caretPosEnd?: number, moveCaret?: boolean): string;
        /**
         * Moves the cursor position by a given amount
         *
         * @param  {number} length Represents by how many characters the input should be moved
         * @param  {boolean} minus Whether the cursor should be moved to the left or not.
         */
        updateCaretPos(length: number, minus?: boolean): void;
        /**
         * Action method of updateCaretPos
         *
         * @param  {number} length Represents by how many characters the input should be moved
         * @param  {boolean} minus Whether the cursor should be moved to the left or not.
         */
        updateCaretPosAction(length: number, minus?: boolean): number;
        /**
         * Adds a string to the input at a given position
         *
         * @param  {string} source The source input
         * @param  {string} str The string to add
         * @param  {number} position The (cursor) position where the string should be added
         * @param  {boolean} moveCaret Whether to update simple-keyboard's cursor
         */
        addStringAt(source: string, str: string, position?: number, positionEnd?: number, moveCaret?: boolean): string;
        /**
         * Removes an amount of characters at a given position
         *
         * @param  {string} source The source input
         * @param  {number} position The (cursor) position from where the characters should be removed
         * @param  {boolean} moveCaret Whether to update simple-keyboard's cursor
         */
        removeAt(source: string, position?: number, positionEnd?: number, moveCaret?: boolean): string;
        /**
         * Determines whether the maxLength has been reached. This function is called when the maxLength option it set.
         *
         * @param  {object} inputObj
         * @param  {string} updatedInput
         */
        handleMaxLength(inputObj: KeyboardInput, updatedInput: string): boolean;
        /**
         * Gets the current value of maxLengthReached
         */
        isMaxLengthReached(): boolean;
        /**
         * Determines whether a touch device is being used
         */
        isTouchDevice(): number | true;
        /**
         * Determines whether pointer events are supported
         */
        pointerEventsSupported(): {
            new (type: string, eventInitDict?: PointerEventInit): PointerEvent;
            prototype: PointerEvent;
        };
        /**
         * Bind all methods in a given class
         */
        static bindMethods(myClass: any, instance: any): void;
        /**
         * Transforms an arbitrary string to camelCase
         *
         * @param  {string} str The string to transform.
         */
        camelCase(str: string): string;
        static noop: () => void;
    }
    export default Utilities;
}
declare module "services/PhysicalKeyboard" {
    import { KeyboardOptions, UtilitiesParams } from "interfaces";
    /**
     * Physical Keyboard Service
     */
    class PhysicalKeyboard {
        getOptions: () => KeyboardOptions;
        dispatch: any;
        /**
         * Creates an instance of the PhysicalKeyboard service
         */
        constructor({ dispatch, getOptions }: Partial<UtilitiesParams>);
        handleHighlightKeyDown(event: KeyboardEvent): void;
        handleHighlightKeyUp(event: KeyboardEvent): void;
        /**
         * Transforms a KeyboardEvent's "key.code" string into a simple-keyboard layout format
         * @param  {object} event The KeyboardEvent
         */
        getSimpleKeyboardLayoutKey(event: KeyboardEvent): string;
    }
    export default PhysicalKeyboard;
}
declare module "components/Keyboard" {
    import "./Keyboard.css";
    import PhysicalKeyboard from "services/PhysicalKeyboard";
    import { KeyboardOptions, KeyboardInput, KeyboardButtonElements, KeyboardHandlerEvent, KeyboardButton } from "interfaces";
    /**
     * Root class for simple-keyboard
     * This class:
     * - Parses the options
     * - Renders the rows and buttons
     * - Handles button functionality
     */
    class SimpleKeyboard {
        input: KeyboardInput;
        options: KeyboardOptions;
        utilities: any;
        caretPosition: number;
        caretPositionEnd: number;
        keyboardDOM: KeyboardButton;
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
        /**
         * Creates an instance of SimpleKeyboard
         * @param {Array} params If first parameter is a string, it is considered the container class. The second parameter is then considered the options object. If first parameter is an object, it is considered the options object.
         */
        constructor(...params: []);
        /**
         * parseParams
         */
        handleParams: (params: any[]) => {
            keyboardDOMClass: string;
            keyboardDOM: KeyboardButton;
            options: Partial<KeyboardOptions>;
        };
        /**
         * Getters
         */
        getOptions: () => KeyboardOptions;
        getCaretPosition: () => number;
        getCaretPositionEnd: () => number;
        /**
         * Changes the internal caret position
         * @param {number} position The caret's start position
         * @param {number} positionEnd The caret's end position
         */
        setCaretPosition(position: number, endPosition?: number): void;
        /**
         * Handles clicks made to keyboard buttons
         * @param  {string} button The button's layout name.
         */
        handleButtonClicked(button: string): void;
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
        clearInput(inputName: string): void;
        /**
         * Get the keyboard’s input (You can also get it from the onChange prop).
         * @param  {string} [inputName] optional - the internal input to select
         */
        getInput(inputName: string, skipSync?: boolean): string;
        /**
         * Get all simple-keyboard inputs
         */
        getAllInputs(): KeyboardInput;
        /**
         * Set the keyboard’s input.
         * @param  {string} input the input value
         * @param  {string} inputName optional - the internal input to select
         */
        setInput(input: string, inputName: string): void;
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
        onSetOptions(options: Partial<KeyboardOptions>): void;
        /**
         * Remove all keyboard rows and reset keyboard values.
         * Used internally between re-renders.
         */
        clear(): void;
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
        getButtonElement(button: string): KeyboardButton | KeyboardButton[];
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
}
declare module "index" {
    import SimpleKeyboard from "components/Keyboard";
    export default SimpleKeyboard;
}
