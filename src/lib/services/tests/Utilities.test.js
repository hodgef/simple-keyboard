import Keyboard from '../../components/Keyboard';
import { setDOM, clearDOM, testLayoutFctButtons } from '../../../utils/TestUtility';

it('Keyboard mergeDisplay will work', () => {
  setDOM();

  const keyboard = new Keyboard({
    mergeDisplay: true,
    display: {
      "q": "qreplaced"
    }
  });
  
  expect(keyboard.getButtonElement("q").querySelector("span").innerHTML).toBe("qreplaced");
});

it('Keyboard function buttons will work', () => {
  setDOM();

  const keyboard = new Keyboard();
  
  testLayoutFctButtons(keyboard, (fctBtnCount, fctBtnHasOnclickCount) => {
    expect(fctBtnCount).toBe(fctBtnHasOnclickCount);
  }, keyboard);
});

it('Keyboard {bksp} button will work', () => {
  setDOM();

  const keyboard = new Keyboard();

  const output = keyboard.utilities.getUpdatedInput("{bksp}", "test");
  
  expect(output).toBe("tes");
});

it('Keyboard {delete} button will work', () => {
  setDOM();

  const keyboard = new Keyboard();

  const output = keyboard.utilities.getUpdatedInput("{delete}", "test", 1);
  
  expect(output).toBe("tst");
});

it('Keyboard {space} button will work', () => {
  setDOM();

  const keyboard = new Keyboard();

  const output = keyboard.utilities.getUpdatedInput("{space}", "test");
  
  expect(output).toBe("test ");
});

it('Keyboard {tab} button will work', () => {
  setDOM();

  const keyboard = new Keyboard();

  const output = keyboard.utilities.getUpdatedInput("{tab}", "test");
  
  expect(output).toBe("test\t");
});

it('Keyboard {tab} button will work with tabCharOnTab:false', () => {
  setDOM();

  const keyboard = new Keyboard({
    tabCharOnTab: false
  });

  const output = keyboard.utilities.getUpdatedInput("{tab}", "test");
  
  expect(output).toBe("test");
});

it('Keyboard {enter} button will work', () => {
  setDOM();

  const keyboard = new Keyboard();

  const output = keyboard.utilities.getUpdatedInput("{enter}", "test");
  
  expect(output).toBe("test");
});

it('Keyboard {enter} button will work with newLineOnEnter:true', () => {
  setDOM();

  const keyboard = new Keyboard({
    newLineOnEnter: true
  });

  const output = keyboard.utilities.getUpdatedInput("{enter}", "test");
  
  expect(output).toBe("test\n");
});

it('Keyboard {numpadX} buttons will work', () => {
  setDOM();

  const keyboard = new Keyboard();

  for(let i = 0;i<=9;i++){
    const output = keyboard.utilities.getUpdatedInput(`{numpad${i}}`, "test");
    expect(output).toBe(`test${i}`);
  }
});

it('Keyboard {numpaddivide} button will work', () => {
  setDOM();

  const keyboard = new Keyboard();

  const output = keyboard.utilities.getUpdatedInput("{numpaddivide}", "test");
  
  expect(output).toBe("test/");
});

it('Keyboard {numpadmultiply} button will work', () => {
  setDOM();

  const keyboard = new Keyboard();

  const output = keyboard.utilities.getUpdatedInput("{numpadmultiply}", "test");
  
  expect(output).toBe("test*");
});

it('Keyboard {numpadsubtract} button will work', () => {
  setDOM();

  const keyboard = new Keyboard();

  const output = keyboard.utilities.getUpdatedInput("{numpadsubtract}", "test");
  
  expect(output).toBe("test-");
});

it('Keyboard {numpadadd} button will work', () => {
  setDOM();

  const keyboard = new Keyboard();

  const output = keyboard.utilities.getUpdatedInput("{numpadadd}", "test");
  
  expect(output).toBe("test+");
});

it('Keyboard {numpadadd} button will work', () => {
  setDOM();

  const keyboard = new Keyboard();

  const output = keyboard.utilities.getUpdatedInput("{numpadadd}", "test");
  
  expect(output).toBe("test+");
});

it('Keyboard {numpaddecimal} button will work', () => {
  setDOM();

  const keyboard = new Keyboard();

  const output = keyboard.utilities.getUpdatedInput("{numpaddecimal}", "test");
  
  expect(output).toBe("test.");
});

