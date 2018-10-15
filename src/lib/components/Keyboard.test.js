import Keyboard from './Keyboard';

let keyboard;
let keyboardOptions = {
  onChange: input => input,
  onKeyPress: button => button,
  layout: {
    'default': [
      '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
      '{tab} q w e r t y u i o p [ ] \\',
      '{lock} a s d f g h j k l ; \' {enter}',
      '{shift} z x c v b n m , . / {shift}',
      '.com @ {space}'
    ],
    'shift': [
      '~ ! @ # $ % ^ & * ( ) _ + {bksp}',
      '{tab} Q W E R T Y U I O P { } |',
      '{lock} A S D F G H J K L : " {enter}',
      '{shift} Z X C V B N M < > ? {shift}',
      '.com @ {space}'
    ]
  },
  layoutName: "default",
  display: {
    '{bksp}': 'delete',
    '{enter}': 'submit',
    '{shift}': 'shift'
  },
  mergeDisplay: true,
  theme: "hg-theme-default testie",
  buttonTheme: [
    {
      class: "myCustomClass",
      buttons: "Q W E R T Y q w e r t y"
    },
    {
      class: "anotherCustomClass",
      buttons: "Q q"
    }
  ],
  newLineOnEnter: true,
  tabCharOnTab: true,
  maxLength: 10,
  syncInstanceInputs: true,
  onRender: () => console.log("simple-keyboard RENDERED"),
  onInit: () => console.log("simple-keyboard READY")
};

it('Keyboard renders without crashing', () => {
  const div = document.createElement('div');
  
  div.className += "simple-keyboard";
  document.body.appendChild(div);

  keyboard = new Keyboard(keyboardOptions);
});

it('Keyboard standard buttons are working', () => {
  testLayoutStdButtons();

  keyboard.setOptions({
    layoutName: "shift",
    maxLength: 42
  });

  testLayoutStdButtons();
});

function testLayoutStdButtons(){
  let rows = document.body.querySelector('.simple-keyboard').children;
  let stdBtnCount = 0;
  let fullInput = '';

  Array.from(rows).forEach(row => {
    Array.from(row.children).forEach((button) => {
      let label = button.getAttribute("data-skbtn");

      if(label.includes("{"))
        return false;

      // Click all standard buttons, respects maxLength
      button.onclick();

      // Recording fullInput, bypasses maxLength
      fullInput = keyboard.utilities.getUpdatedInput(label, fullInput, keyboard.options, null);

      stdBtnCount += label.length;
    });
  });

  /**
   * Check if maxLength is respected
   */
  if(keyboard.getInput().length !== keyboard.options.maxLength)
    throw "MAX_LENGTH_ISSUE";
  else
    console.log("MAX_LENGTH PASSED:", keyboard.options.layoutName, keyboard.getInput().length, keyboard.options.maxLength);

  /**
   * Check if all standard buttons are inputting something
   * (Regardless of maxLength)
   */
  if(stdBtnCount !== fullInput.length)
    throw "STANDARD_BUTTONS_ISSUE";
  else
    console.log("STANDARD_BUTTONS PASSED:", keyboard.options.layoutName, stdBtnCount, fullInput.length);
}
