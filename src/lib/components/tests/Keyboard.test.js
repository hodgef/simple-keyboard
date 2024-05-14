import Keyboard from '../Keyboard';
import { setDOM, clearDOM, testLayoutStdButtons, triggerDocumentPointerUp } from '../../../utils/TestUtility';

beforeEach(() => {
  setDOM();
});

afterEach(() => {
  clearDOM();
});

it('Keyboard will not render without target element', () => {
  clearDOM();
  
  try {
    new Keyboard();
    expect(true).toBe(false);
  } catch (e) {
    expect(e.message).toBe("KEYBOARD_DOM_ERROR");
  }
});

describe('When window is undefined', () => {
  const { window } = global;
  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete global.window;
  });
  afterAll(() => {
    global.window = window;
  });
  
  it('Keyboard will return early if window is undefined', () => {
    const keyboard = new Keyboard();
    expect(keyboard.initialized).toBeUndefined();
  });
});

it('Keyboard will run without options', () => {
  // No options
  new Keyboard();
});

it('Keyboard will run with empty options', () => {
  // No options
  new Keyboard({});
});

it('Keyboard will run with custom DOM target', () => {
  setDOM("myTestDiv");

  new Keyboard(".myTestDiv");
  expect(document.body.querySelector(".myTestDiv")).toBeDefined();
});

it('Keyboard will run with debug option set', () => {
  setDOM();
  
  const keyboard = new Keyboard({
    debug: true
  });

  expect(keyboard.options.debug).toBeTruthy();
});

it('Keyboard will use touch events', () => {
  let touched = false

  clearDOM();

  document.body.innerHTML = `
    <div class="keyboard"></div>
  `;

  const keyboard = new Keyboard('.keyboard', {
    useTouchEvents: true,
    onChange: () => touched = true,
    layout: {
      default: ["q"]
    }
  });

  keyboard.getButtonElement("q").ontouchstart();
  keyboard.getButtonElement("q").ontouchend();
  keyboard.getButtonElement("q").ontouchcancel();
  
  expect(keyboard.options.useTouchEvents).toBeTruthy();
  expect(touched).toBeTruthy();
  expect(keyboard.getInput()).toBe('q');
})

it('Keyboard standard buttons will work', () => {
  setDOM();
  const keyboard = new Keyboard({
    maxLength: {
      "default": 10
    }
  });
  
  testLayoutStdButtons(keyboard);
});


it('Keyboard shift buttons will work', () => {
  setDOM();
  const keyboard = new Keyboard();

  keyboard.setOptions({
    layoutName: "shift",
    maxLength: 42
  });

  testLayoutStdButtons(keyboard);
});

it('Keyboard setOptions will work without a param', () => {
  setDOM();
  const keyboard = new Keyboard();

  keyboard.setOptions();
});

it('Keyboard empty buttons wont do anything as expected', () => {
    const keyboard = new Keyboard({
    layout: {
      default: [
        "{//} {button} d",
        "a b c d e f g h i j",
      ]
    }
  });

  keyboard.getButtonElement("{//}").onclick();
});

it('Keyboard onKeyPress will work', () => {
    let pressed = false;

  const keyboard = new Keyboard({
    onKeyPress: () => {
      pressed = true;
    },
    debug: true
  });

  keyboard.getButtonElement("q").onclick();

  expect(pressed).toBeTruthy();
});

it('Keyboard standard function buttons will not change input', () => {
    const keyboard = new Keyboard({
    useButtonTag: true
  });

  keyboard.recurseButtons((button) => {
    if(button.getAttribute("data-skbtn") === "{shift}"){
      button.onclick();
    }
  });

  expect(keyboard.getInput()).toBeFalsy();
});

it('Keyboard syncInstanceInputs will work', () => {
  clearDOM();

  document.body.innerHTML = `
    <div class="keyboard1"></div>
    <div class="keyboard2"></div>
  `;

  const sharedOptions = {
    syncInstanceInputs: true
  };

  let keyboard1 = new Keyboard(".keyboard1", sharedOptions);
  let keyboard2 = new Keyboard(".keyboard2", sharedOptions);

  keyboard1.getButtonElement("q").onclick();

  expect(keyboard2.getInput()).toBe("q");

  /**
   * Test cursor syncing...
   * Reinit keyboards
   */
  keyboard1 = new Keyboard(".keyboard1", sharedOptions);
  keyboard2 = new Keyboard(".keyboard2", sharedOptions);

  keyboard1.getButtonElement("1").onclick();
  keyboard1.getButtonElement("5").onclick();
  keyboard1.getButtonElement("6").onclick();

  keyboard1.setCaretPosition(1);

  keyboard1.getButtonElement("2").onclick();
  keyboard1.getButtonElement("3").onclick();
  keyboard1.getButtonElement("4").onclick();

  expect(keyboard1.getInput()).toBe("123456");
  expect(keyboard2.getInput()).toBe("123456");
});

