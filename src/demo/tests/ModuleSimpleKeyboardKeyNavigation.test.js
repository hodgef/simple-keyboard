import Keyboard from '../../lib';
import SimpleKeyboardKeyNavigation from 'simple-keyboard-key-navigation';

test('Module simple-keyboard-key-navigation runs without crashing', () => {
  const div = document.createElement('div');
  
  div.className = "simple-keyboard";
  document.body.appendChild(div);

  const keyboard = new Keyboard({
    debug: true,
    onChange: input => input,
    onKeyPress: button => button,
    enableKeyNavigation: true,
    modules: [
      SimpleKeyboardKeyNavigation
    ]
  });

  keyboard.modules.keyNavigation.right();
  keyboard.modules.keyNavigation.down();
  keyboard.modules.keyNavigation.press();

  expect(keyboard.getInput()).toBe("q");
});
