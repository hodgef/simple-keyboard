import Keyboard from '../Keyboard';
import { setDOM, clearDOM } from '../../../utils/TestUtility';
import CandidateBox from '../CandidateBox';

beforeEach(() => {
  setDOM();
});

afterEach(() => {
  clearDOM();
});

it('CandidateBox class will be instantiated by default', () => {
  document.querySelector("body").innerHTML = `
    <input class="input" placeholder="Tap on the virtual keyboard to start" />
    <div class="simple-keyboard"></div>

    <input class="input2" placeholder="Tap on the virtual keyboard to start" />
    <div class="keyboard2"></div>
  `;

  const keyboard1 = new Keyboard({
    layout: {
      default: [
        "a b"
      ]
    }
  });

  const keyboard2 = new Keyboard(".keyboard2", {
    layout: {
      default: [
        "a b"
      ]
    },
    layoutCandidates: {
      a: "1 2"
    }
  });

  expect(keyboard1.candidateBox).toBeInstanceOf(CandidateBox);
  expect(keyboard2.candidateBox).toBeInstanceOf(CandidateBox);

  keyboard1.destroy();
  keyboard2.destroy();
});

it('CandidateBox class will not be instantiated on enableLayoutCandidates: false', () => {
  const keyboard = new Keyboard({
    layout: {
      default: [
        "a b"
      ]
    },
    layoutCandidates: {
      a: "1 2"
    },
    enableLayoutCandidates: false
  });

  expect(keyboard.candidateBox).toBeNull();
  keyboard.destroy();
});

it('CandidateBox will respect layoutCandidatesPageSize', () => {
  const keyboard = new Keyboard({
    layout: {
      default: [
        "a b {bksp}"
      ]
    },
    layoutCandidates: {
      a: "1 2 3 4 5 6"
    },
    layoutCandidatesPageSize: 3
  });

  keyboard.getButtonElement("a").click();

  expect(keyboard.candidateBox.candidateBoxElement.querySelectorAll("li").length).toBe(3);

  keyboard.getButtonElement("{bksp}").click();
  keyboard.setOptions({
    layoutCandidatesPageSize: 6
  });

  keyboard.getButtonElement("a").click();

  expect(keyboard.candidateBox.candidateBoxElement.querySelectorAll("li").length).toBe(6);
  keyboard.destroy();
});

it('CandidateBox will respect layoutCandidatesPageSize', () => {
  const keyboard = new Keyboard({
    layout: {
      default: [
        "a b {bksp}"
      ]
    },
    layoutCandidates: {
      a: "1 2 3 4 5 6"
    },
    layoutCandidatesPageSize: 3
  });

  keyboard.getButtonElement("a").click();

  expect(keyboard.candidateBox.candidateBoxElement.querySelectorAll("li").length).toBe(3);

  keyboard.getButtonElement("{bksp}").click();
  keyboard.setOptions({
    layoutCandidatesPageSize: 6
  });

  keyboard.getButtonElement("a").click();

  expect(keyboard.candidateBox.candidateBoxElement.querySelectorAll("li").length).toBe(6);
  keyboard.destroy();
});

it('CandidateBox will reset on layoutCandidates change', () => {
  const keyboard = new Keyboard({
    layout: {
      default: [
        "a b {bksp}"
      ]
    },
    layoutCandidates: {
      a: "1 2 3 4 5 6"
    },
    layoutCandidatesPageSize: 3
  });

  keyboard.getButtonElement("a").click();

  expect(keyboard.candidateBox.candidateBoxElement.querySelector("li").textContent).toBe("1");

  keyboard.getButtonElement("{bksp}").click();
  keyboard.setOptions({
    layoutCandidates: {
      a: "s1 s2 s3 s4 s5 s6"
    }
  });

  keyboard.getButtonElement("a").click();

  expect(keyboard.candidateBox.candidateBoxElement.querySelector("li").textContent).toBe("s1");
  keyboard.destroy();
});

it('CandidateBox show will return early if candidateValue is not provided', () => {
  const keyboard = new Keyboard({
    layout: {
      default: [
        "a b {bksp}"
      ]
    }
  });

  keyboard.candidateBox.renderPage = jest.fn();
  keyboard.candidateBox.show({
    candidateValue: null,
    targetElement: document.createElement("div"),
    onSelect: () => {}
  });

  expect(keyboard.candidateBox.renderPage).not.toBeCalled();
  keyboard.destroy();
});

