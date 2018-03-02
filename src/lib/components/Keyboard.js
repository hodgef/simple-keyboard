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
    let updatedInput = Utilities.getUpdatedInput(button, this.state.input);

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
    let layoutName = this.state.layoutName || "default";
    let layout = this.state.layout || KeyboardLayout.getLayout(layoutName);
    let themeClass = this.state.theme || `hg-theme-default`;

    return (
      <div className={`hodgefkeyboard ${themeClass} hg-layout-${layoutName}`}>
        {layout.default.map((row, index) => {
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
  layout: PropTypes.array,
  theme:  PropTypes.string,
  display: PropTypes.string,
  onChange: PropTypes.func,
  onKeyPress: PropTypes.func,
  debug: PropTypes.bool
};

export default App;
