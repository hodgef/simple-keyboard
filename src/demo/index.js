import App from './App';

/**
 * Initializing demo
 */
new App();

/**
 * Adding preview (demo only)
 */
document.querySelector('.simple-keyboard').insertAdjacentHTML('beforebegin', `
  <div class="simple-keyboard-preview">
    <textarea class="input" readonly>Hello World!</textarea>
  </div>
`);