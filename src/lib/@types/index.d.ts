declare module 'simple-keyboard' {
  class SimpleKeyboard {
    constructor(selector: string, options: SimpleKeyboardOptions);
  }

  interface SimpleKeyboardOptions {
    /**
     * Modify the keyboard layout.
     */
    layout: any;

    /**
     * Specifies which layout should be used.
     */
    layoutName: string;

    /**
     * Replaces variable buttons (such as {bksp}) with a human-friendly name (e.g.: “backspace”).
     */
    display: any;

    /**
     * By default, when you set the display property, you replace the default one. This setting merges them instead.
     */
    mergeDisplay: boolean;

    /**
     * A prop to add your own css classes to the keyboard wrapper. You can add multiple classes separated by a space.
     */
    theme: string;

    /**
     * A prop to add your own css classes to one or several buttons.
     */
    buttonTheme: any[];

    /**
     * Runs a console.log every time a key is pressed. Displays the buttons pressed and the current input.
     */
    debug: boolean;

    /**
     * Specifies whether clicking the “ENTER” button will input a newline (\n) or not.
     */
    newLineOnEnter: boolean;

    /**
     * Specifies whether clicking the “TAB” button will input a tab character (\t) or not.
     */
    tabCharOnTab: boolean;
  }

  export default SimpleKeyboard;
}

