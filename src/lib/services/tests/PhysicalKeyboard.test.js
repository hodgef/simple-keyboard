import Keyboard from '../../components/Keyboard';
import TestUtility from '../../../utils/TestUtility';

const testUtil = new TestUtility();

it('PhysicalKeyboard keydown will be handled with physicalKeyboardHighlight', () => {
  testUtil.setDOM();

  new Keyboard({
    physicalKeyboardHighlight: true
  });

  document.dispatchEvent(new KeyboardEvent('keydown', {
    code: "KeyF",
    key: "f",
    target: {
      tagName: "input"
    }
  }));
});

it('PhysicalKeyboard keydown will be handled without physicalKeyboardHighlight', () => {
  testUtil.setDOM();

  new Keyboard({
    physicalKeyboardHighlight: false
  });

  document.dispatchEvent(new KeyboardEvent('keydown', {
    code: "KeyF",
    key: "f",
    target: {
      tagName: "input"
    }
  }));
});

it('PhysicalKeyboard keydown will not style non-existent buttons', () => {
  testUtil.setDOM();

  new Keyboard({
    physicalKeyboardHighlight: true
  });

  document.dispatchEvent(new KeyboardEvent('keydown', {
    code: "WRONG",
    key: "WRONG",
    target: {
      tagName: "input"
    }
  }));
});

it('PhysicalKeyboard keyup will be handled with physicalKeyboardHighlight', () => {
  testUtil.setDOM();

  new Keyboard({
    physicalKeyboardHighlight: true
  });

  document.dispatchEvent(new KeyboardEvent('keyup', {
    code: "KeyF",
    key: "f",
    target: {
      tagName: "input"
    }
  }));
});

it('PhysicalKeyboard keyup will be handle special buttons', () => {
  testUtil.setDOM();

  new Keyboard({
    physicalKeyboardHighlight: true
  });

  document.dispatchEvent(new KeyboardEvent('keyup', {
    code: "Shift",
    key: "Shift",
    target: {
      tagName: "input"
    }
  }));
});

it('PhysicalKeyboard keyup will not style non-existent buttons', () => {
  testUtil.setDOM();

  new Keyboard({
    physicalKeyboardHighlight: true,
    debug: true
  });

  document.dispatchEvent(new KeyboardEvent('keyup', {
    code: "WRONG",
    key: "WRONG",
    target: {
      tagName: "input"
    }
  }));
});

it('PhysicalKeyboard will work with F1-F12 keys', () => {
  testUtil.setDOM();

  new Keyboard({
    physicalKeyboardHighlight: true,
    debug: true
  });

  document.dispatchEvent(new KeyboardEvent('keyup', {
    code: "F12",
    key: "F12",
    target: {
      tagName: "input"
    }
  }));
});