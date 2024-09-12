import Keyboard from '../../components/Keyboard';
import { setDOM } from '../../../utils/TestUtility';

it('PhysicalKeyboard keydown will be handled with physicalKeyboardHighlight', () => {
  setDOM();

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
  setDOM();

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
  setDOM();

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
  setDOM();

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
  setDOM();

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
  setDOM();

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
  setDOM();

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

it('PhysicalKeyboard will work with physicalKeyboardHighlightPress', () => {
  setDOM();

  new Keyboard({
    physicalKeyboardHighlight: true,
    physicalKeyboardHighlightPress: true,
    debug: true
  });

  document.dispatchEvent(new KeyboardEvent('keydown', {
    code: "KeyF",
    key: "f",
    target: {
      tagName: "input"
    }
  }));

  document.dispatchEvent(new KeyboardEvent('keyup', {
    code: "KeyF",
    key: "f",
    target: {
      tagName: "input"
    }
  }));
});

it('PhysicalKeyboard will work with physicalKeyboardHighlightPress (touch)', () => {
  setDOM();

  new Keyboard({
    physicalKeyboardHighlight: true,
    physicalKeyboardHighlightPress: true,
    useTouchEvents: true,
    debug: true
  });

  document.dispatchEvent(new KeyboardEvent('keydown', {
    code: "KeyF",
    key: "f",
    target: {
      tagName: "input"
    }
  }));

  document.dispatchEvent(new KeyboardEvent('keyup', {
    code: "KeyF",
    key: "f",
    target: {
      tagName: "input"
    }
  }));
});

it('PhysicalKeyboard with physicalKeyboardHighlightPress can trigger noop', () => {
  setDOM();

  const keyboard = new Keyboard({
    physicalKeyboardHighlight: true,
    physicalKeyboardHighlightPress: true,
    useTouchEvents: true,
    debug: true
  });

  keyboard.getButtonElement('f').onmousedown = null;
  keyboard.getButtonElement('f').onpointerdown = null;
  keyboard.getButtonElement('f').ontouchstart = null;

  document.dispatchEvent(new KeyboardEvent('keydown', {
    code: "KeyF",
    key: "f",
    target: {
      tagName: "input"
    }
  }));

  keyboard.getButtonElement('f').onmouseup = null;
  keyboard.getButtonElement('f').onpointerup = null;
  keyboard.getButtonElement('f').ontouchend = null;

  document.dispatchEvent(new KeyboardEvent('keyup', {
    code: "KeyF",
    key: "f",
    target: {
      tagName: "input"
    }
  }));
});

it('PhysicalKeyboard keyCodeToKey will work', () => {
  setDOM();

  const keyboard = new Keyboard({
    physicalKeyboardHighlight: true
  });

  expect(keyboard.physicalKeyboard.keyCodeToKey(186)).toBe(";");

  const methodTest = jest.spyOn(keyboard.physicalKeyboard, "keyCodeToKey");

  document.dispatchEvent(new KeyboardEvent('keyup', {
    keyCode: 186,
    target: {
      tagName: "input"
    }
  }));

  expect(methodTest).toHaveBeenCalledWith(186);
});