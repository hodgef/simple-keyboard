import Keyboard from '../../lib';
import SimpleKeyboardAutocorrect from 'simple-keyboard-autocorrect';

test('Module simple-keyboard-autocorrect runs without crashing', () => {
  const div = document.createElement('div');
  
  div.className = "simple-keyboard";
  document.body.appendChild(div);

  const keyboard = new Keyboard({
    debug: true,
    onChange: input => input,
    onKeyPress: button => button,
    newLineOnEnter: true,
    useMouseEvents: true,
    autocorrectDict: ["dog", "house"],
    modules: [
      SimpleKeyboardAutocorrect
    ]
  });

  keyboard.getButtonElement("d").onclick();
  keyboard.getButtonElement("o").onclick();
  keyboard.getButtonElement("{space}").onclick();
  keyboard.getButtonElement("{bksp}").onclick();

  expect(keyboard.getInput()).toBe("dog");
});