it('Keyboard custom function buttons will work', () => {
  setDOM();

  const keyboard = new Keyboard({
    layout: {
      default: [
        "{randombuttontest}"
      ]
    }
  });

  const output = keyboard.utilities.getUpdatedInput("{randombuttontest}", "test");
  
  expect(output).toBe("test");
  expect(keyboard.getButtonElement("{randombuttontest}").onclick).toBeTruthy();
});

it('Keyboard "{" button will work', () => {
  setDOM();

  const keyboard = new Keyboard();

  const output = keyboard.utilities.getUpdatedInput("{", "test");
  
  expect(output).toBe("test{");
});

it('Keyboard "}" button will work', () => {
  setDOM();

  const keyboard = new Keyboard();

  const output = keyboard.utilities.getUpdatedInput("}", "test");
  
  expect(output).toBe("test}");
});

it('Keyboard standard button will affect input', () => {
  setDOM();

  const keyboard = new Keyboard();

  for (let i = 65; i <= 90; i++) {
    const char = String.fromCharCode(i);
    const output = keyboard.utilities.getUpdatedInput(char, "test");
    expect(output).toBe(`test${char}`);
  }
});

it('Keyboard updateCaretPos will work with minus', () => {
  setDOM();

  const keyboard = new Keyboard({
    syncInstanceInputs: true
  });

  keyboard.setCaretPosition(5);
  keyboard.utilities.updateCaretPos(2, true);

  expect(keyboard.caretPosition).toBe(3);
});

it('Keyboard updateCaretPos will work with minus', () => {
  setDOM();

  const keyboard = new Keyboard();

  keyboard.setCaretPosition(5);
  keyboard.utilities.updateCaretPos(2, true);

  expect(keyboard.caretPosition).toBe(3);
});

it('Keyboard updateCaretPos will work with plus', () => {
  setDOM();

  const keyboard = new Keyboard();

  keyboard.setCaretPosition(5);
  keyboard.utilities.updateCaretPos(2);

  expect(keyboard.caretPosition).toBe(7);
});

it('Keyboard addStringAt will work with debug', () => {
  setDOM();

  const keyboard = new Keyboard({
    debug: true
  });

  keyboard.getButtonElement("q").onclick();

  expect(keyboard.getInput()).toBe("q");
});

it('Keyboard addStringAt will work with position', () => {
  setDOM();

  const keyboard = new Keyboard({
    debug: true
  });

  keyboard.setInput("test");
  keyboard.setCaretPosition(5);

  keyboard.getButtonElement("q").onclick();

  expect(keyboard.getInput()).toBe("testq");
});

it('Keyboard addStringAt will respect maxLength', () => {
  setDOM();

  const keyboard = new Keyboard({
    debug: true,
    maxLength: 4
  });

  keyboard.setInput("test");

  keyboard.setCaretPosition(4);

  keyboard.utilities.handleMaxLength(keyboard.input, "testq")
  keyboard.utilities.addStringAt("test", "q", 4, 4);

  expect(keyboard.caretPosition).toBe(4);
});

it('Keyboard handleMaxLength will exit out on same updatedInput', () => {
  setDOM();

  const keyboard = new Keyboard({
    debug: true
  });

  keyboard.setInput("test");

  const output = keyboard.utilities.handleMaxLength(keyboard.input, "test")

  expect(output).toBeFalsy();
});

it('Keyboard handleMaxLength will work with object maxLength', () => {
  setDOM();

  const keyboard = new Keyboard({
    maxLength: {
      default: 4
    }
  });

  keyboard.setInput("test");
  
  const output = keyboard.utilities.handleMaxLength(keyboard.input, "testq");

  expect(output).toBeTruthy();
});

it('Keyboard handleMaxLength will work with object maxLength and debug', () => {
  setDOM();

  const keyboard = new Keyboard({
    maxLength: {
      default: 4
    },
    debug: true
  });

  keyboard.setInput("test");
  
  const output = keyboard.utilities.handleMaxLength(keyboard.input, "testq");

  expect(output).toBeTruthy();
});

