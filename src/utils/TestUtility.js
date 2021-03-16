/**
 * Test Utility Functions
 */
  /**
   * Sets a basic DOM structure to test in
   */
  export const setDOM = (divClass) => {
    clearDOM();
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
  export const clearDOM = () => {
    document.body.innerHTML = "";
  }

  /**
   * Trigger pointerup
   */
  export const triggerDocumentPointerUp = (e = {}) => {
    document.dispatchEvent(new MouseEvent('mouseup', e));
  };

  /**
   * Trigger pointerdown
   */
  export const triggerDocumentPointerDown = (e = {}) => {
    document.dispatchEvent(new MouseEvent('mousedown', e));
  };
 
  /**
   * Test if standard buttons respect maxLength and do input a value
   */
  export const testLayoutStdButtons = (keyboard) => {
    let stdBtnCount = 0;
    let fullInput = '';

    keyboard.recurseButtons((button) => {
      const label = button.getAttribute("data-skbtn");

      if(label.includes("{"))
        return false;

      // Click all standard buttons, respects maxLength
      button.onclick();

      // Recording fullInput, bypasses maxLength
      fullInput = keyboard.utilities.getUpdatedInput(label, fullInput);

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
  export const testLayoutFctButtons = (keyboard, callback) => {
    let fctBtnCount = 0;
    let fctBtnHasOnclickCount = 0;

    keyboard.recurseButtons((button) => {
      const label = button.getAttribute("data-skbtn");

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
   * Remove RTL control chars
   */
  export const removeRTLControls = (input) => {
    return input.replace("\u202B", "").replace("\u202C", "");
  }