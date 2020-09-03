import { setDOM } from '../../utils/TestUtility';
import BasicDemo from '../BasicDemo';

it('Demo will load', () => {
  setDOM();

  new BasicDemo();
});

it('Demo onDOMLoaded will work', () => {
  setDOM();

  const demo = new BasicDemo();

  expect(demo.keyboard).toBeTruthy();
});

it('Demo onChange will work', () => {
  setDOM();

  const demo = new BasicDemo();

  demo.onChange("test");
  
  expect(document.body.querySelector('.input').value).toBe("test");
});

it('Demo onChange will work', () => {
  setDOM();

  const demo = new BasicDemo();

  demo.keyboard.getButtonElement("q").onclick();
  
  expect(document.body.querySelector('.input').value).toBe("q");
});

it('Demo input change will work', () => {
  setDOM();

  const demo = new BasicDemo();

  document.body.querySelector('.input').value = "test";
  document.body.querySelector('.input').dispatchEvent(new Event('input'));
  
  expect(demo.keyboard.getInput()).toBe("test");
});

it('Demo handleShiftButton will work', () => {
  setDOM();

  const demo = new BasicDemo();

  demo.keyboard.getButtonElement("{shift}")[0].onclick();
  expect(demo.keyboard.options.layoutName).toBe("shift");

  demo.keyboard.getButtonElement("{shift}")[0].onclick();
  expect(demo.keyboard.options.layoutName).toBe("default");
});