it('Keyboard handleMaxLength will return false if obj maxLength not reached', () => {
  setDOM();

  const keyboard = new Keyboard({
    maxLength: {
      default: 7
    }
  });

  keyboard.setInput("test");
  
  const output = keyboard.utilities.handleMaxLength(keyboard.input, "testq");

  expect(output).toBeFalsy();
});


it('Keyboard handleMaxLength will work without debug', () => {
  setDOM();

  const keyboard = new Keyboard({
    maxLength: 4
  });

  keyboard.setInput("test");
  
  const output = keyboard.utilities.handleMaxLength(keyboard.input, "testq");

  expect(output).toBeTruthy();
});


it('Keyboard handleMaxLength will work with numeric maxLength', () => {
  setDOM();

  const keyboard = new Keyboard({
    maxLength: 3
  });

  keyboard.setInput("test");
  
  const output = keyboard.utilities.handleMaxLength(keyboard.input, "testq");

  expect(output).toBe(true);
});

it('Keyboard handleMaxLength wont work with non numeric or object maxLength', () => {
  setDOM();

  const keyboard = new Keyboard({
    maxLength: "wrong"
  });

  keyboard.setInput("test");
  
  const output = keyboard.utilities.handleMaxLength(keyboard.input, "testq");

  expect(output).toBeFalsy();
});

it('Keyboard handleMaxLength wont work with non numeric or object maxLength (with debug)', () => {
  setDOM();

  const keyboard = new Keyboard({
    maxLength: "wrong",
    debug: true
  });

  keyboard.setInput("test");
  
  const output = keyboard.utilities.handleMaxLength(keyboard.input, "testq");

  expect(output).toBeFalsy();
});

it('Keyboard isMaxLengthReached will work', () => {
  setDOM();

  const keyboard = new Keyboard({
    maxLength: 5
  });

  const output = keyboard.utilities.isMaxLengthReached();

  expect(output).toBeFalsy();
});

it('Keyboard removeAt will exit out on caretPosition:0', () => {
  setDOM();

  const keyboard = new Keyboard();

  keyboard.setInput("test");

  keyboard.setCaretPosition(0);
  keyboard.utilities.removeAt(keyboard.getInput(), 0);
  expect(keyboard.getInput()).toBe("test");

  keyboard.setInput("test");

  keyboard.setCaretPosition(5);
  keyboard.utilities.removeAt(keyboard.getInput(), 0, 0, true);
  expect(keyboard.caretPosition).toBe(5);
});

it('Keyboard removeAt will remove multi-byte unicodes with caretPos>0', () => {
  setDOM();

  const keyboard = new Keyboard();

  keyboard.setCaretPosition(6);
  let output = keyboard.utilities.removeAt("test\uD83D\uDE00", 6, 6);
  expect(output).toBe("test");

  keyboard.setCaretPosition(6);
  output = keyboard.utilities.removeAt("test\uD83D\uDE00", 6, 6, true);
  expect(keyboard.caretPosition).toBe(4);
});

it('Keyboard removeAt will not remove multi-byte unicodes with caretPos:0', () => {
  setDOM();

  const keyboard = new Keyboard();
  let output = keyboard.utilities.removeAt("\uD83D\uDE00");
  expect(output).toBeFalsy();

  output = keyboard.utilities.removeAt("\uD83D\uDE00", 0, 0, true);
  expect(output).toBe("\uD83D\uDE00");
});

it('Keyboard removeAt will propagate caretPosition', () => {
  clearDOM();

  document.body.innerHTML = `
    <div class="simple-keyboard"></div>
    <div class="keyboard2"></div>
  `;

  const keyboard = new Keyboard({ useMouseEvents: true });
  const keyboard2 = new Keyboard('.keyboard2');

  keyboard.input.default = "hello";
  keyboard2.input.default = "world"
  
  keyboard.setCaretPosition(1);
  expect(keyboard.getCaretPosition()).toBe(1);
  expect(keyboard.getCaretPositionEnd()).toBe(1);
  
  keyboard.setCaretPosition(1, 3);
  expect(keyboard.getCaretPosition()).toBe(1);
  expect(keyboard.getCaretPositionEnd()).toBe(3);

  keyboard.getButtonElement('{bksp}').onclick();
  
  expect(keyboard.getCaretPosition()).toBe(1);
  expect(keyboard2.getCaretPosition()).toBe(1);

  expect(keyboard.getInput()).toBe('hlo');
  expect(keyboard.getCaretPositionEnd()).toBe(1);
  expect(keyboard2.getCaretPositionEnd()).toBe(1);
});

