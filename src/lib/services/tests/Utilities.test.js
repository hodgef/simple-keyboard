import Keyboard from '../../components/Keyboard';
import TestUtility from '../../../utils/TestUtility';

let testUtil = new TestUtility();

it('Keyboard mergeDisplay will work', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard({
    mergeDisplay: true,
    display: {
      "q": "qreplaced"
    }
  });
  
  expect(keyboard.getButtonElement("q").getAttribute("data-displaylabel")).toBe("qreplaced");
});

it('Keyboard function buttons will work', () => {
  testUtil.setDOM();

  new Keyboard();
  
  testUtil.testLayoutFctButtons((fctBtnCount, fctBtnHasOnclickCount) => {
    expect(fctBtnCount).toBe(fctBtnHasOnclickCount);
  });
});

it('Keyboard {bksp} button will work', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard();

  let output = keyboard.utilities.getUpdatedInput("{bksp}", "test", keyboard.options);
  
  expect(output).toBe("tes");
});

it('Keyboard {space} button will work', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard();

  let output = keyboard.utilities.getUpdatedInput("{space}", "test", keyboard.options);
  
  expect(output).toBe("test ");
});

it('Keyboard {tab} button will work', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard();

  let output = keyboard.utilities.getUpdatedInput("{tab}", "test", keyboard.options);
  
  expect(output).toBe("test\t");
});

it('Keyboard {tab} button will work with tabCharOnTab:false', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard({
    tabCharOnTab: false
  });

  let output = keyboard.utilities.getUpdatedInput("{tab}", "test", keyboard.options);
  
  expect(output).toBe("test");
});

it('Keyboard {enter} button will work', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard();

  let output = keyboard.utilities.getUpdatedInput("{enter}", "test", keyboard.options);
  
  expect(output).toBe("test");
});

it('Keyboard {enter} button will work with newLineOnEnter:true', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard({
    newLineOnEnter: true
  });

  let output = keyboard.utilities.getUpdatedInput("{enter}", "test", keyboard.options);
  
  expect(output).toBe("test\n");
});

it('Keyboard {numpadX} buttons will work', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard();

  for(let i = 0;i<=9;i++){
    let output = keyboard.utilities.getUpdatedInput(`{numpad${i}}`, "test", keyboard.options);
    expect(output).toBe(`test${i}`);
  }
});

it('Keyboard {numpaddivide} button will work', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard();

  let output = keyboard.utilities.getUpdatedInput("{numpaddivide}", "test", keyboard.options);
  
  expect(output).toBe("test/");
});

it('Keyboard {numpadmultiply} button will work', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard();

  let output = keyboard.utilities.getUpdatedInput("{numpadmultiply}", "test", keyboard.options);
  
  expect(output).toBe("test*");
});

it('Keyboard {numpadsubtract} button will work', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard();

  let output = keyboard.utilities.getUpdatedInput("{numpadsubtract}", "test", keyboard.options);
  
  expect(output).toBe("test-");
});

it('Keyboard {numpadadd} button will work', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard();

  let output = keyboard.utilities.getUpdatedInput("{numpadadd}", "test", keyboard.options);
  
  expect(output).toBe("test+");
});

it('Keyboard {numpadadd} button will work', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard();

  let output = keyboard.utilities.getUpdatedInput("{numpadadd}", "test", keyboard.options);
  
  expect(output).toBe("test+");
});

it('Keyboard {numpaddecimal} button will work', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard();

  let output = keyboard.utilities.getUpdatedInput("{numpaddecimal}", "test", keyboard.options);
  
  expect(output).toBe("test.");
});

it('Keyboard custom function buttons will work', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard({
    layout: {
      default: [
        "{randombuttontest}"
      ]
    }
  });

  let output = keyboard.utilities.getUpdatedInput("{randombuttontest}", "test", keyboard.options);
  
  expect(output).toBe("test");
  expect(keyboard.getButtonElement("{randombuttontest}").onclick).toBeTruthy();
});

it('Keyboard "{" button will work', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard();

  let output = keyboard.utilities.getUpdatedInput("{", "test", keyboard.options);
  
  expect(output).toBe("test{");
});

it('Keyboard "}" button will work', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard();

  let output = keyboard.utilities.getUpdatedInput("}", "test", keyboard.options);
  
  expect(output).toBe("test}");
});

it('Keyboard standard button will affect input', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard();

  for (let i = 65; i <= 90; i++) {
    let char = String.fromCharCode(i);
    let output = keyboard.utilities.getUpdatedInput(char, "test", keyboard.options);
    expect(output).toBe(`test${char}`);
  }
});

it('Keyboard updateCaretPos will work with minus', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard();
  keyboard.options.syncInstanceInputs = true;

  keyboard.caretPosition = 5;
  keyboard.utilities.updateCaretPos(2, true);

  expect(keyboard.caretPosition).toBe(3);
});

it('Keyboard updateCaretPos will work with minus', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard();

  keyboard.caretPosition = 5;
  keyboard.utilities.updateCaretPos(2, true);

  expect(keyboard.caretPosition).toBe(3);
});

it('Keyboard updateCaretPos will work with plus', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard();

  keyboard.caretPosition = 5;
  keyboard.utilities.updateCaretPos(2);

  expect(keyboard.caretPosition).toBe(7);
});

