import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Keyboard.css';

// Services
import KeyboardLayout from '../services/KeyboardLayout';
import Utilities from '../services/Utilities';

class App extends Component {
  state = {
    input: ''
  }

  componentWillReceiveProps = (nextProps) => {
    if(
      this.props !== nextProps
    ){
      this.setState({
        layoutName: nextProps.layoutName,
        layout: nextProps.layout,
        themeClass: nextProps.theme
      });
    }
  }

  clearInput = () => {
    this.setState({
      input: ''
    });
  }

  getInput = () => {
    return this.state.input;
  }

  setInput = input => {
    return new Promise(resolve => {
      this.setState({
        input: input
      }, () => {
        resolve(input);
      });
    })
    .catch(reason => {
      console.warn(reason);
    });
  }

  handleButtonClicked = (button) => {
    let debug = this.props.debug;
    
    /**
     * Ignoring placeholder buttons
     */
    if(button === '{//}')
      return false;

    /**
     * Calling onKeyPress
     */
    if(typeof this.props.onKeyPress === "function")
      this.props.onKeyPress(button);

    /**
     * Updating input
     */
    let options = {
      newLineOnEnter: this.props.newLineOnEnter !== false || true
    }
    
    let updatedInput = Utilities.getUpdatedInput(button, this.state.input, options);

    if(this.state.input !== updatedInput){
      this.setState({
        input: updatedInput
      }, () => {
        if(debug){
          console.log('Input changed:', this.state.input);
        }
        
        /**
         * Calling onChange
         */
        if(typeof this.props.onChange === "function")
          this.props.onChange(this.state.input);
      });
    }
    
    if(debug){
      console.log("Key pressed:", button);
    }
  }

  render() {
    let layoutName = this.props.layoutName || "default";
    let layout = this.props.layout || KeyboardLayout.getLayout(layoutName);
    let themeClass = this.props.theme || "hg-theme-default";
    let layoutClass = this.props.layout ? "hg-layout-custom" : `hg-layout-${layoutName}`;

    return (
      <div className={`simple-keyboard ${themeClass} ${layoutClass}`}>
        {layout[layoutName].map((row, index) => {
          let rowArray = row.split(' ');

          return (
            <div key={`hg-row-${index}`} className="hg-row">
              {rowArray.map((button, index) => {
                let fctBtnClass = Utilities.getButtonClass(button);
                let buttonDisplayName = Utilities.getButtonDisplayName(button, this.props.display);

                return (
                  <div
                    key={`hg-button-${index}`}
                    className={`hg-button ${fctBtnClass}`}
                    onClick={() => this.handleButtonClicked(button)}
                  ><span>{buttonDisplayName}</span></div>
                );
              })}
            </div>
          );
          
        })}
      </div>
    );
  }
}

App.propTypes = {
  layoutName: PropTypes.string,
  layout: PropTypes.object,
  theme:  PropTypes.string,
  display: PropTypes.object,
  onChange: PropTypes.func,
  onKeyPress: PropTypes.func,
  debug: PropTypes.bool
};

export default App;
