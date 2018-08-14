[![npm version](https://badge.fury.io/js/simple-keyboard.svg)](https://www.npmjs.com/package/simple-keyboard)
[![](https://data.jsdelivr.com/v1/package/npm/simple-keyboard/badge)](https://www.jsdelivr.com/package/npm/simple-keyboard)

<a href="https://franciscohodge.com/simple-keyboard/demo" title="View Demo"><img src="https://franciscohodge.com/project-pages/simple-keyboard/images/simple-keyboard-banner2.png" align="center" width="100%"></a>

> The easily customisable and responsive on-screen virtual keyboard for Javascript projects.

## Installation

### npm

`npm install simple-keyboard --save`

### zip file (self-hosted)

[Click here to download the latest release (zip format).](https://github.com/hodgef/simple-keyboard/zipball/master)

> Want to use a CDN instead of self-host? Scroll down to the "Usage with CDN" instructions below.

## Usage with npm

### js

````js
import Keyboard from 'simple-keyboard';
import 'simple-keyboard/build/css/index.css';

let keyboard = new Keyboard({
  onChange: input => this.onChange(input),
  onKeyPress: button => this.onKeyPress(button)
});

function onChange(input){
  document.querySelector(".input").value = input;
  console.log("Input changed", input);
}

function onKeyPress(button){
  console.log("Button pressed", button);
}
````

### html

````html
<input class="input" />
<div class="simple-keyboard"></div>
````

[![Edit krzkx19rr](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/krzkx19rr)

> Need a more extensive example? [Click here](https://github.com/hodgef/simple-keyboard/blob/master/src/demo/App.js).

## Usage with CDN

### html

````html
<html>
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/simple-keyboard@latest/build/css/index.css">
</head>

<body>
  <input class="input" placeholder="Tap on the virtual keyboard to start" />
  <div class="simple-keyboard"></div>

  <script src="https://cdn.jsdelivr.net/npm/simple-keyboard@latest/build/index.min.js"></script>
  <script src="src/index.js"></script>
</body>

</html>
````

### js (index.js)

````js
let Keyboard = window.SimpleKeyboard.default;

let myKeyboard = new Keyboard({
  onChange: input => onChange(input),
  onKeyPress: button => onKeyPress(button)
});

function onChange(input) {
  document.querySelector(".input").value = input;
  console.log("Input changed", input);
}

function onKeyPress(button) {
  console.log("Button pressed", button);
}
````

[![Edit 6n0wzxjmjk](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/6n0wzxjmjk)

## Options

You can customize the Keyboard by passing options to it.
Here are the available options (the code examples are the defaults):

### layout

> Modify the keyboard layout

```js
layout: {
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
}
```

> Looking for keyboard layouts in other languages? **Check out [simple-keyboard-layouts](https://github.com/hodgef/simple-keyboard-layouts) !**

### layoutName

> Specifies which layout should be used.

```js
layoutName: "default"
```

### display

> Replaces variable buttons (such as `{bksp}`) with a human-friendly name (e.g.: "backspace").

```js
display: {
  '{bksp}': 'backspace',
  '{enter}': '< enter',
  '{shift}': 'shift',
  '{s}': 'shift',
  '{tab}': 'tab',
  '{lock}': 'caps',
  '{accept}': 'Submit',
  '{space}': ' ',
  '{//}': ' '
}
```

### theme

> A prop to add your own css classes _to the keyboard wrapper_. You can add multiple classes separated by a space.

```js
theme: "hg-theme-default"
```

### buttonTheme

> A prop to add your own css classes _to one or several buttons_. You can add multiple classes separated by a space.

```js
buttonTheme: [
  {
    class: "myCustomClass",
    buttons: "Q W E R T Y q w e r t y"
  },
  {
    class: "anotherCustomClass",
    buttons: "Q q"
  },
  ...
]
```

[![Edit simple-keyboard customization demo - npm](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/vj8jvz2q4l?module=%2Fsrc%2Findex.js)


### debug

> Runs a console.log every time a key is pressed. Displays the buttons pressed and the current input.

```js
debug: false
```

### newLineOnEnter

> Specifies whether clicking the "ENTER" button will input a newline (`\n`) or not.

```js
newLineOnEnter: false
```

### inputName

> Allows you to use a single simple-keyboard instance for several inputs. 

```js
inputName: "default"
```

### onKeyPress

> Executes the callback function on key press. Returns button layout name (i.e.: "{shift}").

```js
onKeyPress: (button) => console.log(button)
```

### onChange

> Executes the callback function on input change. Returns the current input's string.

```js
onChange: (input) => console.log(input)
```

### onChangeAll

> Executes the callback function on input change. Returns the input object with all defined inputs. This is useful if you're handling several inputs with simple-keyboard, as specified in the "*[Using several inputs](#using-several-inputs)*" guide.

```js
onChangeAll: (inputs) => console.log(inputs)
```

## Methods

simple-keyboard has a few methods you can use to further control it's behavior.
To access these functions, you need the instance the simple-keyboard component, like so:

```js
var keyboard = new Keyboard({
  ...
});
/>

// Then, use as follows...
keyboard.methodName(params);
```

### clearInput

> Clear the keyboard's input.

```js
// For default input (i.e. if you have only one)
keyboard.clearInput();

// For specific input
// Must have been previously set using the "inputName" prop.
keyboard.clearInput("inputName");
```

### getInput

> Get the keyboard's input (You can also get it from the _onChange_ prop).

```js
// For default input (i.e. if you have only one)
let input = keyboard.getInput();

// For specific input
// Must have been previously set using the "inputName" prop.
let input = keyboard.getInput("inputName");
```

### setInput

> Set the keyboard's input. Useful if you want to track input changes made outside simple-keyboard.

```js
// For default input (i.e. if you have only one)
keyboard.setInput("Hello World!");

// For specific input
// Must have been previously set using the "inputName" prop.
keyboard.setInput("Hello World!", "inputName");
```

### setOptions

> Set new option or modify existing ones after initialization. The changes are applied immediately.

```js
keyboard.setOptions({
  theme: "my-custom-theme"
});
```

## Use-cases

### Using several inputs

Set the *[inputName](#inputname)* option for each input you want to handle with simple-keyboard.

For example:

```html
  <input class="input" id="input1" value=""/>
  <input class="input" id="input2" value=""/>
```

```js
  // Here we'll store the input id that simple-keyboard will be using.
  var selectedInput;

  // Initialize simple-keyboard as usual
  var keyboard = new Keyboard({
    onChange: input => onChange(input)
  });

  // Add an event listener for the inputs to be tracked
  document.querySelectorAll('.input')
    .forEach(input => input.addEventListener('focus', onInputFocus));

  /**
   * When an input is focused, it will be marked as selected (selectedInput)
   * This is so we can replace it's value on the onChange function
   *
   * Also, we will set the inputName option to a unique string identifying the input (id)
   * simple-keyboard save the input in this key and report changes through onChange
   */
  onInputFocus = event => {
    // Setting input as selected
    selectedInput = `#${event.target.id}`;

    // Set the inputName option on the fly !
    keyboard.setOptions({
      inputName: event.target.id
    });
  }

  // When the current input is changed, this is called
  onChange = input => {
    // If the input is not defined, grabbing the first ".input".
    let currentInput = selectedInput || '.input';

    // Updating the selected input's value
    document.querySelector(currentInput).value = input;
  }

```

> [See full example](https://github.com/hodgef/simple-keyboard/blob/master/src/demo/MultipleInputsDemo.js).

[![Edit simple-keyboard multiple inputs demo - npm](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/43nm6v4xyx?module=%2Fsrc%2Findex.js)

### Having keys in a different language configuration

There's a number of key layouts available. To apply them, check out [simple-keyboard-layouts](https://github.com/hodgef/simple-keyboard-layouts).

<a href="https://github.com/hodgef/simple-keyboard-layouts" title="simple-keyboard-layouts repository"><img src="https://franciscohodge.com/project-pages/simple-keyboard/images/simple-keyboard-banner3layouts.png" align="center"></a>

If you'd like to contribute your own layouts, please submit your pull request at the simple-keyboard-layouts repository.

## Demo

[https://franciscohodge.com/simple-keyboard/demo](https://franciscohodge.com/simple-keyboard/demo)

[![Edit krzkx19rr](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/krzkx19rr)

### To run demo on your own computer

* Clone this repository
* `npm install`
* `npm start`
* Visit [http://localhost:3000/](http://localhost:3000/)

### Other versions

* ReactJS - [react-simple-keyboard](https://github.com/hodgef/react-simple-keyboard)

## Contributing

PR's and issues are welcome. Feel free to submit any issues you have at:
[https://github.com/hodgef/simple-keyboard/issues](https://github.com/hodgef/simple-keyboard/issues)
