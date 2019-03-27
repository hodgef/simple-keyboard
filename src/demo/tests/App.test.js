import TestUtility from '../../utils/TestUtility';
import Index from '../index';
import App from '../App';

let testUtil = new TestUtility();

it('Demo will load', () => {
  testUtil.setDOM();

  let demo = new App();
});

it('Demo onDOMLoaded will work', () => {
  testUtil.setDOM();

  let demo = new App();
  demo.onDOMLoaded();

  expect(demo.keyboard).toBeTruthy();
});

it('Demo onChange will work', () => {
  testUtil.setDOM();

  let demo = new App();
  demo.onDOMLoaded();

  demo.onChange("test");
  
  expect(document.body.querySelector('.input').value).toBe("test");
});

it('Demo onChange will work', () => {
  testUtil.setDOM();

  let demo = new App();
  demo.onDOMLoaded();

  demo.keyboard.getButtonElement("q").onclick();
  
  expect(document.body.querySelector('.input').value).toBe("q");
});

it('Demo input change will work', () => {
  testUtil.setDOM();

  let demo = new App();
  demo.onDOMLoaded();

  document.body.querySelector('.input').value = "test";
  document.body.querySelector('.input').dispatchEvent(new Event('input'));
  
  expect(demo.keyboard.getInput()).toBe("test");
});

it('Demo handleShiftButton will work', () => {
  testUtil.setDOM();

  let demo = new App();
  demo.onDOMLoaded();

  demo.keyboard.getButtonElement("{shift}")[0].onclick();
  expect(demo.keyboard.options.layoutName).toBe("shift");

  demo.keyboard.getButtonElement("{shift}")[0].onclick();
  expect(demo.keyboard.options.layoutName).toBe("default");
});