it('Keyboard onChange will work', () => {
    let output = false;

  const keyboard = new Keyboard({
    onChange: (input) => {
      output = input;
    },
    useMouseEvents: true
  });

  keyboard.getButtonElement("q").onclick();

  expect(output).toBe("q");
});

it('Keyboard beforeInputChange will work', () => {
  const mockBeforeInputUpdate = jest.fn();
  
  const keyboard = new Keyboard({
    beforeInputUpdate: mockBeforeInputUpdate,
    useMouseEvents: true
  });

  keyboard.getButtonElement("q").onclick();

  expect(mockBeforeInputUpdate).toHaveBeenCalledWith(keyboard);
});

it('Keyboard onChangeAll will work', () => {
    let output;

  const keyboard = new Keyboard({
    onChangeAll: (input) => {
      output = input ? input.default : null;
    },
    useMouseEvents: true
  });

  keyboard.getButtonElement("q").onclick();

  expect(output).toBe("q");
});

it('Keyboard clearInput will work', () => {
    const keyboard = new Keyboard();

  /**
   * Avoid setInput for this test
   */
  keyboard.input = {
    "default": "hello"
  };

  keyboard.clearInput();

  expect(keyboard.getInput()).toBeFalsy();
});

it('Keyboard clearInput will work with syncInstanceInputs', () => {
  clearDOM();

  document.body.innerHTML = `
    <div class="keyboard1"></div>
    <div class="keyboard2"></div>
  `;

  const sharedOptions = {
    syncInstanceInputs: true
  };

  const keyboard1 = new Keyboard(".keyboard1", sharedOptions);
  const keyboard2 = new Keyboard(".keyboard2", sharedOptions);

  /**
   * Avoid setInput for this test
   */
  keyboard1.input = {
    "default": "hello"
  };

  keyboard2.clearInput();

  expect(keyboard1.getInput()).toBeFalsy();
});

it('Keyboard setInput will work', () => {
    const keyboard = new Keyboard();

  keyboard.setInput("hello");

  expect(keyboard.getInput()).toBe("hello");
});

it('Keyboard setInput will work with syncInstanceInputs', () => {
  clearDOM();

  document.body.innerHTML = `
    <div class="keyboard1"></div>
    <div class="keyboard2"></div>
  `;

  const sharedOptions = {
    syncInstanceInputs: true
  };

  const keyboard1 = new Keyboard(".keyboard1", sharedOptions);
  const keyboard2 = new Keyboard(".keyboard2", sharedOptions);

  keyboard1.setInput("hello");

  expect(keyboard2.getInput()).toBe("hello");
});

it('Keyboard dispatch will work', () => {
    document.body.innerHTML = `
    <div class="keyboard1"></div>
    <div class="keyboard2"></div>
  `;

  const keyboard1 = new Keyboard(".keyboard1");
  const keyboard2 = new Keyboard(".keyboard2");

  keyboard1.dispatch(instance => {
    instance.setOptions({
      buttonTheme: [
        {
          class: "myCustomClass",
          buttons: "Q"
        }
      ]
    })
  });

  expect(keyboard2.options.buttonTheme[0].class).toBe("myCustomClass");
});

it('Keyboard dispatch will not work without SimpleKeyboardInstances', () => {
    document.body.innerHTML = `
    <div class="keyboard1"></div>
    <div class="keyboard2"></div>
  `;

  const keyboard1 = new Keyboard(".keyboard1");
  new Keyboard(".keyboard2");

  window['SimpleKeyboardInstances'] = null;

  try {
    keyboard1.dispatch(instance => {
      instance.setOptions({
        buttonTheme: [
          {
            class: "myCustomClass",
            buttons: "Q"
          }
        ]
      })
    });

    expect(true).toBe(false);
  } catch (e) {
    expect(e.message).toBe("INSTANCES_VAR_ERROR");
  }
});

it('Keyboard addButtonTheme will work', () => {
    const keyboard = new Keyboard();
  keyboard.addButtonTheme("q", "test");

  expect(keyboard.options.buttonTheme[0].class).toBe("test");
});