it('Keyboard removeAt will propagate caretPosition in a syncInstanceInputs setting', () => {
  clearDOM();

  document.body.innerHTML = `
    <div class="simple-keyboard"></div>
    <div class="keyboard2"></div>
  `;

  const keyboard = new Keyboard({ useMouseEvents: true, syncInstanceInputs: true });
  const keyboard2 = new Keyboard('.keyboard2');

  keyboard.input.default = "hello"
  
  keyboard.setCaretPosition(1);
  expect(keyboard.getCaretPosition()).toBe(1);
  expect(keyboard.getCaretPositionEnd()).toBe(1);
  
  keyboard.setCaretPosition(1, 3);
  expect(keyboard.getCaretPosition()).toBe(1);
  expect(keyboard.getCaretPositionEnd()).toBe(3);

  keyboard.getButtonElement('{bksp}').onclick();
  
  expect(keyboard.getCaretPosition()).toBe(1);
  expect(keyboard2.getCaretPosition()).toBe(1);

  expect(keyboard.getInput()).toBe('hlo');
  expect(keyboard.getCaretPositionEnd()).toBe(1);
  expect(keyboard2.getCaretPositionEnd()).toBe(1);
});

it('Keyboard removeAt will remove regular strings', () => {
  setDOM();

  const keyboard = new Keyboard({
    debug: true
  });

  keyboard.setCaretPosition(6);
  let output = keyboard.utilities.removeAt("testie", 6, 6);
  expect(output).toBe("testi");

  keyboard.setCaretPosition(6);
  output = keyboard.utilities.removeAt("testie", 6, 6, true);
  expect(keyboard.caretPosition).toBe(5);
});

it('Keyboard removeAt will work with unset or start caretPosition', () => {
  setDOM();

  const keyboard = new Keyboard({
    debug: true
  });

  let output = keyboard.utilities.removeAt("test");
  expect(output).toBe("tes");

  output = keyboard.utilities.removeAt("test", null, null);
  expect(output).toBe("tes");

  output = keyboard.utilities.removeAt("😀", null, null);
  expect(output).toBe("");

  /**
   * Will also work with moveCaret
   */
  keyboard.setCaretPosition(3);
  output = keyboard.utilities.removeAt("test", null, null, true);
  expect(output).toBe("tes");
  expect(keyboard.getCaretPosition()).toBe(2);

  keyboard.setCaretPosition(2);
  output = keyboard.utilities.removeAt("😀", null, null, true);
  expect(output).toBe("");
  expect(keyboard.getCaretPosition()).toBe(0);
});

it('Keyboard will work with custom (and weird) class', () => {
  setDOM("my--weird--class");
  const keyboard = new Keyboard(".my--weird--class");
  expect(keyboard.keyboardDOMClass).toBe("my--weird--class");
});

it('Keyboard camelCase will work with empty strings', () => {
  setDOM();
  const keyboard = new Keyboard();
  expect(keyboard.utilities.camelCase()).toBeFalsy();
});

it('Keyboard removeForwardsAt will exit out on caretPosition:0', () => {
  setDOM();

  const keyboard = new Keyboard();

  keyboard.setInput("test");

  keyboard.setCaretPosition(0);
  keyboard.utilities.removeForwardsAt(keyboard.getInput(), 0);
  expect(keyboard.getInput()).toBe("test");

  keyboard.setInput("test");

  keyboard.setCaretPosition(5);
  keyboard.utilities.removeForwardsAt(keyboard.getInput(), 0, 0, true);
  expect(keyboard.caretPosition).toBe(5);
});

it('Keyboard removeForwardsAt will remove multi-byte unicodes with caretPos>0', () => {
  setDOM();

  const keyboard = new Keyboard();

  keyboard.setCaretPosition(4);
  let output = keyboard.utilities.removeForwardsAt("test\uD83D\uDE00", 4, 4);
  expect(output).toBe("test");

  keyboard.setCaretPosition(4);
  output = keyboard.utilities.removeForwardsAt("test\uD83D\uDE00", 4, 4, true);
  expect(keyboard.caretPosition).toBe(4);
});

