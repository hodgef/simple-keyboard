import TestUtility from '../../utils/TestUtility';
import BasicDemo from '../BasicDemo';

const testUtil = new TestUtility();

it('Demo will load', () => {
  testUtil.setDOM();

  new BasicDemo();
});

it('Demo onDOMLoaded will work', () => {
  testUtil.setDOM();

  const demo = new BasicDemo();

  expect(demo.keyboard).toBeTruthy();
});

it('Demo onChange will work', () => {
  testUtil.setDOM();

  const demo = new BasicDemo();

  demo.onChange("test");
  
  expect(document.body.querySelector('.input').value).toBe("test");
});

it('Demo onChange will work', () => {
  testUtil.setDOM();

  const demo = new BasicDemo();

  demo.keyboard.getButtonElement("q").onclick();
  
  expect(document.body.querySelector('.input').value).toBe("q");
});

it('Demo input change will work', () => {
  testUtil.setDOM();

  const demo = new BasicDemo();

  document.body.querySelector('.input').value = "test";
  document.body.querySelector('.input').dispatchEvent(new Event('input'));
  
  expect(demo.keyboard.getInput()).toBe("test");
});

it('Demo handleShiftButton will work', () => {
  testUtil.setDOM();

  const demo = new BasicDemo();

  demo.keyboard.getButtonElement("{shift}")[0].onclick();
  expect(demo.keyboard.options.layoutName).toBe("shift");

  demo.keyboard.getButtonElement("{shift}")[0].onclick();
  expect(demo.keyboard.options.layoutName).toBe("default");
});