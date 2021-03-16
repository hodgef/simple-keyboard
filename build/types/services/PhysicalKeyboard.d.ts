import { KeyboardOptions, UtilitiesParams } from "../interfaces";
/**
 * Physical Keyboard Service
 */
declare class PhysicalKeyboard {
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
