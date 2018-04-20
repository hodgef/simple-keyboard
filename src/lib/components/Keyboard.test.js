import React from 'react';
import ReactDOM from 'react-dom';
import Keyboard from './Keyboard';

it('Keyboard renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Keyboard />, div);
});
