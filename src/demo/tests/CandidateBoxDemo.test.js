import { setDOM } from '../../utils/TestUtility';
import CandidateBoxDemo from '../CandidateBoxDemo';

it('Demo will load', () => {
  setDOM();

  new CandidateBoxDemo();
});

it('Demo caret positioning will adjust accordingly', () => {
  setDOM();

  const demo = new CandidateBoxDemo();

  demo.keyboard.setCaretPosition(0);

  demo.keyboard.getButtonElement("n").click();
  demo.keyboard.getButtonElement("h").click();
  demo.keyboard.getButtonElement("a").click();
  demo.keyboard.getButtonElement("o").click();
  expect(demo.keyboard.getCaretPosition()).toBe(4);

  demo.keyboard.candidateBox.candidateBoxElement.querySelector("li").click();

  expect(demo.keyboard.getCaretPosition()).toBe(2);

  demo.keyboard.setCaretPosition(1);
  demo.keyboard.getButtonElement("i").click();

  expect(demo.keyboard.getCaretPosition()).toBe(2);

  demo.keyboard.candidateBox.candidateBoxElement.querySelector("li").click();

  expect(demo.keyboard.getCaretPosition()).toBe(1);
  expect(demo.keyboard.getInput()).toBe("你好");
});