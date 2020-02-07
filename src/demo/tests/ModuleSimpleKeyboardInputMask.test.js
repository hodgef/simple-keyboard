import Keyboard from '../../lib';
import SimpleKeyboardInputMask from 'simple-keyboard-input-mask';

test('Module simple-keyboard-input-mask runs without crashing', () => {
  const div = document.createElement('div');
  
  div.className += "simple-keyboard";
  document.body.appendChild(div);

  const keyboard = new Keyboard({
    debug: true,
    onChange: input => input,
    onKeyPress: button => button,
    inputMask: "(99) 9999-9999",
    useMouseEvents: true,
    modules: [
      SimpleKeyboardInputMask
    ],
  });

  keyboard.getButtonElement("d").onclick();
  keyboard.getButtonElement("o").onclick();
  keyboard.getButtonElement("{space}").onclick();
  keyboard.getButtonElement("1").onclick();
  keyboard.getButtonElement("2").onclick();
  keyboard.getButtonElement("3").onclick();
  keyboard.getButtonElement("c").onclick();
  keyboard.getButtonElement("4").onclick();
  keyboard.getButtonElement("5").onclick();
  keyboard.getButtonElement("6").onclick();
  keyboard.getButtonElement("7").onclick();
  keyboard.getButtonElement("8").onclick();
  keyboard.getButtonElement("9").onclick();
  keyboard.getButtonElement("0").onclick();

  expect(keyboard.getInput()).toBe("(12) 3456-7890");
});
