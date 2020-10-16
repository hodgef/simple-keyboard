import { setDOM, removeRTLControls } from '../../utils/TestUtility';
import RTLDemo from '../RTLDemo';

it('Demo will load', () => {
  setDOM();

  new RTLDemo();
});

it('Demo onDOMLoaded will work', () => {
  setDOM();

  const demo = new RTLDemo();

  expect(demo.keyboard).toBeTruthy();
});

it('Demo onChange will work', () => {
  setDOM();

  const demo = new RTLDemo();

  demo.onChange("test");
  
  expect(removeRTLControls(document.body.querySelector('.input').value)).toBe("test");
});

it('Demo onChange will work', () => {
  setDOM();

  const demo = new RTLDemo();

  demo.keyboard.getButtonElement(".").onclick();
  
  expect(removeRTLControls(document.body.querySelector('.input').value)).toBe(".");
});

it('Demo input change will work', () => {
  setDOM();

  const demo = new RTLDemo();

  document.body.querySelector('.input').value = "test";
  document.body.querySelector('.input').dispatchEvent(new Event('input'));
  
  expect(removeRTLControls(demo.keyboard.getInput())).toBe("test");
});

it('Demo handleShiftButton will work', () => {
  setDOM();

  const demo = new RTLDemo();

  demo.keyboard.getButtonElement("{shift}")[0].onclick();
  expect(demo.keyboard.options.layoutName).toBe("shift");

  demo.keyboard.getButtonElement("{shift}")[0].onclick();
  expect(demo.keyboard.options.layoutName).toBe("default");
});

it('RTL control caracters will be added to ', () => {
  setDOM();

  const demo = new RTLDemo();

  demo.keyboard.getButtonElement("פ").onclick();
  demo.keyboard.getButtonElement("ם").onclick();
  demo.keyboard.getButtonElement("[").onclick();

  expect(demo.keyboard.getInput()).toBe("‫פם[‬");
  expect(demo.keyboard.input[demo.keyboard.options.inputName]).toBe("פם[");
});