it('Keyboard addStringAt will work with debug', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard({
    debug: true
  });

  keyboard.getButtonElement("q").onclick();

  expect(keyboard.getInput()).toBe("q");
});

it('Keyboard addStringAt will work with position', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard({
    debug: true
  });

  keyboard.setInput("test");
  keyboard.caretPosition = 4;

  keyboard.getButtonElement("q").onclick();

  expect(keyboard.getInput()).toBe("testq");
});

it('Keyboard addStringAt will respect maxLength', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard({
    debug: true,
    maxLength: 4
  });

  keyboard.setInput("test");
  keyboard.caretPosition = 4;

  keyboard.utilities.handleMaxLength(keyboard.input, keyboard.options, "testq")
  keyboard.utilities.addStringAt("test", "q", 4);

  expect(keyboard.caretPosition).toBe(4);
});

it('Keyboard handleMaxLength will exit out on same updatedInput', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard({
    debug: true
  });

  keyboard.setInput("test");

  let output = keyboard.utilities.handleMaxLength(keyboard.input, keyboard.options, "test")

  expect(output).toBeFalsy();
});

it('Keyboard handleMaxLength will work with object maxLength', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard({
    maxLength: {
      default: 4
    }
  });

  keyboard.setInput("test");
  
  let output = keyboard.utilities.handleMaxLength(keyboard.input, keyboard.options, "testq");

  expect(output).toBeTruthy();
});

it('Keyboard handleMaxLength will work with object maxLength and debug', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard({
    maxLength: {
      default: 4
    },
    debug: true
  });

  keyboard.setInput("test");
  
  let output = keyboard.utilities.handleMaxLength(keyboard.input, keyboard.options, "testq");

  expect(output).toBeTruthy();
});

it('Keyboard handleMaxLength will return false if obj maxLength not reached', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard({
    maxLength: {
      default: 7
    }
  });

  keyboard.setInput("test");
  
  let output = keyboard.utilities.handleMaxLength(keyboard.input, keyboard.options, "testq");

  expect(output).toBeFalsy();
});


it('Keyboard handleMaxLength will work without debug', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard({
    maxLength: 4
  });

  keyboard.setInput("test");
  
  let output = keyboard.utilities.handleMaxLength(keyboard.input, keyboard.options, "testq");

  expect(output).toBeTruthy();
});


it('Keyboard handleMaxLength will work with numeric maxLength', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard({
    maxLength: 3
  });

  keyboard.setInput("test");
  
  let output = keyboard.utilities.handleMaxLength(keyboard.input, keyboard.options, "testq");

  expect(output).toBeFalsy();
});

it('Keyboard handleMaxLength wont work with non numeric or object maxLength', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard({
    maxLength: "wrong"
  });

  keyboard.setInput("test");
  
  let output = keyboard.utilities.handleMaxLength(keyboard.input, keyboard.options, "testq");

  expect(output).toBeFalsy();
});

it('Keyboard handleMaxLength wont work with non numeric or object maxLength (with debug)', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard({
    maxLength: "wrong",
    debug: true
  });

  keyboard.setInput("test");
  
  let output = keyboard.utilities.handleMaxLength(keyboard.input, keyboard.options, "testq");

  expect(output).toBeFalsy();
});

it('Keyboard isMaxLengthReached will work', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard({
    maxLength: 5
  });

  let output = keyboard.utilities.isMaxLengthReached();

  expect(output).toBeFalsy();
});

it('Keyboard removeAt will exit out on caretPosition:0', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard();

  keyboard.setInput("test");
  keyboard.caretPosition = 0;
  keyboard.utilities.removeAt(keyboard.getInput(), 0);
  expect(keyboard.getInput()).toBe("test");

  keyboard.setInput("test");
  keyboard.caretPosition = 5;
  keyboard.utilities.removeAt(keyboard.getInput(), 0, true);
  expect(keyboard.caretPosition).toBe(4);
});

it('Keyboard removeAt will remove multi-byte unicodes with caretPos>0', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard();

  keyboard.caretPosition = 6;
  let output = keyboard.utilities.removeAt("test\uD83D\uDE00", 6);
  expect(output).toBe("test");

  keyboard.caretPosition = 6;
  output = keyboard.utilities.removeAt("test\uD83D\uDE00", 6, true);
  expect(keyboard.caretPosition).toBe(4);
});

it('Keyboard removeAt will not remove multi-byte unicodes with caretPos:0', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard();
  let output = keyboard.utilities.removeAt("\uD83D\uDE00");
  expect(output).toBeFalsy();

  output = keyboard.utilities.removeAt("\uD83D\uDE00", 0,  true);
  expect(output).toBeFalsy();
});

it('Keyboard removeAt will remove regular strings', () => {
  testUtil.setDOM();

  let keyboard = new Keyboard({
    debug: true
  });

  keyboard.caretPosition = 6;
  let output = keyboard.utilities.removeAt("testie", 6);
  expect(output).toBe("testi");

  keyboard.caretPosition = 6;
  output = keyboard.utilities.removeAt("testie", 6, true);
  expect(keyboard.caretPosition).toBe(5);
});

it('Keyboard will work with custom (and weird) class', () => {
  testUtil.setDOM("my--weird--class");
  let keyboard = new Keyboard(".my--weird--class");
  expect(keyboard.keyboardDOMClass).toBe("my--weird--class");
});