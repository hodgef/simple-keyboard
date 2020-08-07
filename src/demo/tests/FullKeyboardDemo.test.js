import { setDOM } from '../../utils/TestUtility';
import FullKeyboardDemo from '../FullKeyboardDemo';

it('Demo will load', () => {
  setDOM();
  new FullKeyboardDemo();
});

it('Demo onDOMLoaded will work', () => {
  setDOM();

  const demo = new FullKeyboardDemo();

  expect(demo.keyboard).toBeTruthy();
});

it('Demo onChange will work', () => {
  setDOM();

  const demo = new FullKeyboardDemo();

  demo.onChange("test");
  
  expect(document.body.querySelector('.input').value).toBe("test");
});

it('Demo onChange will work', () => {
  setDOM();

  const demo = new FullKeyboardDemo();

  demo.keyboard.getButtonElement("q").onclick();
  
  expect(document.body.querySelector('.input').value).toBe("q");
});

it('Demo input change will work', () => {
  setDOM();

  const demo = new FullKeyboardDemo();

  document.body.querySelector('.input').value = "test";
  document.body.querySelector('.input').dispatchEvent(new Event('input'));
  
  expect(demo.keyboard.getInput()).toBe("test");
  expect(demo.keyboardNumPad.getInput()).toBe("test");
});

it('Demo handleShiftButton will work', () => {
  setDOM();

  const demo = new FullKeyboardDemo();

  demo.keyboard.getButtonElement("{shiftleft}").onclick();
  expect(demo.keyboard.options.layoutName).toBe("shift");

  demo.keyboard.getButtonElement("{shiftright}").onclick();
  expect(demo.keyboard.options.layoutName).toBe("default");
});