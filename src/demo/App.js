import React, {Component} from 'react';
import Keyboard from '../lib';
import './App.css';

class App extends Component {
  state = {
    input: '',
    layoutName: "default"
  }

  componentDidMount(){
    this.keyboard.setInput("Hello World!")
      .then(input => {
        this.setState({input: input});
      });
  }
  
  onChange = (input) => {
    this.setState({
      input: input
    }, () => {
      console.log("Input changed", input);
    });
  }

  onKeyPress = (button) => {
    console.log("Button pressed", button);

    /**
     * Shift functionality
     */
    if(button === "{lock}" || button === "{shift}")
      this.handleShiftButton();

  }

  handleShiftButton = () => {
    let layoutName = this.state.layoutName;
    let shiftToggle = layoutName === "default" ? "shift" : "default";

    this.setState({
      layoutName: shiftToggle
    });
  }
  
  render(){
    return (
      <div className={"demoPage"}>
        <div className={"screenContainer"}>
          <textarea className={"inputContainer"} value={this.state.input} />
        </div>
        <Keyboard
          ref={r => this.keyboard = r}
          onChange={input => this.onChange(input)}
          onKeyPress={button => this.onKeyPress(button)}
          layoutName={this.state.layoutName}
          newLineOnEnter={true}
          layout={{
            'default': [
              '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
              '{tab} q w e r t y u i o p [ ] \\',
              '{lock} a s d f g h j k l ; \' {enter}',
              '{shift} z x c v b n m , . / {shift}',
              '.com @ {space}'
            ],
            'shift': [
              '~ ! @ # $ % ^ & * ( ) _ + {bksp}',
              '{tab} Q W E R T Y U I O P { } |',
              '{lock} A S D F G H J K L : " {enter}',
              '{shift} Z X C V B N M < > ? {shift}',
              '.com @ {space}'
            ]
          }}
          theme={"hg-layout-default hg-theme-default"}
          debug={true}
          display={{
            '{bksp}': 'delete',
            '{enter}': '< enter',
            '{shift}': 'shift',
            '{s}': 'shift',
            '{tab}': 'tab',
            '{lock}': 'caps',
            '{accept}': 'Submit',
            '{space}': ' ',
            '{//}': ' '
          }}
        />
      </div>
    );
  }
 
}

export default App;