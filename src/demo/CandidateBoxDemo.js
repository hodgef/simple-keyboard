import Keyboard from '../lib';
import './css/CandidateBoxDemo.css';
import layout from 'simple-keyboard-layouts/build/layouts/arabic';
import korean from 'simple-keyboard-layouts/build/layouts/korean';

const setDOM = () => {
  document.querySelector('body').innerHTML = `
    <input class="input" placeholder="Tap on the virtual keyboard to start" />
    <div class="simple-keyboard"></div>
  `;
};

class Demo {
  isShiftActive = false;
  persistentKey = new Set();

  constructor() {
    setDOM();

    /**
     * Demo Start
     * add layoutCandidates to the layout
     *       ...korean,
     * layoutCandidates: korean.layoutCandidates,
     */
    this.keyboard = new Keyboard({
      onChange: (input) => this.onChange(input),
      onKeyPress: (button) => this.onKeyPress(button),
      onKeyReleased: (button) => this.onKeyReleased(button),
      preventMouseDownDefault: true,
      layoutCandidatesPageSize: 15,
      enableLayoutCandidatesKeyPress: true,
      physicalKeyboardHighlight: true,
      physicalKeyboardHighlightPress: true,
      physicalKeyboardHighlightPressUsePointerEvents: true,
      physicalKeyboardHighlightPreventDefault: true,
      excludeFromLayout: {
        default: ['@', '.com'],
        shift: ['@', '.com'],
      },
    });
  }

  onChange(input) {
    const inputElement = document.querySelector('.input');

    /**
     * Updating input's value
     */
    inputElement.value = input;

    /**
     * Synchronizing input caret position
     */
    const caretPosition = this.keyboard.caretPosition;
    if (caretPosition !== null) this.setInputCaretPosition(inputElement, caretPosition);
  }

  setInputCaretPosition(elem, pos) {
    if (elem.setSelectionRange) {
      elem.focus();
      elem.setSelectionRange(pos, pos);
    }
  }

  onKeyPress(button) {
    console.log('Button pressed', button);

    if (button === '{shift}') {
      if (this.persistentKey.has(button)) return;
      this.persistentKey.add(button);

      if (!this.isShiftActive) {
        this.isShiftActive = true;
        this.handleShift();
      }
    } else if (button === '{lock}') {
      this.isShiftActive = !this.isShiftActive;
      this.handleShift();
    }
  }

  onKeyReleased(button) {
    console.log('Button released', button);

    if (button === '{shift}') {
      this.persistentKey.delete(button);
      this.isShiftActive = false;
      this.handleShift();
    }
  }

  handleShift() {
    const currentLayout = this.keyboard.options.layoutName;
    const shiftToggle = currentLayout === 'default' ? 'shift' : 'default';

    this.keyboard.setOptions({
      layoutName: shiftToggle,
    });
  }
}

export default Demo;
