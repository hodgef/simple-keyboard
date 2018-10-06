[![npm version](https://badge.fury.io/js/simple-keyboard.svg)](https://www.npmjs.com/package/simple-keyboard)
[![](https://data.jsdelivr.com/v1/package/npm/simple-keyboard/badge)](https://www.jsdelivr.com/package/npm/simple-keyboard)

<a href="https://franciscohodge.com/simple-keyboard/demo" title="View Demo" target="_blank"><img src="https://franciscohodge.com/project-pages/simple-keyboard/images/simplekeyboard-banner_B.png" align="center" width="100%"></a>
<a href="https://franciscohodge.com/simple-keyboard/demo" title="View Demo" target="_blank"><img src="https://franciscohodge.com/project-pages/simple-keyboard/images/simple-keyboard-240-demo-2.gif" align="center" width="100%"></a>

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
  onChange: input => onChange(input),
  onKeyPress: button => onKeyPress(button)
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
  ...
}
```

### mergeDisplay

By default, when you set the `display` property, you replace the default one. This setting merges them instead.

```js
mergeDisplay: true,

display: {
  '{bksp}': 'delete',
  '{enter}': 'submit',
}

// Result:
{
  '{bksp}': 'delete'
  '{enter}': 'submit',
  '{shift}': 'shift', // < Merged from default among others
  ....
}
```

### theme

> A prop to add your own css classes _to the keyboard wrapper_. You can add multiple classes separated by a space.

```js
theme: "hg-theme-default"
```

### buttonTheme

A prop to add your own css classes _to one or several buttons_.

To add or remove individual `buttonTheme` entries, check out the methods `addButtonTheme` and `removeButtonTheme` below.

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

### tabCharOnTab

> Specifies whether clicking the "TAB" button will input a tab character (`\t`) or not.

```js
tabCharOnTab: true
```

### inputName

> Allows you to use a single simple-keyboard instance for several inputs.

```js
inputName: "default"
```

[![Edit simple-keyboard multiple inputs demo - npm](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/43nm6v4xyx?module=%2Fsrc%2Findex.js)

### maxLength

> Restrains simple-keyboard's input to a certain length. This should be used in addition to the input element's `maxlength` attribute.

```js
// Applies to all internal inputs
maxLength: 5

// Specifies different limiters for each input set, in case you are using the "inputName" option
maxLength: {
  'default': 5,
  'myFancyInput': 10
}
```

[![Edit simple-keyboard maxLength demo - npm](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/7wk625q650?module=%2Fsrc%2Findex.js)

### syncInstanceInputs

> When set to true, this option synchronizes the internal input of every simple-keyboard instance.

```js
syncInstanceInputs: false
```

### physicalKeyboardHighlight

Enable highlighting of keys pressed on physical keyboard.

For functional keys such as `shift`, note that the key's `event.code` is used. In that instance, pressing the left key will result in the code `ShiftLeft`. Therefore, the key must be named `{shiftleft}`.
[Click here](https://github.com/hodgef/simple-keyboard/blob/master/src/lib/services/Utilities.js#L58) for some of keys supported out of the box.

[![Edit simple-keyboard extended  full keyboard demo - cdn (Experimental)](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/nrxrn5kprp?module=%2Fsrc%2Findex.js)

If in doubt, you can also set the `debug` option to `true` to see the key events.

```js
physicalKeyboardHighlight: true
```

### physicalKeyboardHighlightTextColor

Define the text color that the physical keyboard highlighted key should have. Used when `physicalKeyboardHighlight` is set to true.

```js
physicalKeyboardHighlightTextColor: "white"
```

### physicalKeyboardHighlightBgColor

Define the background color that the physical keyboard highlighted key should have. Used when `physicalKeyboardHighlight` is set to true.

```js
physicalKeyboardHighlightBgColor: "#9ab4d0"
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

### onRender

> Executes the callback function every time simple-keyboard is rendered (e.g: when you change layouts).

```js
onRender: () => console.log("simple-keyboard refreshed")
```

### onInit

> Executes the callback function once simple-keyboard is rendered for the first time (on initialization).

```js
onInit: () => console.log("simple-keyboard initialized")
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
keyboard.clearInput("myInputName");
```

### getInput

> Get the keyboard's input (You can also get it from the _onChange_ prop).

```js
// For default input (i.e. if you have only one)
let input = keyboard.getInput();

// For specific input
// Must have been previously set using the "inputName" prop.
let input = keyboard.getInput("myInputName");
```

### setInput

> Set the keyboard's input. Useful if you want to track input changes made outside simple-keyboard.

```js
// For default input (i.e. if you have only one)
keyboard.setInput("Hello World!");

// For specific input
// Must have been previously set using the "inputName" prop.
keyboard.setInput("Hello World!", "myInputName");
```

### setOptions

> Set new option or modify existing ones after initialization. The changes are applied immediately.

```js
keyboard.setOptions({
  theme: "my-custom-theme"
});
```

### dispatch

> Send a command to all simple-keyboard instances at once (if you have multiple instances).

```js
keyboard.dispatch(instance => {
  instance.setOptions({
    buttonTheme: [
      {
        class: "myClass",
        buttons: `a b c`
      }
    ]
  })
});
```

### getButtonElement

> Get the DOM Element of a button. If there are several buttons with the same name, an array of the DOM Elements is returned.

```js
this.keyboard.getButtonElement('a'); // Gets the "a" key as per your layout
this.keyboard.getButtonElement('{shift}') // Gets all keys with that name in an array
```

[![Edit simple-keyboard getButtonElement demo - npm](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/ppol6ok7nq?module=%2Fsrc%2Findex.js)

### addButtonTheme

Adds an entry to the `buttonTheme`. Basically a way to add a class to a button.

Unlike the `buttonTheme` property, which replaces entries, `addButtonTheme` creates entries or modifies existing ones.

```js
this.keyboard.addButtonTheme("a b c {enter}", "myClass1 myClass2");
```

### removeButtonTheme

Removes an entry to the `buttonTheme`. Basically a way to remove a class previously added to a button through `buttonTheme` or `addButtonTheme`.

Unlike the `buttonTheme` property, which replaces entries, `removeButtonTheme` removes entries or modifies existing ones.

```js
this.keyboard.removeButtonTheme("b c", "myClass1 myClass2");
```

[![Edit simple-keyboard dispatch demo - npm](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/rjnlp4pp2q?module=%2Fsrc%2Findex.js)

## Q&A / Use-cases

### How to give a different base class to my keyboard

As you may have seen on the code samples, this is the default setup that simple-keyboard uses:

```html
  <div class="simple-keyboard"></div>
```

```js
let keyboard = new Keyboard({
  // Add options here
});
```

You can however change this by setting up simple-keyboard like so:

```html
  <div class="myFavouriteClass"></div>
```

```js
let keyboard = new Keyboard(".myFavouriteClass", {
  // Add options here
});
```

This can come in handy especially when dealing with multiple simple keyboard instances.

### How to syncronize multiple instances of simple-keyboard

As shown above, you can run multiple instances of simple-keyboard. To keep their internal inputs in sync, set the *[syncInstanceInputs](#syncinstanceinputs)* option to `true`.

If you want to send a command to all your simple-keyboard instances at once, you can use the *[dispatch](#dispatch)* method.

Here's a demo with both these features in action:

[![Edit simple-keyboard dispatch demo - npm](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/rjnlp4pp2q?module=%2Fsrc%2Findex.js)

Here's an example of a full keyboard made out of multiple simple-keyboard instances:

[![Edit simple-keyboard extended keyboard demo - cdn (Experimental)](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/nrxrn5kprp?module=%2Fsrc%2Findex.js)

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

If you'd like to contribute your own layouts, please submit your pull request at the simple-keyboard-layouts repository.

### How to customize my keyboard layout

If you'd like to create a layout in a language not currently supported by [simple-keyboard-layouts](https://github.com/hodgef/simple-keyboard-layouts), you definitely can.

Take following demo as an example:

[![Edit Use-case: simple-keyboard layout customization demo - cdn](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/v388k9zvk0?module=%2Fsrc%2Findex.js)

If you have issues displaying a character, you might need its unicode code to display it. Here an useful converter tool:

[r12a Unicode converter](https://r12a.github.io/app-conversion/)

### Why is the caps lock button working like shift button

For the sake of simplicity, caps lock and shift do the same action in the main demos.
If you'd like to show a different layout when you press caps lock, check out the following demo:

[![Edit simple-keyboard handling shift and caps lock demo - npm](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/l3n84qn5oq?module=%2Fsrc%2Findex.js)

### How to display a full keyboard

You can display a full keyboard by linking together multiple Simple Keyboard instances.
This is because you might want different sections of your keyboard to have different spacing and styling.

Please refer to the documentation on the *[syncInstanceInputs](#syncInstanceInputs)* option, which allows you to sync the input of all your simple-keyboard instances.

Also, check out this demo:

[![Edit simple-keyboard extended keyboard demo - cdn (Experimental)](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/0ywkn0k7pp?module=%2Fsrc%2Findex.js)

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
