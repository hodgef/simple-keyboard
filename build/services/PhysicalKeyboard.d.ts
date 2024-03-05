import { KeyboardOptions, PhysicalKeyboardParams } from "../interfaces";
/**
 * Physical Keyboard Service
 */
declare class PhysicalKeyboard {
    getOptions: () => KeyboardOptions;
    dispatch: any;
    /**
     * Creates an instance of the PhysicalKeyboard service
     */
    constructor({ dispatch, getOptions }: PhysicalKeyboardParams);
    handleHighlightKeyDown(e: KeyboardEvent): void;
    handleHighlightKeyUp(e: KeyboardEvent): void;
    /**
     * Transforms a KeyboardEvent's "key.code" string into a simple-keyboard layout format
     * @param  {object} e The KeyboardEvent
     */
    getSimpleKeyboardLayoutKey(e: KeyboardEvent): string;
    /**
     * Retrieve key from keyCode
     */
    keyCodeToKey(keyCode: number): string;
    isModifierKey: (e: KeyboardEvent) => boolean;
}
export default PhysicalKeyboard;