it('Keyboard addButtonTheme will not work without params', () => {
    const keyboard = new Keyboard();
  const returnVal = keyboard.addButtonTheme();

  expect(returnVal).toBeFalsy();
});

it('Keyboard addButtonTheme will amend a buttonTheme', () => {
    const keyboard = new Keyboard({
    buttonTheme: [
      {
        class: "test",
        buttons: "s"
      }
    ]
  });

  keyboard.addButtonTheme("q", "test");

  expect(keyboard.options.buttonTheme[0].class).toBe("test");
});

it('Keyboard addButtonTheme will create a buttonTheme', () => {
    const keyboard = new Keyboard({
    buttonTheme: [
      {
        class: "blurb",
        buttons: "s"
      }
    ]
  });

  keyboard.addButtonTheme("q", "test");

  expect(keyboard.options.buttonTheme[1].class).toBe("test");
});

it('Keyboard addButtonTheme will ignore a repeated buttonTheme', () => {
    const keyboard = new Keyboard({
    buttonTheme: [
      {
        class: "test",
        buttons: "s a"
      }
    ]
  });

  keyboard.addButtonTheme("a", "test");

  expect(keyboard.options.buttonTheme[0].buttons).toBe("s a");
});

it('Keyboard addButtonTheme will amend a buttonTheme', () => {
    const keyboard = new Keyboard({
    buttonTheme: [
      {
        class: "test",
        buttons: "s"
      }
    ]
  });

  keyboard.addButtonTheme("q", "test");

  expect(keyboard.options.buttonTheme[0].buttons).toBe("s q");
});


it('Keyboard removeButtonTheme without params will remove all button themes', () => {
    const keyboard = new Keyboard({
    buttonTheme: [
      {
        class: "test",
        buttons: "s"
      }
    ]
  });

  keyboard.removeButtonTheme();

  expect(keyboard.options.buttonTheme.length).toBe(0);
});


it('Keyboard removeButtonTheme will work', () => {
    const keyboard = new Keyboard({
    buttonTheme: [
      {
        class: "test",
        buttons: "s"
      }
    ]
  });

  keyboard.removeButtonTheme("s", "test");

  expect(keyboard.options.buttonTheme.length).toBe(0);
});

it('Keyboard removeButtonTheme will work wihtout a class', () => {
    const keyboard = new Keyboard({
    buttonTheme: [
      {
        class: "test",
        buttons: "s"
      }
    ]
  });

  keyboard.removeButtonTheme("s");

  expect(keyboard.options.buttonTheme.length).toBe(0);
});

it('Keyboard removeButtonTheme will do nothing without a button param', () => {
    const keyboard = new Keyboard({
    buttonTheme: [
      {
        class: "test",
        buttons: "s"
      }
    ]
  });

  keyboard.removeButtonTheme(null, "test");

  expect(keyboard.options.buttonTheme.length).toBe(1);
});

it('Keyboard removeButtonTheme does nothing if req button doesnt have a buttonTheme', () => {
    const keyboard = new Keyboard({
    buttonTheme: [
      {
        class: "test",
        buttons: "a"
      }
    ]
  });

  keyboard.removeButtonTheme("s", "test");

  expect(keyboard.options.buttonTheme.length).toBe(1);
});

it('Keyboard removeButtonTheme does nothing if buttonTheme class does not exist', () => {
    const keyboard = new Keyboard({
    buttonTheme: [
      {
        class: "testy",
        buttons: "a"
      }
    ]
  });

  keyboard.removeButtonTheme("a", "test");

  expect(keyboard.options.buttonTheme.length).toBe(1);
});

it('Keyboard removeButtonTheme does nothing if buttonTheme doesnt have the requested buttons', () => {
    const keyboard = new Keyboard({
    buttonTheme: [
      {
        class: "test",
        buttons: "a b c d e f"
      }
    ]
  });

  keyboard.removeButtonTheme("g", "test");

  expect(keyboard.options.buttonTheme[0].buttons).toBe("a b c d e f");
});

it('Keyboard getButtonElement will not return anything if empty match', () => {
    const keyboard = new Keyboard({
    layout: {
      default: [
        "{//} {button} d",
        "a b c d e f g h i j",
      ]
    }
  });

  expect(keyboard.getButtonElement("{waldo}")).toBeFalsy();
});

it('Keyboard getButtonElement will return multiple matched buttons', () => {
    const keyboard = new Keyboard();

  expect(keyboard.getButtonElement("{shift}").length).toBe(2);
});