it('CandidateBox show will call renderPage if candidateValue is provided', () => {
  const keyboard = new Keyboard({
    layout: {
      default: [
        "a b {bksp}"
      ]
    }
  });

  keyboard.candidateBox.renderPage = jest.fn();
  keyboard.candidateBox.show({
    candidateValue: "a b",
    targetElement: document.createElement("div"),
    onSelect: () => {}
  });

  expect(keyboard.candidateBox.renderPage).toBeCalled();
  keyboard.destroy();
});

it('CandidateBox select candidate will work', () => {
  const keyboard = new Keyboard({
    layout: {
      default: [
        "a b {bksp}"
      ]
    },
    layoutCandidates: {
      a: "1 2 3 4 5 6"
    }
  });

  let candidateBoxOnItemSelected;
  const onSelect = jest.fn().mockImplementation((selectedCandidate) => {
    candidateBoxOnItemSelected(selectedCandidate);
    keyboard.candidateBox.destroy();
  });

  const candidateBoxRenderFn = keyboard.candidateBox.renderPage;
  jest.spyOn(keyboard.candidateBox, "renderPage").mockImplementation((params) => {
    candidateBoxOnItemSelected = params.onItemSelected;
    params.onItemSelected = onSelect;
    candidateBoxRenderFn(params);
  });

  keyboard.getButtonElement("a").click();
  keyboard.candidateBox.candidateBoxElement.querySelector("li").click();

  expect(onSelect).toHaveBeenCalledWith("1", expect.anything());
  keyboard.destroy();
});

it('CandidateBox select next and previous page will work', () => {
  const keyboard = new Keyboard({
    layout: {
      default: [
        "a b {bksp}"
      ]
    },
    layoutCandidates: {
      a: "1 2 3 4 5 6"
    },
    layoutCandidatesPageSize: 3
  });

  keyboard.getButtonElement("a").click();
  keyboard.candidateBox.candidateBoxElement.querySelector(".hg-candidate-box-next").click();

  expect(keyboard.candidateBox.candidateBoxElement.querySelector("ul").textContent).toBe("456");

  keyboard.candidateBox.candidateBoxElement.querySelector(".hg-candidate-box-prev").click();

  expect(keyboard.candidateBox.candidateBoxElement.querySelector("ul").textContent).toBe("123");
  keyboard.destroy();
});

it('CandidateBox selecting next and previous page when not available will do nothing', () => {
  const keyboard = new Keyboard({
    layout: {
      default: [
        "a b {bksp}"
      ]
    },
    layoutCandidates: {
      a: "1 2 3 4 5 6"
    },
    layoutCandidatesPageSize: 3
  });

  keyboard.getButtonElement("a").click();

  keyboard.candidateBox.candidateBoxElement.querySelector(".hg-candidate-box-prev").click();
  expect(keyboard.candidateBox.candidateBoxElement.querySelector("ul").textContent).toBe("123");

  keyboard.candidateBox.candidateBoxElement.querySelector(".hg-candidate-box-next").click();
  expect(keyboard.candidateBox.candidateBoxElement.querySelector("ul").textContent).toBe("456");

  keyboard.candidateBox.candidateBoxElement.querySelector(".hg-candidate-box-next").click();
  expect(keyboard.candidateBox.candidateBoxElement.querySelector("ul").textContent).toBe("456");

  keyboard.destroy();
});

it('CandidateBox will not show anything when there is no candidates', () => {
  const keyboard = new Keyboard({
    layout: {
      default: [
        "a b {bksp}"
      ]
    },
    layoutCandidates: {
      a: "1 2 3 4 5 6"
    }
  });

  keyboard.getButtonElement("b").click();

  expect(keyboard.candidateBox.candidateBoxElement).toBeUndefined();
  keyboard.destroy();
});

it('CandidateBox will propose the better matching result, regardless of layoutCandidates order', () => {
  const keyboard = new Keyboard({
    layout: {
      default: [
        "a b {bksp}"
      ]
    },
    layoutCandidates: {
      a: "1 2 3",
      aa: "6 7 8"
    }
  });

  keyboard.getButtonElement("a").click();
  expect(keyboard.candidateBox.candidateBoxElement.querySelector("ul").textContent).toBe("123");

  keyboard.getButtonElement("a").click(); // This will get you the 'aa' layoutCandidates instead of the 'a' ones.
  expect(keyboard.candidateBox.candidateBoxElement.querySelector("ul").textContent).toBe("678");

  keyboard.getButtonElement("{bksp}").click();
  expect(keyboard.candidateBox.candidateBoxElement.querySelector("ul").textContent).toBe("123");

  keyboard.destroy();
});