it('Keyboard removeForwardsAt will not remove multi-byte unicodes with caretPos:0', () => {
  setDOM();

  const str = "\uD83D\uDE00";
  const keyboard = new Keyboard();
  let output = keyboard.utilities.removeForwardsAt(str, 0);
  expect(output).toBe("");

  output = keyboard.utilities.removeForwardsAt(str, 0, 0, true);
  expect(output).toBe("");
});

it('Keyboard removeForwardsAt will propagate caretPosition', () => {
  clearDOM();

  document.body.innerHTML = `
    <div class="simple-keyboard"></div>
    <div class="keyboard2"></div>
  `;

  const keyboard = new Keyboard({
    useMouseEvents: true,
    layout: {
      default: ["{delete}"]
    }
  });
  const keyboard2 = new Keyboard('.keyboard2');

  keyboard.input.default = "hello";
  keyboard2.input.default = "world"
  
  keyboard.setCaretPosition(1);
  expect(keyboard.getCaretPosition()).toBe(1);
  expect(keyboard.getCaretPositionEnd()).toBe(1);
  
  keyboard.setCaretPosition(1, 3);
  expect(keyboard.getCaretPosition()).toBe(1);
  expect(keyboard.getCaretPositionEnd()).toBe(3);

  keyboard.getButtonElement('{delete}').onclick();
  
  expect(keyboard.getCaretPosition()).toBe(1);
  expect(keyboard2.getCaretPosition()).toBe(1);

  expect(keyboard.getInput()).toBe('hlo');
  expect(keyboard.getCaretPositionEnd()).toBe(1);
  expect(keyboard2.getCaretPositionEnd()).toBe(1);
});

it('Keyboard removeForwardsAt will propagate caretPosition in a syncInstanceInputs setting', () => {
  clearDOM();

  document.body.innerHTML = `
    <div class="simple-keyboard"></div>
    <div class="keyboard2"></div>
  `;

  const keyboard = new Keyboard({
    useMouseEvents: true,
    syncInstanceInputs: true,
    layout: {
      default: ["{delete}"]
    }
  });
  const keyboard2 = new Keyboard('.keyboard2');

  keyboard.input.default = "hello"
  
  keyboard.setCaretPosition(1);
  expect(keyboard.getCaretPosition()).toBe(1);
  expect(keyboard.getCaretPositionEnd()).toBe(1);
  
  keyboard.setCaretPosition(1, 3);
  expect(keyboard.getCaretPosition()).toBe(1);
  expect(keyboard.getCaretPositionEnd()).toBe(3);

  keyboard.getButtonElement('{delete}').onclick();
  
  expect(keyboard.getCaretPosition()).toBe(1);
  expect(keyboard2.getCaretPosition()).toBe(1);

  expect(keyboard.getInput()).toBe('hlo');
  expect(keyboard.getCaretPositionEnd()).toBe(1);
  expect(keyboard2.getCaretPositionEnd()).toBe(1);
});

it('Keyboard removeForwardsAt will remove regular strings', () => {
  setDOM();

  const keyboard = new Keyboard({
    debug: true
  });

  keyboard.setCaretPosition(6);
  let output = keyboard.utilities.removeForwardsAt("testie", 5, 5);
  expect(output).toBe("testi");

  keyboard.setCaretPosition(5);
  output = keyboard.utilities.removeForwardsAt("testie", 5, 5, true);
  expect(keyboard.caretPosition).toBe(5);
});

it('Keyboard removeForwardsAt will work with unset or start caretPosition', () => {
  setDOM();

  const keyboard = new Keyboard({
    debug: true
  });

  let output = keyboard.utilities.removeForwardsAt("test", 3);
  expect(output).toBe("tes");

  output = keyboard.utilities.removeForwardsAt("test", null, null);
  expect(output).toBe("test");

  output = keyboard.utilities.removeForwardsAt("😀", 0);
  expect(output).toBe("");

  /**
   * Will also work with moveCaret
   */
  output = keyboard.utilities.removeForwardsAt("test", null, null, true);
  expect(output).toBe("test");
  expect(keyboard.getCaretPosition()).toBe(null);

  keyboard.setCaretPosition(2);
  const str = "😀";
  output = keyboard.utilities.removeForwardsAt(str, null, null, true);
  expect(output).toBe(str);
  expect(keyboard.getCaretPosition()).toBe(2);
});