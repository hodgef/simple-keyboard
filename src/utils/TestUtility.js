/**
 * Test Utility Functions
 */
export default class TestUtility {
  /**
   * Set's a basic DOM structure to test in
   */
  setDOM = (divClass) => {
    this.clear();
    const wrapperDOM = document.createElement('div');
    wrapperDOM.setAttribute("id", "root");

    const keyboardDOM = document.createElement('div');
    keyboardDOM.className = divClass || "simple-keyboard";

    wrapperDOM.appendChild(keyboardDOM);
    document.body.appendChild(wrapperDOM);
  }

  /**
   * Clears DOM structure
   */
  clear = () => {
    document.body.innerHTML = "";
  }

  /**
   * Test if standard buttons respect maxLength and do input a value
   */
  testLayoutStdButtons = (keyboard) => {
    let stdBtnCount = 0;
    let fullInput = '';

    this.iterateButtons((button) => {
      let label = button.getAttribute("data-skbtn");

      if(label.includes("{"))
        return false;

      // Click all standard buttons, respects maxLength
      button.onclick();

      // Recording fullInput, bypasses maxLength
      fullInput = keyboard.utilities.getUpdatedInput(label, fullInput, keyboard.options, null);

      stdBtnCount += label.length;
    });

    /**
     * Check if maxLength is respected
     */
    if(
      (
        typeof keyboard.options.maxLength === "object" &&
        keyboard.getInput().length !== keyboard.options.maxLength[keyboard.options.layoutName]
      ) ||
      (
        typeof keyboard.options.maxLength !== "object" &&
        keyboard.getInput().length !== keyboard.options.maxLength
      )
    )
      throw new Error("MAX_LENGTH_ISSUE");
    else
      console.log("MAX_LENGTH PASSED:", keyboard.options.layoutName, keyboard.getInput().length, keyboard.options.maxLength);

    /**
     * Check if all standard buttons are inputting something
     * (Regardless of maxLength)
     */
    if(stdBtnCount !== fullInput.length)
      throw new Error("STANDARD_BUTTONS_ISSUE");
    else
      console.log("STANDARD_BUTTONS PASSED:", keyboard.options.layoutName, stdBtnCount, fullInput.length);
  }

  /**
   * Test if function buttons are interactive (have an onclick)
   */
  testLayoutFctButtons = (callback) => {
    let fctBtnCount = 0;
    let fctBtnHasOnclickCount = 0;

    this.iterateButtons((button) => {
      let label = button.getAttribute("data-skbtn");

      if(!label.includes("{") && !label.includes("}"))
        return false;

      fctBtnCount++;

      if(button.onclick){
        button.onclick();
        fctBtnHasOnclickCount++;
      }

      callback(fctBtnCount, fctBtnHasOnclickCount);
    });
  }

  /**
   * Iterates on the keyboard buttons
   */
  iterateButtons = (callback, selector) => {
    let rows = document.body.querySelector(selector || '.simple-keyboard').children;

    Array.from(rows).forEach(row => {
      Array.from(row.children).forEach((button) => {
        callback(button);
      });
    });
  }
}