it('Keyboard will receive physical keyboard events', () => {
    new Keyboard({
    debug: true,
    physicalKeyboardHighlight: true
  });

  document.dispatchEvent(new KeyboardEvent('keyup', {
    charCode: 0,
    code: "KeyF",
    key: "f",
    which: 70,
    target: {
      tagName: "input"
    }
  }));
});

it('Keyboard caretEventHandler will detect input, textarea focus', () => {
    const keyboard = new Keyboard();
  const myInput = document.createElement('input');

  keyboard.caretEventHandler({
    charCode: 0,
    code: "KeyF",
    key: "f",
    which: 70,
    target: myInput
  });

  expect(keyboard.getCaretPosition()).toBe(0);
});

it('Keyboard caretEventHandler will not set caretPosition on disableCaretPositioning', () => {
    const keyboard = new Keyboard();
  const myInput = document.createElement('input');

  keyboard.caretEventHandler({
    charCode: 0,
    code: "KeyF",
    key: "f",
    which: 70,
    target: myInput
  });

  expect(keyboard.getCaretPosition()).toBe(0);

  keyboard.setOptions({
    disableCaretPositioning: true
  });

  keyboard.caretEventHandler({
    charCode: 0,
    code: "KeyF",
    key: "f",
    which: 70,
    target: myInput
  });

  expect(keyboard.getCaretPosition()).toBe(null);
});

it('Keyboard caretEventHandler ignore positioning if input, textarea is blur', () => {
    const keyboard = new Keyboard();

  keyboard.isMouseHold = true;

  keyboard.caretEventHandler({
    charCode: 0,
    code: "KeyF",
    key: "f",
    which: 70,
    target: document.createElement('div')
  });

  expect(keyboard.getCaretPosition()).toBeFalsy();
});

it('Keyboard caretEventHandler will work with debug', () => {
    const keyboard = new Keyboard({
    debug: true
  });

  keyboard.input.default = "hello";
  keyboard.setCaretPosition(2)

  expect(keyboard.getCaretPosition()).toBe(2);

  const myInput = document.createElement('input');

  keyboard.caretEventHandler({
    charCode: 0,
    code: "KeyF",
    key: "f",
    which: 70,
    target: myInput
  });

  expect(keyboard.getCaretPosition()).toBe(0);
});

it('Keyboard onInit will work', () => {
    let passed = false;

  new Keyboard({
    onInit: () => {
      passed = true
    }
  });

  expect(passed).toBeTruthy();
});

it('Keyboard onRender will work', () => {
    let passed = false;

  new Keyboard({
    onRender: () => {
      passed = true
    }
  });

  expect(passed).toBeTruthy();
});

it('Keyboard buttonTheme that is invalid will be ignored and not throw', () => {
    new Keyboard({
    buttonTheme: [
      {
        class: null,
        buttons: null
      }
    ]
  });
});

it('Keyboard buttonTheme buttons that are invalid will be ignored and not throw', () => {
    new Keyboard({
    buttonTheme: [
      {
        class: null,
        buttons: undefined
      }
    ]
  });
});

it('Keyboard buttonTheme will be ignored if buttons param not a string', () => {
    new Keyboard({
    buttonTheme: [
      {
        class: "test",
        buttons: {
          wrong: true
        }
      }
    ]
  });
});

it('Keyboard buttonTheme will be ignored if already added', () => {
    new Keyboard({
    buttonTheme: [
      {
        class: "test",
        buttons: "a b c"
      },
      {
        class: "test",
        buttons: "c"
      },
      {
        class: "anotherclass",
        buttons: "c"
      },
      {
        class: "yetAnotherclass",
        buttons: "c"
      },
      {
        class: "anotherclass",
        buttons: "c"
      },
    ]
  });
});

it('Keyboard can set a module', () => {
    const keyboard = new Keyboard();

  keyboard.registerModule(
    "test",
    (module) => {
      module.foo = "bar";
    }
  );

  expect(keyboard.getModuleProp("test", "foo")).toBe("bar");
});

it('Keyboard registerModule will return current module tree', () => {
    const keyboard = new Keyboard();

  keyboard.modules.test = {
    testy: "test"
  };

  keyboard.registerModule(
    "test",
    (module) => {
      module.foo = "bar";
    }
  );

  expect(keyboard.getModuleProp("test", "testy")).toBe("test");
  expect(keyboard.getModuleProp("test", "foo")).toBe("bar");
});

