import DOMElementDemo from '../DOMElementDemo';
import Keyboard from '../../lib/components/Keyboard';

it('Demo will load', () => {
  new DOMElementDemo();
});

it('Demo keyboards will be instantiated', () => {
  const demo = new DOMElementDemo();
  expect(demo.keyboard1).toBeInstanceOf(Keyboard);
  expect(demo.keyboard2).toBeInstanceOf(Keyboard);
});

it('Demo input change will work', () => {
  const demo = new DOMElementDemo();

  demo.keyboard1.getButtonElement("q").onclick();
  demo.keyboard2.getButtonElement("e").onclick();
  
  expect(demo.keyboard1.getInput()).toBe("q");
  expect(demo.keyboard2.getInput()).toBe("e");
});