it('CandidateBox show not be called if keyboard.candidateBox is undefined upon showCandidatesBox call', () => {
  const keyboard = new Keyboard({
    layout: {
      default: [
        "a b {bksp}"
      ]
    },
    layoutCandidates: {
      a: "1 2 3",
      aa: "6 7 8"
    }
  });

  keyboard.candidateBox = null;
  keyboard.showCandidatesBox();
});

it('CandidateBox selection should trigger onChange', () => {
  const keyboard = new Keyboard({
    layout: {
      default: [
        "a b {bksp}"
      ]
    },
    layoutCandidates: {
      a: "1 2 3 4 5 6"
    },
    onChange: jest.fn(),
    onChangeAll: jest.fn()
  });

  let candidateBoxOnItemSelected;
  
  const onSelect = jest.fn().mockImplementation((selectedCandidate) => {
    candidateBoxOnItemSelected(selectedCandidate);
    keyboard.candidateBox.destroy();
  });

  const candidateBoxRenderFn = keyboard.candidateBox.renderPage;
  
  jest.spyOn(keyboard.candidateBox, "renderPage").mockImplementation((params) => {
    candidateBoxOnItemSelected = params.onItemSelected;
    params.onItemSelected = onSelect;
    candidateBoxRenderFn(params);
  });

  keyboard.getButtonElement("a").click();
  keyboard.candidateBox.candidateBoxElement.querySelector("li").click();

  expect(keyboard.options.onChange.mock.calls[0][0]).toBe("a");
  expect(keyboard.options.onChangeAll.mock.calls[0][0]).toMatchObject({"default": "a"});

  expect(keyboard.options.onChange.mock.calls[1][0]).toBe("1");
  expect(keyboard.options.onChangeAll.mock.calls[1][0]).toMatchObject({"default": "1"});
  keyboard.destroy();
});

it('CandidateBox normalization will work', () => {
  const keyboard = new Keyboard({
    layout: {
      default: [
        "a b {bksp}"
      ]
    },
    layoutCandidates: {
      a: "신"
    },
    onChange: jest.fn(),
    onChangeAll: jest.fn()
  });

  let candidateBoxOnItemSelected;
  
  const onSelect = jest.fn().mockImplementation((selectedCandidate) => {
    candidateBoxOnItemSelected(selectedCandidate);
    keyboard.candidateBox.destroy();
  });

  const candidateBoxRenderFn = keyboard.candidateBox.renderPage;
  
  jest.spyOn(keyboard.candidateBox, "renderPage").mockImplementation((params) => {
    candidateBoxOnItemSelected = params.onItemSelected;
    params.onItemSelected = onSelect;
    candidateBoxRenderFn(params);
  });

  keyboard.getButtonElement("a").click();
  keyboard.candidateBox.candidateBoxElement.querySelector("li").click();

  expect(keyboard.options.onChange.mock.calls[0][0]).toBe("a");
  expect(keyboard.options.onChangeAll.mock.calls[0][0]).toMatchObject({"default": "a"});

  // Selected candidate will be normalized
  expect(keyboard.options.onChange.mock.calls[1][0]).toBe("신");
  expect(keyboard.options.onChange.mock.calls[1][0].length).toBe(3);
  expect(keyboard.options.onChangeAll.mock.calls[1][0]).toMatchObject({"default": "신"});

  // Selected candidate will not be normalized
  keyboard.clearInput();
  keyboard.setOptions({ disableCandidateNormalization: true });

  keyboard.getButtonElement("a").click();
  keyboard.candidateBox.candidateBoxElement.querySelector("li").click();

  expect(keyboard.options.onChange.mock.calls[2][0]).toBe("a");
  expect(keyboard.options.onChangeAll.mock.calls[2][0]).toMatchObject({"default": "a"});

  expect(keyboard.options.onChange.mock.calls[3][0]).toBe("신");
  expect(keyboard.options.onChange.mock.calls[3][0].length).toBe(1);
  expect(keyboard.options.onChangeAll.mock.calls[3][0]).toMatchObject({"default": "신"});

  keyboard.destroy();
});