it('Keyboard can set a module by amending the modules tree', () => {
    const keyboard = new Keyboard();

  keyboard.modules = {
    testman: {
      foo: "baz"
    }
  };

  keyboard.registerModule(
    "test",
    (module) => {
      module.foo = "bar";
    }
  );

  expect(keyboard.getModuleProp("test", "foo")).toBe("bar");
});

it('Keyboard will not retrieve an option for an inexistent module', () => {
    const keyboard = new Keyboard();

  expect(keyboard.getModuleProp("test", "foo")).toBeFalsy();
});

it('Keyboard will get a list of modules', () => {
    const keyboard = new Keyboard();

  keyboard.registerModule(
    "test",
    (module) => {
      module.foo = "bar";
    }
  );

  expect(keyboard.getModulesList()[0]).toBe("test");
});

it('Keyboard loadModules will load a simple module', () => {
    class myClass {
    init = (module) => {
      module.foo = "bar";
    };
  }

  new Keyboard({
    modules: [
      myClass
    ]
  });  
});

it('Keyboard handleButtonMouseUp will set isMouseHold to false', () => {
    const keyboard = new Keyboard();

  keyboard.isMouseHold = true;

  document.onmouseup({
    target: document.body
  });

  expect(keyboard.isMouseHold).toBeFalsy();
});

it('Keyboard handleButtonMouseUp clear holdInteractionTimeout', () => {
    const keyboard = new Keyboard();

  keyboard.isMouseHold = true;
  keyboard.holdInteractionTimeout = setTimeout(() => {}, 10000);

  document.onmouseup({
    target: document.body
  });
});

it('Keyboard handleButtonMouseDown will work', () => {
    const keyboard = new Keyboard({ useMouseEvents: true });

  console.log(keyboard.getButtonElement("q"))
  keyboard.getButtonElement("q").onclick();

  document.onmouseup({
    target: document.body
  });

});

it('Keyboard handleButtonMouseDown will work with preventMouseDownDefault', () => {
    const keyboard = new Keyboard({
    preventMouseDownDefault: true,
    stopMouseDownPropagation: true
  });
  let called = false;
  let called2 = false;

  keyboard.options.preventMouseDownDefault = true;

  keyboard.handleButtonMouseDown("q", {
    target: keyboard.getButtonElement("q"),
    preventDefault: () => {
      called = true;
    },
    stopPropagation: () => {
      called2 = true;
    }
  });

  keyboard.getButtonElement("q").onclick();
  document.onmouseup({
    target: document.body
  });

  expect(called).toBe(true);
  expect(called2).toBe(true);
});

it('Keyboard handleButtonMouseUp will work with preventMouseUpDefault and stopMouseUpPropagation', () => {
    const keyboard = new Keyboard({
    preventMouseUpDefault: true,
    stopMouseUpPropagation: true
  });
  let called = false;
  let called2 = false;

  keyboard.handleButtonMouseUp("q", {
    target: keyboard.getButtonElement("q"),
    preventDefault: () => {
      called = true
    },
    stopPropagation: () => {
      called2 = true;
    }
  });

  keyboard.getButtonElement("q").onclick();
  document.onmouseup({
    target: document.body
  });

  expect(called).toBe(true);
  expect(called2).toBe(true);
});

it('Keyboard onModulesLoaded will work', () => {
    class myClass {
    init = (module) => {
      module.foo = "bar";
    };
  }

  let foo;

  new Keyboard({
    modules: [
      myClass
    ],
    onModulesLoaded: () => {
      foo = "bar";
    }
  });

  expect(foo).toBe("bar");
});

it('Keyboard inputPattern will work globally', () => {
    const keyboard = new Keyboard({
    inputPattern: /^\d+$/,
    useMouseEvents: true
  });

  keyboard.getButtonElement("q").onclick();

  expect(keyboard.getInput()).toBeFalsy();

  keyboard.getButtonElement("1").onclick();

  expect(keyboard.getInput()).toBe("1");
});

it('Keyboard inputPattern will work by input name', () => {
    const keyboard = new Keyboard({
    debug: true,
    inputName: "test1",
    inputPattern: {
      test1: /^\d+$/
    },
    useMouseEvents: true
  });

  keyboard.getButtonElement("q").onclick();
  keyboard.getButtonElement("1").onclick();

  expect(keyboard.getInput()).toBe("1");

  keyboard.setOptions({
    inputName: "default"
  });

  keyboard.getButtonElement("q").onclick();
  keyboard.getButtonElement("1").onclick();

  expect(keyboard.getInput()).toBe("q1");
});

