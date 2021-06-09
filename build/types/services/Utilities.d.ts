import { KeyboardInput } from "./../interfaces";
import { KeyboardOptions, UtilitiesParams } from "../interfaces";
/**
 * Utility Service
 */
declare class Utilities {
    getOptions: () => KeyboardOptions;
    getCaretPosition: () => number | null;
    getCaretPositionEnd: () => number | null;
    dispatch: any;
    maxLengthReached: boolean;
    /**
     * Creates an instance of the Utility service
     */
    constructor({ getOptions, getCaretPosition, getCaretPositionEnd, dispatch, }: UtilitiesParams);
    /**
     * Retrieve button type
     *
     * @param  {string} button The button's layout name
     * @return {string} The button type
     */
    getButtonType(button: string): string;
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
        "{forwarddelete}": string;
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
    updateCaretPosAction(length: number, minus?: boolean): number | null;
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
     * Check whether the button is a standard button
     */
    isStandardButton: (button: string) => boolean | "";
    /**
     * Removes an amount of characters before a given position
     *
     * @param  {string} source The source input
     * @param  {number} position The (cursor) position from where the characters should be removed
     * @param  {boolean} moveCaret Whether to update simple-keyboard's cursor
     */
    removeAt(source: string, position?: number, positionEnd?: number, moveCaret?: boolean): string;
    /**
     * Removes an amount of characters after a given position
     *
     * @param  {string} source The source input
     * @param  {number} position The (cursor) position from where the characters should be removed
     */
    removeForwardsAt(source: string, position?: number, positionEnd?: number, moveCaret?: boolean): string;
    /**
     * Determines whether the maxLength has been reached. This function is called when the maxLength option it set.
     *
     * @param  {object} inputObj
     * @param  {string} updatedInput
     */
    handleMaxLength(inputObj: KeyboardInput, updatedInput: string): boolean | undefined;
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
    pointerEventsSupported(): boolean;
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
    /**
     * Split array into chunks
     */
    chunkArray<T>(arr: T[], size: number): T[][];
    /**
     * Reusable empty function
     */
    static noop: () => void;
}
export default Utilities;
