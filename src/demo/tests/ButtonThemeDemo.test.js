import TestUtility from '../../utils/TestUtility';
import ButtonThemeDemo from '../ButtonThemeDemo';

let testUtil = new TestUtility();

it('Demo will load', () => {
  testUtil.setDOM();

  let demo = new ButtonThemeDemo();
});

it('Demo onDOMLoaded will work', () => {
  testUtil.setDOM();

  let demo = new ButtonThemeDemo();

  expect(demo.keyboard).toBeTruthy();
});

it('Demo onChange will work', () => {
  testUtil.setDOM();

  let demo = new ButtonThemeDemo();

  demo.onChange("test");
  
  expect(document.body.querySelector('.input').value).toBe("test");
});

it('Demo onChange will work', () => {
  testUtil.setDOM();

  let demo = new ButtonThemeDemo();

  demo.keyboard.getButtonElement("q").onclick();
  
  expect(document.body.querySelector('.input').value).toBe("q");
});

it('Demo input change will work', () => {
  testUtil.setDOM();

  let demo = new ButtonThemeDemo();

  document.body.querySelector('.input').value = "test";
  document.body.querySelector('.input').dispatchEvent(new Event('input'));
  
  expect(demo.keyboard.getInput()).toBe("test");
});

it('Demo handleShiftButton will work', () => {
  testUtil.setDOM();

  let demo = new ButtonThemeDemo();

  demo.keyboard.getButtonElement("{shift}")[0].onclick();
  expect(demo.keyboard.options.layoutName).toBe("shift");

  demo.keyboard.getButtonElement("{shift}")[0].onclick();
  expect(demo.keyboard.options.layoutName).toBe("default");
});

it('Demo buttons will have proper attributes and classes', () => {
  testUtil.setDOM();

  let demo = new ButtonThemeDemo();

  let buttonDOM = demo.keyboard.getButtonElement("b");

  console.log("buttonDOM", buttonDOM.outerHTML);

  let hasAttribute = buttonDOM.hasAttribute("aria-label");
  expect(hasAttribute).toBeTruthy();

  let hasClass = buttonDOM.classList.contains("my-button-outline");
  expect(hasClass).toBeTruthy();
});