it('Keyboard processAutoTouchEvents will work', () => {
    navigator.maxTouchPoints = true;

  const keyboard = new Keyboard({
    autoUseTouchEvents: true
  });

  expect(keyboard.options.useTouchEvents).toBeTruthy();
});

it('Keyboard processAutoTouchEvents will work with debugging enabled', () => {
    navigator.maxTouchPoints = true;

  const keyboard = new Keyboard({
    autoUseTouchEvents: true,
    debug: true
  });

  expect(keyboard.options.useTouchEvents).toBeTruthy();
});

it('Keyboard beforeFirstRender method will work', () => {
    let timesCalled = 0;

  const keyboard = new Keyboard({
    beforeFirstRender: () => {
      timesCalled++;
    }
  });

  /**
   * Triggering another render
   */
  keyboard.setOptions({
    layoutName: "shift"
  });

  expect(timesCalled).toBe(1);
});

it('Keyboard beforeFirstRender will show PointerEvents warning', () => {
    let timesCalled = 0;

  window.PointerEvent = window.PointerEvent ? window.PointerEvent : () => {};

  new Keyboard({
    debug: true,
    beforeFirstRender: () => {
      timesCalled++;
    }
  });

  expect(timesCalled).toBe(1);
});

it('Keyboard beforeRender method will work', () => {
    let timesCalled = 0;

  const keyboard = new Keyboard({
    beforeRender: () => {
      timesCalled++;
    }
  });

  /**
   * Triggering another render
   */
  keyboard.setOptions({
    layoutName: "shift"
  });

  expect(timesCalled).toBe(2);
});

it('Keyboard parseRowDOMContainers will work', () => {
    const keyboard = new Keyboard({
    layout: {
      'default': [
        '` [1 2 3 4 5 6 7 8 9] 0 - = {bksp}',
        '{tab} q w e r t y u [i o p] [ ] \\',
        '{lock} [a s d] f g h j k l ; \' {enter}',
        '{shift} z x c v b n m , . / {shift}',
        '[.com @] {space} {arrowleft} [{arrowup} {arrowdown}] {arrowright}'
      ],
      'shift': [
        '~ ! @ # $ % ^ & * ( ) _ + {bksp}',
        '{tab} [Q W E R T] Y U I O P { } |',
        '{lock} A S D F G H J K L : " {enter}',
        '{shift} Z X C V [B N M <] > ? {shift}',
        '.com @ {space}'
      ]
    }
  });

  const containers = Array.from(document.querySelectorAll(".hg-button-container"));

  expect(containers.length).toBe(5);

  keyboard.setOptions({
    debug: true
  });

  expect(containers.length).toBe(5);
});

it('Keyboard parseRowDOMContainers will ignore empty rows', () => {
    let failed = false;

  try {
    const keyboard = new Keyboard();
    keyboard.parseRowDOMContainers({
      children: []
    });
  } catch (e) {
    failed = true;
  }

  expect(failed).toBeFalsy();
});


it('Keyboard parseRowDOMContainers will ignore missing endIndex or endIndex before startIndex', () => {
    new Keyboard({
    layout: {
      'default': [
        '` [1 2 3 4 5 6 7 8 9 0 - = {bksp}',
        '` 1 2 3] 4 5 6 7 8 9 [0 - = {bksp}',
      ]
    }
  });

  const containers = Array.from(document.querySelectorAll(".hg-button-container"));

  expect(containers.length).toBe(0);
});

it('Keyboard disableRowButtonContainers will bypass parseRowDOMContainers', () => {
    new Keyboard({
    disableRowButtonContainers: true,
    layout: {
      'default': [
        '` [1 2 3 4 5 6 7 8 9] 0 - = {bksp}',
        '{tab} q w e r t y u [i o p] [ ] \\',
        '{lock} [a s d] f g h j k l ; \' {enter}',
        '{shift} z x c v b n m , . / {shift}',
        '[.com @] {space} {arrowleft} [{arrowup} {arrowdown}] {arrowright}'
      ],
      'shift': [
        '~ ! @ # $ % ^ & * ( ) _ + {bksp}',
        '{tab} [Q W E R T] Y U I O P { } |',
        '{lock} A S D F G H J K L : " {enter}',
        '{shift} Z X C V [B N M <] > ? {shift}',
        '.com @ {space}'
      ]
    }
  });

  const containers = Array.from(document.querySelectorAll(".hg-button-container"));

  expect(containers.length).toBe(0);
});

