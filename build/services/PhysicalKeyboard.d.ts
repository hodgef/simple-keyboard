import { KeyboardOptions, PhysicalKeyboardParams } from "../interfaces";
/**
 * Layout Key Mapping Interface
 */
interface LayoutKeyMapping {
    normal: string | number;
    shift: string | number;
}
/**
 * Physical Keyboard Service
 */
declare class PhysicalKeyboard {
    getOptions: () => KeyboardOptions;
    dispatch: any;
    layoutJSON: Record<string, LayoutKeyMapping> | null;
    shiftActive: boolean;
    capslockActive: boolean;
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
    extractAndPadLayout(layout: Record<string, string[]>): Record<string, (string | number)[][]>;
    mapLayoutToEventCodes(layout: Record<string, (string | number)[][]>): Record<string, LayoutKeyMapping>;
    isModifierKey: (e: KeyboardEvent) => boolean;
}
export default PhysicalKeyboard;
