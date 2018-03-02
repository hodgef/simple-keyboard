import React, {Component} from 'react';
import Keyboard from '../lib';

class App extends Component {
  
  onChange = (input) => {
    console.log("Input changed", input);
  }

  onKeyPress = (button) => {
    console.log("Button pressed", button);
  }
  
  render(){
    return (
      <div>
        <Keyboard
          onChange={input => this.onChange(input)}
          onKeyPress={button => this.onKeyPress(button)}
          layoutName={"default"}
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
          theme={"myTheme hg-theme-default"}
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