it('Keyboard destroy will work', () => {
    const keyboard = new Keyboard();
  keyboard.destroy();
  expect(keyboard.keyboardDOM.innerHTML).toBe("");

  expect(document.onkeydown).toBe(null);
  expect(document.onkeyup).toBe(null);

  // expect(document.onpointerdown).toBe(null);
  // expect(document.onpointerup).toBe(null);

  // expect(document.onmousedown).toBe(null);
  // expect(document.onmouseup).toBe(null);

  // expect(document.ontouchstart).toBe(null);
  // expect(document.ontouchend).toBe(null);
  // expect(document.ontouchcancel).toBe(null);

  expect(keyboard.initialized).toBe(false);
});

it('Keyboard destroy will work with debug option', () => {
    const keyboard = new Keyboard({ debug: true });
  keyboard.destroy();
  expect(keyboard.keyboardDOM.innerHTML).toBe("");
});

it('Keyboard disableButtonHold will work', () => {
    const keyboard = new Keyboard({
    disableButtonHold: true
  });

  expect(keyboard.options.disableButtonHold).toBe(true);
});

it('Keyboard caretEventHandler will be triggered on mouseup and ontouchend', () => {
    const keyboard = new Keyboard({
    disableCaretPositioning: true
  });

  keyboard.setCaretPosition(6);
  expect(keyboard.getCaretPosition()).toBe(6);

  const event = {
    target: document.body
  };

  triggerDocumentPointerUp(event);

  expect(keyboard.getCaretPosition()).toBe(null);

  keyboard.setOptions({
    disableCaretPositioning: false
  })

  keyboard.setCaretPosition(10);
});

it('Keyboard onKeyReleased will work', () => {
    let pressed = false;
  let firedTimes = 0;
  let buttonPressed;

  const keyboard = new Keyboard({
    onKeyReleased: button => {
      pressed = true;
      buttonPressed = button;
      firedTimes++;
    },
    debug: true
  });

  keyboard.getButtonElement("q").onpointerdown();
  keyboard.getButtonElement("q").onpointerup();

  expect(pressed).toBeTruthy();
  expect(firedTimes).toBe(1);
  expect(buttonPressed).toBe("q");
});

it('Keyboard buttonAttribute will work', () => {
    new Keyboard({
    buttonAttributes: [
      {
        attribute: "aria-label",
        value: "bee",
        buttons: "b B"
      }
    ]
  });
});

it('Keyboard buttonAttribute will warn about invalid entries', () => {
    new Keyboard({
    buttonAttributes: [
      {
        attribute: false,
        value: null
      }
    ]
  });
});

it('Keyboard recurseButtons will not work without a valid param', () => {
  setDOM();
  const keyboard = new Keyboard();
  expect(keyboard.recurseButtons()).toBeFalsy();
});

it('Keyboard will not work with a DOM element param without class', () => {
  try {
    const keyboardDOM = document.createElement("div");
    new Keyboard(keyboardDOM);
    expect(true).toBe(false);
  } catch (e) {
    expect(e.message).toBe("KEYBOARD_DOM_CLASS_ERROR");
  }
});

it('Keyboard will work with a DOM element param with class', () => {
  try {
    const keyboardClass = "my-keyboard";
    const keyboardDOM = document.createElement("div");
    keyboardDOM.className = keyboardClass;
    const keyboard = new Keyboard(keyboardDOM);

    expect(keyboard.keyboardDOMClass).toBe(keyboardClass);
  } catch (e) {
    expect(true).toBe(false);
  }
});

it('Keyboard handleKeyboardContainerMouseDown will work', () => {
    const keyboard = new Keyboard();
  keyboard.keyboardDOM.onpointerdown();
});

it('Keyboard handleKeyboardContainerMouseDown will respect preventMouseDownDefault', () => {
    let works = false;
  const keyboard = new Keyboard({ preventMouseDownDefault: true });
  keyboard.keyboardDOM.onpointerdown({ preventDefault: () => {
    works = true
  }});

  expect(works).toBe(true);
});

it('Keyboard caret positioning will work', () => {
    const keyboard = new Keyboard({
    onKeyPress: (button) => {
      if (button === "{shift}" || button === "{lock}") handleShift();
      else if (keyboard.options.layoutName === "shift") handleShift();
    }
  });

  function handleShift() {
    const currentLayout = keyboard.options.layoutName;
    const shiftToggle = currentLayout === "default" ? "shift" : "default";
  
    keyboard.setOptions({
      layoutName: shiftToggle
    });
  }

  keyboard.getButtonElement("h").onpointerdown();
  keyboard.getButtonElement("o").onpointerdown();
  keyboard.setCaretPosition(1);
  keyboard.getButtonElement("{shift}")[0].onpointerdown();
  keyboard.getButtonElement("E").onpointerdown();
  keyboard.getButtonElement("l").onpointerdown();
  keyboard.getButtonElement("l").onpointerdown();

  expect(keyboard.getInput()).toBe("hEllo");
});

it('Keyboard excludeFromLayout will work', () => {
  const keyboard = new Keyboard();

  expect(keyboard.getButtonElement("a")).toBeDefined();

  keyboard.setOptions({
    excludeFromLayout: {
      default: ["a"]
    }
  });

  expect(keyboard.getButtonElement("a")).toBeUndefined();
});

it('Keyboard onSetOptions can be called without changedOptions param', () => {
  const keyboard = new Keyboard();
  expect(keyboard.onSetOptions()).toBeUndefined();
});

it('Keyboard will handle selected input with unchanged updatedInput edge case', () => {
  const inputElem = document.createElement("input");
  const onChange = jest.fn();
  const keyboard = new Keyboard({ onChange });
  
  const initialValue = "3";
  inputElem.value = initialValue;
  inputElem.select();
  keyboard.setInput(initialValue);
  keyboard.activeInputElement = inputElem;
  keyboard.setCaretPosition(0, 1);

  keyboard.getButtonElement("3").onpointerdown();
  keyboard.getButtonElement("3").onpointerdown();

  expect(onChange).toBeCalledTimes(2);
  expect(keyboard.getInput()).toBe("33");
  expect(keyboard.getCaretPosition()).toBe(2);
  expect(keyboard.getCaretPositionEnd()).toBe(2);
});

// https://github.com/hodgef/simple-keyboard/issues/1868
it('Keyboard will handle caret pos sync after partially selected input resolution', () => {
  const inputElem = document.createElement("input");
  const onChange = jest.fn();
  const keyboard = new Keyboard({ onChange });
  
  keyboard.getButtonElement("q").onpointerdown();
  keyboard.getButtonElement("w").onpointerdown();
  keyboard.getButtonElement("e").onpointerdown();
  keyboard.getButtonElement("r").onpointerdown();
  keyboard.getButtonElement("t").onpointerdown();
  keyboard.getButtonElement("y").onpointerdown();

  inputElem.setSelectionRange(1, 2);
  keyboard.setCaretPosition(1, 2);

  keyboard.getButtonElement("d").onpointerdown();
  keyboard.getButtonElement("d").onpointerdown();
  keyboard.getButtonElement("d").onpointerdown();

  expect(keyboard.getInput()).toBe("qddderty");

  inputElem.setSelectionRange(1, 2);
  keyboard.setCaretPosition(1, 2);

  keyboard.getButtonElement("d").onpointerdown();
  expect(keyboard.getInput()).toBe("qddderty");

  // caret position should now be synced
  expect(keyboard.getCaretPosition()).toBe(keyboard.getCaretPositionEnd());

  keyboard.getButtonElement("d").onpointerdown();

  expect(keyboard.getInput()).toBe("qdddderty");
  expect(keyboard.getCaretPosition()).toBe(3);
});

it('Ensure caret position is offset when rtl option is enabled', () => {
  const keyboard = new Keyboard({
    useMouseEvents: true,
    rtl: true,
    layout: {
      default: ["{bksp} ש ל ו ם"]
    }
  });

  const caretEventHandler = jest.spyOn(keyboard, 'caretEventHandler');

  keyboard.getButtonElement("ש").onclick();
  keyboard.getButtonElement("ו").onclick();
  keyboard.getButtonElement("ם").onclick();

  expect(keyboard.getInput()).toBe("‫שום‬");

  const input = document.createElement("input");
  input.value = keyboard.getInput();
  input.type = "text";
  input.selectionStart = 2;
  input.selectionEnd = 2;

  keyboard.caretEventHandler({
    type: "selectionchange",
    target: input
  });

  expect(caretEventHandler).toHaveBeenCalled();
  expect(keyboard.getCaretPosition()).toBe(1);

  keyboard.getButtonElement("ל").onclick();

  expect(keyboard.getInput()).toBe('‫שלום‬');

  input.value = keyboard.getInput();
  input.type = "text";
  input.selectionStart = 4;
  input.selectionEnd = 4;

  keyboard.caretEventHandler({
    type: "selectionchange",
    target: input
  });

  keyboard.getButtonElement("{bksp}").onclick();
  
  expect(keyboard.getInput()).toBe('‫שלם‬');
});