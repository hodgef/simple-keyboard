/*!
 * 
 *   simple-keyboard v2.15.5 (Non-minified build)
 *   https://github.com/hodgef/simple-keyboard
 * 
 *   Copyright (c) Francisco Hodge (https://github.com/hodgef)
 * 
 *   This source code is licensed under the MIT license found in the
 *   LICENSE file in the root directory of this source tree.
 *   
 */
(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === "object" && typeof module === "object") {
    module.exports = factory();
  } else if (typeof define === "function" && define.amd) {
    define("SimpleKeyboard", [], factory);
  } else if (typeof exports === "object") {
    exports["SimpleKeyboard"] = factory();
  } else {
    root["SimpleKeyboard"] = factory();
  }
})(window, function() {
  /******/
  return function(modules) {
    // webpackBootstrap
    /******/ // The module cache
    /******/ var installedModules = {};
    /******/
    /******/ // The require function
    /******/    function __webpack_require__(moduleId) {
      /******/
      /******/ // Check if module is in cache
      /******/ if (installedModules[moduleId]) {
        /******/ return installedModules[moduleId].exports;
        /******/      }
      /******/ // Create a new module (and put it into the cache)
      /******/      var module = installedModules[moduleId] = {
        /******/ i: moduleId,
        /******/ l: false,
        /******/ exports: {}
        /******/      };
      /******/
      /******/ // Execute the module function
      /******/      modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
      /******/
      /******/ // Flag the module as loaded
      /******/      module.l = true;
      /******/
      /******/ // Return the exports of the module
      /******/      return module.exports;
      /******/    }
    /******/
    /******/
    /******/ // expose the modules object (__webpack_modules__)
    /******/    __webpack_require__.m = modules;
    /******/
    /******/ // expose the module cache
    /******/    __webpack_require__.c = installedModules;
    /******/
    /******/ // define getter function for harmony exports
    /******/    __webpack_require__.d = function(exports, name, getter) {
      /******/ if (!__webpack_require__.o(exports, name)) {
        /******/ Object.defineProperty(exports, name, {
          enumerable: true,
          get: getter
        });
        /******/      }
      /******/    };
    /******/
    /******/ // define __esModule on exports
    /******/    __webpack_require__.r = function(exports) {
      /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        /******/ Object.defineProperty(exports, Symbol.toStringTag, {
          value: "Module"
        });
        /******/      }
      /******/      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      /******/    };
    /******/
    /******/ // create a fake namespace object
    /******/ // mode & 1: value is a module id, require it
    /******/ // mode & 2: merge all properties of value into the ns
    /******/ // mode & 4: return value when already ns object
    /******/ // mode & 8|1: behave like require
    /******/    __webpack_require__.t = function(value, mode) {
      /******/ if (mode & 1) {
        value = __webpack_require__(value);
        /******/      }
      if (mode & 8) {
        return value;
        /******/      }
      if (mode & 4 && typeof value === "object" && value && value.__esModule) {
        return value;
        /******/      }
      var ns = Object.create(null);
      /******/      __webpack_require__.r(ns);
      /******/      Object.defineProperty(ns, "default", {
        enumerable: true,
        value: value
      });
      /******/      if (mode & 2 && typeof value != "string") {
        for (var key in value) {
          __webpack_require__.d(ns, key, function(key) {
            return value[key];
          }.bind(null, key));
          /******/        }
      }
      return ns;
      /******/    };
    /******/
    /******/ // getDefaultExport function for compatibility with non-harmony modules
    /******/    __webpack_require__.n = function(module) {
      /******/ var getter = module && module.__esModule ? 
      /******/ function getDefault() {
        return module["default"];
      } : 
      /******/ function getModuleExports() {
        return module;
      };
      /******/      __webpack_require__.d(getter, "a", getter);
      /******/      return getter;
      /******/    };
    /******/
    /******/ // Object.prototype.hasOwnProperty.call
    /******/    __webpack_require__.o = function(object, property) {
      return Object.prototype.hasOwnProperty.call(object, property);
    };
    /******/
    /******/ // __webpack_public_path__
    /******/    __webpack_require__.p = "";
    /******/
    /******/
    /******/ // Load entry module and return exports
    /******/    return __webpack_require__(__webpack_require__.s = 0);
    /******/  }
  /************************************************************************/
  /******/ ([ 
  /* 0 */
  /***/ function(module, exports, __webpack_require__) {
    module.exports = __webpack_require__(2);
    /***/  }, 
  /* 1 */
  /***/ function(module, exports, __webpack_require__) {
    // extracted by mini-css-extract-plugin
    /***/}, 
  /* 2 */
  /***/ function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    // EXTERNAL MODULE: ./src/lib/components/Keyboard.css
        var Keyboard = __webpack_require__(1);
    // CONCATENATED MODULE: ./src/lib/services/PhysicalKeyboard.js
        function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) {
          descriptor.writable = true;
        }
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) {
        _defineProperties(Constructor.prototype, protoProps);
      }
      if (staticProps) {
        _defineProperties(Constructor, staticProps);
      }
      return Constructor;
    }
    /**
 * Physical Keyboard Service
 */    var PhysicalKeyboard = /* */ function() {
      /**
   * Creates an instance of the PhysicalKeyboard service
   */ function PhysicalKeyboard(simpleKeyboardInstance) {
        _classCallCheck(this, PhysicalKeyboard);
        /**
     * @type {object} A simple-keyboard instance
     */        this.simpleKeyboardInstance = simpleKeyboardInstance;
        /**
     * Bindings
     */        this.initKeyboardListener = this.initKeyboardListener.bind(this);
        this.getSimpleKeyboardLayoutKey = this.getSimpleKeyboardLayoutKey.bind(this);
        /**
     * Initialize key listeners
     */        this.initKeyboardListener();
      }
      /**
   * Initializes key event listeners
   */      _createClass(PhysicalKeyboard, [ {
        key: "initKeyboardListener",
        value: function initKeyboardListener() {
          var _this = this;
 // Adding button style on keydown
                    document.addEventListener("keydown", function(event) {
            if (_this.simpleKeyboardInstance.options.physicalKeyboardHighlight) {
              var buttonPressed = _this.getSimpleKeyboardLayoutKey(event);
              _this.simpleKeyboardInstance.dispatch(function(instance) {
                var buttonDOM = instance.getButtonElement(buttonPressed) || instance.getButtonElement("{".concat(buttonPressed, "}"));
                if (buttonDOM) {
                  buttonDOM.style.backgroundColor = _this.simpleKeyboardInstance.options.physicalKeyboardHighlightBgColor || "#9ab4d0";
                  buttonDOM.style.color = _this.simpleKeyboardInstance.options.physicalKeyboardHighlightTextColor || "white";
                }
              });
            }
          });
 // Removing button style on keyup
                    document.addEventListener("keyup", function(event) {
            if (_this.simpleKeyboardInstance.options.physicalKeyboardHighlight) {
              var buttonPressed = _this.getSimpleKeyboardLayoutKey(event);
              _this.simpleKeyboardInstance.dispatch(function(instance) {
                var buttonDOM = instance.getButtonElement(buttonPressed) || instance.getButtonElement("{".concat(buttonPressed, "}"));
                if (buttonDOM && buttonDOM.removeAttribute) {
                  buttonDOM.removeAttribute("style");
                }
              });
            }
          });
        }
        /**
   * Transforms a KeyboardEvent's "key.code" string into a simple-keyboard layout format
   * @param  {object} event The KeyboardEvent
   */      }, {
        key: "getSimpleKeyboardLayoutKey",
        value: function getSimpleKeyboardLayoutKey(event) {
          var output;
          if (event.code.includes("Numpad") || event.code.includes("Shift") || event.code.includes("Space") || event.code.includes("Backspace") || event.code.includes("Control") || event.code.includes("Alt") || event.code.includes("Meta")) {
            output = event.code;
          } else {
            output = event.key;
          }
          /**
     * If button is not uppercase, casting to lowercase
     */          if (output !== output.toUpperCase() || event.code[0] === "F" && Number.isInteger(Number(event.code[1])) && event.code.length <= 3) {
            output = output.toLowerCase();
          }
          return output;
        }
      } ]);
      return PhysicalKeyboard;
    }();
 /* harmony default export */    var services_PhysicalKeyboard = PhysicalKeyboard;
    // CONCATENATED MODULE: ./src/lib/services/KeyboardLayout.js
        function KeyboardLayout_classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function KeyboardLayout_defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) {
          descriptor.writable = true;
        }
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    function KeyboardLayout_createClass(Constructor, protoProps, staticProps) {
      if (protoProps) {
        KeyboardLayout_defineProperties(Constructor.prototype, protoProps);
      }
      if (staticProps) {
        KeyboardLayout_defineProperties(Constructor, staticProps);
      }
      return Constructor;
    }
    /**
 * Keyboard Layout Service
 */    var KeyboardLayout = /* */ function() {
      function KeyboardLayout() {
        KeyboardLayout_classCallCheck(this, KeyboardLayout);
      }
      KeyboardLayout_createClass(KeyboardLayout, null, [ {
        key: "getDefaultLayout",
        /**
   * Get default simple-keyboard layout
   * @return {object} The default layout (US-QWERTY)
   */ value: function getDefaultLayout() {
          return {
            default: [ "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}", "{tab} q w e r t y u i o p [ ] \\", "{lock} a s d f g h j k l ; ' {enter}", "{shift} z x c v b n m , . / {shift}", ".com @ {space}" ],
            shift: [ "~ ! @ # $ % ^ & * ( ) _ + {bksp}", "{tab} Q W E R T Y U I O P { } |", '{lock} A S D F G H J K L : " {enter}', "{shift} Z X C V B N M < > ? {shift}", ".com @ {space}" ]
          };
        }
      } ]);
      return KeyboardLayout;
    }();
 /* harmony default export */    var services_KeyboardLayout = KeyboardLayout;
    // CONCATENATED MODULE: ./src/lib/services/Utilities.js
        function _typeof(obj) {
      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof(obj) {
          return typeof obj;
        };
      } else {
        _typeof = function _typeof(obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
      }
      return _typeof(obj);
    }
    function Utilities_classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function Utilities_defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) {
          descriptor.writable = true;
        }
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    function Utilities_createClass(Constructor, protoProps, staticProps) {
      if (protoProps) {
        Utilities_defineProperties(Constructor.prototype, protoProps);
      }
      if (staticProps) {
        Utilities_defineProperties(Constructor, staticProps);
      }
      return Constructor;
    }
    /**
 * Utility Service
 */    var Utilities = /* */ function() {
      /**
   * Creates an instance of the Utility service
   */ function Utilities(simpleKeyboardInstance) {
        Utilities_classCallCheck(this, Utilities);
        /**
     * @type {object} A simple-keyboard instance
     */        this.simpleKeyboardInstance = simpleKeyboardInstance;
        /**
     * Bindings
     */        this.getButtonClass = this.getButtonClass.bind(this);
        this.getButtonDisplayName = this.getButtonDisplayName.bind(this);
        this.getUpdatedInput = this.getUpdatedInput.bind(this);
        this.updateCaretPos = this.updateCaretPos.bind(this);
        this.updateCaretPosAction = this.updateCaretPosAction.bind(this);
        this.isMaxLengthReached = this.isMaxLengthReached.bind(this);
        this.camelCase = this.camelCase.bind(this);
        this.countInArray = this.countInArray.bind(this);
      }
      /**
   * Adds default classes to a given button
   *
   * @param  {string} button The button's layout name
   * @return {string} The classes to be added to the button
   */      Utilities_createClass(Utilities, [ {
        key: "getButtonClass",
        value: function getButtonClass(button) {
          var buttonTypeClass = button.includes("{") && button.includes("}") && button !== "{//}" ? "functionBtn" : "standardBtn";
          var buttonWithoutBraces = button.replace("{", "").replace("}", "");
          var buttonNormalized = "";
          if (buttonTypeClass !== "standardBtn") {
            buttonNormalized = " hg-button-".concat(buttonWithoutBraces);
          }
          return "hg-".concat(buttonTypeClass).concat(buttonNormalized);
        }
        /**
   * Default button display labels
   */      }, {
        key: "getDefaultDiplay",
        value: function getDefaultDiplay() {
          return {
            "{bksp}": "backspace",
            "{backspace}": "backspace",
            "{enter}": "< enter",
            "{shift}": "shift",
            "{shiftleft}": "shift",
            "{shiftright}": "shift",
            "{alt}": "alt",
            "{s}": "shift",
            "{tab}": "tab",
            "{lock}": "caps",
            "{capslock}": "caps",
            "{accept}": "Submit",
            "{space}": " ",
            "{//}": " ",
            "{esc}": "esc",
            "{escape}": "esc",
            "{f1}": "f1",
            "{f2}": "f2",
            "{f3}": "f3",
            "{f4}": "f4",
            "{f5}": "f5",
            "{f6}": "f6",
            "{f7}": "f7",
            "{f8}": "f8",
            "{f9}": "f9",
            "{f10}": "f10",
            "{f11}": "f11",
            "{f12}": "f12",
            "{numpaddivide}": "/",
            "{numlock}": "lock",
            "{arrowup}": "↑",
            "{arrowleft}": "←",
            "{arrowdown}": "↓",
            "{arrowright}": "→",
            "{prtscr}": "print",
            "{scrolllock}": "scroll",
            "{pause}": "pause",
            "{insert}": "ins",
            "{home}": "home",
            "{pageup}": "up",
            "{delete}": "del",
            "{end}": "end",
            "{pagedown}": "down",
            "{numpadmultiply}": "*",
            "{numpadsubtract}": "-",
            "{numpadadd}": "+",
            "{numpadenter}": "enter",
            "{period}": ".",
            "{numpaddecimal}": ".",
            "{numpad0}": "0",
            "{numpad1}": "1",
            "{numpad2}": "2",
            "{numpad3}": "3",
            "{numpad4}": "4",
            "{numpad5}": "5",
            "{numpad6}": "6",
            "{numpad7}": "7",
            "{numpad8}": "8",
            "{numpad9}": "9"
          };
        }
        /**
   * Returns the display (label) name for a given button
   *
   * @param  {string} button The button's layout name
   * @param  {object} display The provided display option
   * @param  {boolean} mergeDisplay Whether the provided param value should be merged with the default one.
   */      }, {
        key: "getButtonDisplayName",
        value: function getButtonDisplayName(button, display, mergeDisplay) {
          if (mergeDisplay) {
            display = Object.assign({}, this.getDefaultDiplay(), display);
          } else {
            display = display || this.getDefaultDiplay();
          }
          return display[button] || button;
        }
        /**
   * Returns the updated input resulting from clicking a given button
   *
   * @param  {string} button The button's layout name
   * @param  {string} input The input string
   * @param  {object} options The simple-keyboard options object
   * @param  {number} caretPos The cursor's current position
   * @param  {boolean} moveCaret Whether to update simple-keyboard's cursor
   */      }, {
        key: "getUpdatedInput",
        value: function getUpdatedInput(button, input, options, caretPos, moveCaret) {
          var output = input;
          if ((button === "{bksp}" || button === "{backspace}") && output.length > 0) {
            output = this.removeAt(output, caretPos, moveCaret);
          } else if (button === "{space}") {
            output = this.addStringAt(output, " ", caretPos, moveCaret);
          } else if (button === "{tab}" && !(typeof options.tabCharOnTab === "boolean" && options.tabCharOnTab === false)) {
            output = this.addStringAt(output, "\t", caretPos, moveCaret);
          } else if ((button === "{enter}" || button === "{numpadenter}") && options.newLineOnEnter) {
            output = this.addStringAt(output, "\n", caretPos, moveCaret);
          } else if (button.includes("numpad") && Number.isInteger(Number(button[button.length - 2]))) {
            output = this.addStringAt(output, button[button.length - 2], caretPos, moveCaret);
          } else if (button === "{numpaddivide}") {
            output = this.addStringAt(output, "/", caretPos, moveCaret);
          } else if (button === "{numpadmultiply}") {
            output = this.addStringAt(output, "*", caretPos, moveCaret);
          } else if (button === "{numpadsubtract}") {
            output = this.addStringAt(output, "-", caretPos, moveCaret);
          } else if (button === "{numpadadd}") {
            output = this.addStringAt(output, "+", caretPos, moveCaret);
          } else if (button === "{numpaddecimal}") {
            output = this.addStringAt(output, ".", caretPos, moveCaret);
          } else if (button === "{" || button === "}") {
            output = this.addStringAt(output, button, caretPos, moveCaret);
          } else if (!button.includes("{") && !button.includes("}")) {
            output = this.addStringAt(output, button, caretPos, moveCaret);
          }
          return output;
        }
        /**
   * Moves the cursor position by a given amount
   *
   * @param  {number} length Represents by how many characters the input should be moved
   * @param  {boolean} minus Whether the cursor should be moved to the left or not.
   */      }, {
        key: "updateCaretPos",
        value: function updateCaretPos(length, minus) {
          var newCaretPos = this.updateCaretPosAction(this.simpleKeyboardInstance, length, minus);
          if (this.simpleKeyboardInstance.options.syncInstanceInputs) {
            this.simpleKeyboardInstance.dispatch(function(instance) {
              instance.caretPosition = newCaretPos;
            });
          }
        }
        /**
   * Action method of updateCaretPos
   *
   * @param  {object} instance The instance whose position should be updated
   * @param  {number} length Represents by how many characters the input should be moved
   * @param  {boolean} minus Whether the cursor should be moved to the left or not.
   */      }, {
        key: "updateCaretPosAction",
        value: function updateCaretPosAction(instance, length, minus) {
          if (minus) {
            if (instance.caretPosition > 0) {
              instance.caretPosition = instance.caretPosition - length;
            }
          } else {
            instance.caretPosition = instance.caretPosition + length;
          }
          if (this.simpleKeyboardInstance.options.debug) {
            console.log("Caret at:", instance.caretPosition, "(".concat(instance.keyboardDOMClass, ")"));
          }
          return instance.caretPosition;
        }
        /**
   * Adds a string to the input at a given position
   *
   * @param  {string} source The source input
   * @param  {string} string The string to add
   * @param  {number} position The (cursor) position where the string should be added
   * @param  {boolean} moveCaret Whether to update simple-keyboard's cursor
   */      }, {
        key: "addStringAt",
        value: function addStringAt(source, string, position, moveCaret) {
          var output;
          if (!position && position !== 0) {
            output = source + string;
          } else {
            output = [ source.slice(0, position), string, source.slice(position) ].join("");
            /**
       * Avoid caret position change when maxLength is set
       */            if (!this.isMaxLengthReached()) {
              if (moveCaret) {
                this.updateCaretPos(string.length);
              }
            }
          }
          return output;
        }
        /**
   * Removes an amount of characters at a given position
   *
   * @param  {string} source The source input
   * @param  {number} position The (cursor) position from where the characters should be removed
   * @param  {boolean} moveCaret Whether to update simple-keyboard's cursor
   */      }, {
        key: "removeAt",
        value: function removeAt(source, position, moveCaret) {
          if (this.simpleKeyboardInstance.caretPosition === 0) {
            return source;
          }
          var output;
          var prevTwoChars;
          var emojiMatched;
          var emojiMatchedReg = /([\uD800-\uDBFF][\uDC00-\uDFFF])/g;
          /**
     * Emojis are made out of two characters, so we must take a custom approach to trim them.
     * For more info: https://mathiasbynens.be/notes/javascript-unicode
     */          if (position && position >= 0) {
            prevTwoChars = source.substring(position - 2, position);
            emojiMatched = prevTwoChars.match(emojiMatchedReg);
            if (emojiMatched) {
              output = source.substr(0, position - 2) + source.substr(position);
              if (moveCaret) {
                this.updateCaretPos(2, true);
              }
            } else {
              output = source.substr(0, position - 1) + source.substr(position);
              if (moveCaret) {
                this.updateCaretPos(1, true);
              }
            }
          } else {
            prevTwoChars = source.slice(-2);
            emojiMatched = prevTwoChars.match(emojiMatchedReg);
            if (emojiMatched) {
              output = source.slice(0, -2);
              if (moveCaret) {
                this.updateCaretPos(2, true);
              }
            } else {
              output = source.slice(0, -1);
              if (moveCaret) {
                this.updateCaretPos(1, true);
              }
            }
          }
          return output;
        }
        /**
   * Determines whether the maxLength has been reached. This function is called when the maxLength option it set.
   *
   * @param  {object} inputObj
   * @param  {object} options
   * @param  {string} updatedInput
   */      }, {
        key: "handleMaxLength",
        value: function handleMaxLength(inputObj, options, updatedInput) {
          var maxLength = options.maxLength;
          var currentInput = inputObj[options.inputName];
          var condition = currentInput.length === maxLength;
          if (
          /**
       * If pressing this button won't add more characters
       * We exit out of this limiter function
       */ updatedInput.length <= currentInput.length) {
            return false;
          }
          if (Number.isInteger(maxLength)) {
            if (options.debug) {
              console.log("maxLength (num) reached:", condition);
            }
            if (condition) {
              /**
         * @type {boolean} Boolean value that shows whether maxLength has been reached
         */ this.maxLengthReached = true;
              return true;
            } else {
              this.maxLengthReached = false;
              return false;
            }
          }
          if (_typeof(maxLength) === "object") {
            var _condition = currentInput.length === maxLength[options.inputName];
            if (options.debug) {
              console.log("maxLength (obj) reached:", _condition);
            }
            if (_condition) {
              this.maxLengthReached = true;
              return true;
            } else {
              this.maxLengthReached = false;
              return false;
            }
          }
        }
        /**
   * Gets the current value of maxLengthReached
   */      }, {
        key: "isMaxLengthReached",
        value: function isMaxLengthReached() {
          return Boolean(this.maxLengthReached);
        }
        /**
   * Transforms an arbitrary string to camelCase
   *
   * @param  {string} string The string to transform.
   */      }, {
        key: "camelCase",
        value: function camelCase(string) {
          return string.toLowerCase().trim().split(/[.\-_\s]/g).reduce(function(string, word) {
            return word.length ? string + word[0].toUpperCase() + word.slice(1) : string;
          });
        }
        /**
   * Counts the number of duplicates in a given array
   *
   * @param  {Array} array The haystack to search in
   * @param  {string} value The needle to search for
   */      }, {
        key: "countInArray",
        value: function countInArray(array, value) {
          return array.reduce(function(n, x) {
            return n + (x === value);
          }, 0);
        }
      } ]);
      return Utilities;
    }();
 /* harmony default export */    var services_Utilities = Utilities;
    // CONCATENATED MODULE: ./src/lib/components/Keyboard.js
        function Keyboard_typeof(obj) {
      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        Keyboard_typeof = function _typeof(obj) {
          return typeof obj;
        };
      } else {
        Keyboard_typeof = function _typeof(obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
      }
      return Keyboard_typeof(obj);
    }
    function Keyboard_classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function Keyboard_defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) {
          descriptor.writable = true;
        }
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    function Keyboard_createClass(Constructor, protoProps, staticProps) {
      if (protoProps) {
        Keyboard_defineProperties(Constructor.prototype, protoProps);
      }
      if (staticProps) {
        Keyboard_defineProperties(Constructor, staticProps);
      }
      return Constructor;
    }
    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }
      return obj;
    }
 // Services
    /**
 * Root class for simple-keyboard
 * This class:
 * - Parses the options
 * - Renders the rows and buttons
 * - Handles button functionality
 */    var Keyboard_SimpleKeyboard = /* */ function() {
      /**
   * Creates an instance of SimpleKeyboard
   * @param {Array} params If first parameter is a string, it is considered the container class. The second parameter is then considered the options object. If first parameter is an object, it is considered the options object.
   */ function SimpleKeyboard() {
        var _this = this;
        Keyboard_classCallCheck(this, SimpleKeyboard);
        _defineProperty(this, "setOptions", function(option) {
          option = option || {};
          _this.options = Object.assign(_this.options, option);
          _this.render();
        });
        _defineProperty(this, "registerModule", function(name, initCallback) {
          if (!_this.modules[name]) {
            _this.modules[name] = {};
          }
          initCallback(_this.modules[name]);
        });
        _defineProperty(this, "getModuleProp", function(name, prop) {
          if (!_this.modules[name]) {
            return false;
          }
          return _this.modules[name][prop];
        });
        _defineProperty(this, "getModulesList", function() {
          return Object.keys(_this.modules);
        });
        var keyboardDOMQuery = typeof (arguments.length <= 0 ? undefined : arguments[0]) === "string" ? arguments.length <= 0 ? undefined : arguments[0] : ".simple-keyboard";
        var options = Keyboard_typeof(arguments.length <= 0 ? undefined : arguments[0]) === "object" ? arguments.length <= 0 ? undefined : arguments[0] : arguments.length <= 1 ? undefined : arguments[1];
        if (!options) {
          options = {};
          /**
     * Initializing Utilities
     */        }
        this.utilities = new services_Utilities(this);
        /**
     * Processing options
     */        this.keyboardDOM = document.querySelector(keyboardDOMQuery);
        /**
     * @type {object}
     * @property {object} layout Modify the keyboard layout.
     * @property {string} layoutName Specifies which layout should be used.
     * @property {object} display Replaces variable buttons (such as {bksp}) with a human-friendly name (e.g.: “backspace”).
     * @property {boolean} mergeDisplay By default, when you set the display property, you replace the default one. This setting merges them instead.
     * @property {string} theme A prop to add your own css classes to the keyboard wrapper. You can add multiple classes separated by a space.
     * @property {Array} buttonTheme A prop to add your own css classes to one or several buttons.
     * @property {boolean} debug Runs a console.log every time a key is pressed. Displays the buttons pressed and the current input.
     * @property {boolean} newLineOnEnter Specifies whether clicking the “ENTER” button will input a newline (\n) or not.
     * @property {boolean} tabCharOnTab Specifies whether clicking the “TAB” button will input a tab character (\t) or not.
     * @property {string} inputName Allows you to use a single simple-keyboard instance for several inputs.
     * @property {number} maxLength Restrains all of simple-keyboard inputs to a certain length. This should be used in addition to the input element’s maxlengthattribute.
     * @property {object} maxLength Restrains simple-keyboard’s individual inputs to a certain length. This should be used in addition to the input element’s maxlengthattribute.
     * @property {boolean} syncInstanceInputs When set to true, this option synchronizes the internal input of every simple-keyboard instance.
     * @property {boolean} physicalKeyboardHighlight Enable highlighting of keys pressed on physical keyboard.
     * @property {boolean} preventMouseDownDefault Calling preventDefault for the mousedown events keeps the focus on the input.
     * @property {string} physicalKeyboardHighlightTextColor Define the text color that the physical keyboard highlighted key should have.
     * @property {string} physicalKeyboardHighlightBgColor Define the background color that the physical keyboard highlighted key should have.
     * @property {function(button: string):string} onKeyPress Executes the callback function on key press. Returns button layout name (i.e.: “{shift}”).
     * @property {function(input: string):string} onChange Executes the callback function on input change. Returns the current input’s string.
     * @property {function} onRender Executes the callback function every time simple-keyboard is rendered (e.g: when you change layouts).
     * @property {function} onInit Executes the callback function once simple-keyboard is rendered for the first time (on initialization).
     * @property {function(inputs: object):object} onChangeAll Executes the callback function on input change. Returns the input object with all defined inputs.
     * @property {boolean} useButtonTag Render buttons as a button element instead of a div element.
     * @property {boolean} disableCaretPositioning A prop to ensure characters are always be added/removed at the end of the string.
     * @property {object} inputPattern Restrains input(s) change to the defined regular expression pattern.
     */        this.options = options;
        this.options.layoutName = this.options.layoutName || "default";
        this.options.theme = this.options.theme || "hg-theme-default";
        this.options.inputName = this.options.inputName || "default";
        this.options.preventMouseDownDefault = this.options.preventMouseDownDefault || false;
        /**
     * @type {object} Classes identifying loaded plugins
     */        this.keyboardPluginClasses = "";
        /**
     * Bindings
     */        this.handleButtonClicked = this.handleButtonClicked.bind(this);
        this.syncInstanceInputs = this.syncInstanceInputs.bind(this);
        this.clearInput = this.clearInput.bind(this);
        this.getInput = this.getInput.bind(this);
        this.setInput = this.setInput.bind(this);
        this.replaceInput = this.replaceInput.bind(this);
        this.clear = this.clear.bind(this);
        this.dispatch = this.dispatch.bind(this);
        this.addButtonTheme = this.addButtonTheme.bind(this);
        this.removeButtonTheme = this.removeButtonTheme.bind(this);
        this.getButtonElement = this.getButtonElement.bind(this);
        this.handleCaret = this.handleCaret.bind(this);
        this.caretEventHandler = this.caretEventHandler.bind(this);
        this.onInit = this.onInit.bind(this);
        this.onRender = this.onRender.bind(this);
        this.render = this.render.bind(this);
        this.loadModules = this.loadModules.bind(this);
        this.handleButtonMouseUp = this.handleButtonMouseUp.bind(this);
        this.handleButtonMouseDown = this.handleButtonMouseDown.bind(this);
        this.handleButtonHold = this.handleButtonHold.bind(this);
        this.onModulesLoaded = this.onModulesLoaded.bind(this);
        this.inputPatternIsValid = this.inputPatternIsValid.bind(this);
        /**
     * simple-keyboard uses a non-persistent internal input to keep track of the entered string (the variable `keyboard.input`).
     * This removes any dependency to input DOM elements. You can type and directly display the value in a div element, for example.
     * @example
     * // To get entered input
     * let input = keyboard.getInput();
     *
     * // To clear entered input.
     * keyboard.clearInput();
     *
     * @type {object}
     * @property {object} default Default SimpleKeyboard internal input.
     * @property {object} myInputName Example input that can be set through `options.inputName:"myInputName"`.
     */        this.input = {};
        this.input[this.options.inputName] = "";
        /**
     * @type {string} DOM class of the keyboard wrapper, normally "simple-keyboard" by default.
     */        this.keyboardDOMClass = keyboardDOMQuery.split(".").join("");
        /**
     * @type {object} Contains the DOM elements of every rendered button, the key being the button's layout name (e.g.: "{enter}").
     */        this.buttonElements = {};
        /**
     * Rendering keyboard
     */        if (this.keyboardDOM) {
          this.render();
        } else {
          console.warn('"'.concat(keyboardDOMQuery, '" was not found in the DOM.'));
          throw new Error("KEYBOARD_DOM_ERROR");
        }
        /**
     * Saving instance
     * This enables multiple simple-keyboard support with easier management
     */        if (!window["SimpleKeyboardInstances"]) {
          window["SimpleKeyboardInstances"] = {};
        }
        window["SimpleKeyboardInstances"][this.utilities.camelCase(this.keyboardDOMClass)] = this;
        /**
     * Physical Keyboard support
     */        this.physicalKeyboardInterface = new services_PhysicalKeyboard(this);
        /**
     * Modules
     */        this.modules = {};
        this.loadModules();
      }
      /**
   * Handles clicks made to keyboard buttons
   * @param  {string} button The button's layout name.
   */      Keyboard_createClass(SimpleKeyboard, [ {
        key: "handleButtonClicked",
        value: function handleButtonClicked(button) {
          var debug = this.options.debug;
          /**
     * Ignoring placeholder buttons
     */          if (button === "{//}") {
            return false;
            /**
     * Calling onKeyPress
     */          }
          if (typeof this.options.onKeyPress === "function") {
            this.options.onKeyPress(button);
          }
          if (!this.input[this.options.inputName]) {
            this.input[this.options.inputName] = "";
          }
          var updatedInput = this.utilities.getUpdatedInput(button, this.input[this.options.inputName], this.options, this.caretPosition);
          if (// If input will change as a result of this button press
          this.input[this.options.inputName] !== updatedInput && (// This pertains to the "inputPattern" option:
          // If inputPattern isn't set
          !this.options.inputPattern || // Or, if it is set and if the pattern is valid - we proceed.
          this.options.inputPattern && this.inputPatternIsValid(updatedInput))) {
            /**
       * If maxLength and handleMaxLength yield true, halting
       */ if (this.options.maxLength && this.utilities.handleMaxLength(this.input, this.options, updatedInput)) {
              return false;
            }
            this.input[this.options.inputName] = this.utilities.getUpdatedInput(button, this.input[this.options.inputName], this.options, this.caretPosition, true);
            if (debug) {
              console.log("Input changed:", this.input);
              /**
       * Enforce syncInstanceInputs, if set
       */            }
            if (this.options.syncInstanceInputs) {
              this.syncInstanceInputs(this.input);
              /**
       * Calling onChange
       */            }
            if (typeof this.options.onChange === "function") {
              this.options.onChange(this.input[this.options.inputName]);
            }
          }
          if (debug) {
            console.log("Key pressed:", button);
          }
        }
        /**
   * Handles button mousedown
   */ /* istanbul ignore next */      }, {
        key: "handleButtonMouseDown",
        value: function handleButtonMouseDown(button, e) {
          var _this2 = this;
          /**
     * @type {boolean} Whether the mouse is being held onKeyPress
     */          this.isMouseHold = true;
          if (this.holdInteractionTimeout) {
            clearTimeout(this.holdInteractionTimeout);
          }
          if (this.holdTimeout) {
            clearTimeout(this.holdTimeout);
            /**
     * @type {object} Time to wait until a key hold is detected
     */          }
          this.holdTimeout = setTimeout(function() {
            if (_this2.isMouseHold && (!button.includes("{") && !button.includes("}") || button === "{bksp}" || button === "{space}" || button === "{tab}")) {
              if (_this2.options.debug) {
                console.log("Button held:", button);
              }
              _this2.handleButtonHold(button, e);
            }
            clearTimeout(_this2.holdTimeout);
          }, 500);
        }
        /**
   * Handles button mouseup
   */      }, {
        key: "handleButtonMouseUp",
        value: function handleButtonMouseUp() {
          this.isMouseHold = false;
          if (this.holdInteractionTimeout) {
            clearTimeout(this.holdInteractionTimeout);
          }
        }
        /**
   * Handles button hold
   */ /* istanbul ignore next */      }, {
        key: "handleButtonHold",
        value: function handleButtonHold(button) {
          var _this3 = this;
          if (this.holdInteractionTimeout) {
            clearTimeout(this.holdInteractionTimeout);
            /**
     * @type {object} Timeout dictating the speed of key hold iterations
     */          }
          this.holdInteractionTimeout = setTimeout(function() {
            if (_this3.isMouseHold) {
              _this3.handleButtonClicked(button);
              _this3.handleButtonHold(button);
            } else {
              clearTimeout(_this3.holdInteractionTimeout);
            }
          }, 100);
        }
        /**
   * Send a command to all simple-keyboard instances (if you have several instances).
   */      }, {
        key: "syncInstanceInputs",
        value: function syncInstanceInputs() {
          var _this4 = this;
          this.dispatch(function(instance) {
            instance.replaceInput(_this4.input);
          });
        }
        /**
   * Clear the keyboard’s input.
   * @param {string} [inputName] optional - the internal input to select
   */      }, {
        key: "clearInput",
        value: function clearInput(inputName) {
          inputName = inputName || this.options.inputName;
          this.input[inputName] = "";
          /**
     * Enforce syncInstanceInputs, if set
     */          if (this.options.syncInstanceInputs) {
            this.syncInstanceInputs(this.input);
          }
        }
        /**
   * Get the keyboard’s input (You can also get it from the onChange prop).
   * @param  {string} [inputName] optional - the internal input to select
   */      }, {
        key: "getInput",
        value: function getInput(inputName) {
          inputName = inputName || this.options.inputName;
          /**
     * Enforce syncInstanceInputs, if set
     */          if (this.options.syncInstanceInputs) {
            this.syncInstanceInputs(this.input);
          }
          return this.input[this.options.inputName];
        }
        /**
   * Set the keyboard’s input.
   * @param  {string} input the input value
   * @param  {string} inputName optional - the internal input to select
   */      }, {
        key: "setInput",
        value: function setInput(input, inputName) {
          inputName = inputName || this.options.inputName;
          this.input[inputName] = input;
          /**
     * Enforce syncInstanceInputs, if set
     */          if (this.options.syncInstanceInputs) {
            this.syncInstanceInputs(this.input);
          }
        }
        /**
   * Replace the input object (`keyboard.input`)
   * @param  {object} inputObj The input object
   */      }, {
        key: "replaceInput",
        value: function replaceInput(inputObj) {
          this.input = inputObj;
        }
        /**
   * Set new option or modify existing ones after initialization.
   * @param  {object} option The option to set
   */      }, {
        key: "clear",
        /**
   * Remove all keyboard rows and reset keyboard values.
   * Used interally between re-renders.
   */ value: function clear() {
          this.keyboardDOM.innerHTML = "";
          this.keyboardDOM.className = this.keyboardDOMClass;
          this.buttonElements = {};
        }
        /**
   * Send a command to all simple-keyboard instances at once (if you have multiple instances).
   * @param  {function(instance: object, key: string)} callback Function to run on every instance
   */      }, {
        key: "dispatch",
        value: function dispatch(callback) {
          if (!window["SimpleKeyboardInstances"]) {
            console.warn("SimpleKeyboardInstances is not defined. Dispatch cannot be called.");
            throw new Error("INSTANCES_VAR_ERROR");
          }
          return Object.keys(window["SimpleKeyboardInstances"]).forEach(function(key) {
            callback(window["SimpleKeyboardInstances"][key], key);
          });
        }
        /**
   * Adds/Modifies an entry to the `buttonTheme`. Basically a way to add a class to a button.
   * @param  {string} buttons List of buttons to select (separated by a space).
   * @param  {string} className Classes to give to the selected buttons (separated by space).
   */      }, {
        key: "addButtonTheme",
        value: function addButtonTheme(buttons, className) {
          var _this5 = this;
          if (!className || !buttons) {
            return false;
          }
          buttons.split(" ").forEach(function(button) {
            className.split(" ").forEach(function(classNameItem) {
              if (!_this5.options.buttonTheme) {
                _this5.options.buttonTheme = [];
              }
              var classNameFound = false;
              /**
         * If class is already defined, we add button to class definition
         */              _this5.options.buttonTheme.map(function(buttonTheme) {
                if (buttonTheme.class.split(" ").includes(classNameItem)) {
                  classNameFound = true;
                  var buttonThemeArray = buttonTheme.buttons.split(" ");
                  if (!buttonThemeArray.includes(button)) {
                    classNameFound = true;
                    buttonThemeArray.push(button);
                    buttonTheme.buttons = buttonThemeArray.join(" ");
                  }
                }
                return buttonTheme;
              });
              /**
         * If class is not defined, we create a new entry
         */              if (!classNameFound) {
                _this5.options.buttonTheme.push({
                  class: classNameItem,
                  buttons: buttons
                });
              }
            });
          });
          this.render();
        }
        /**
   * Removes/Amends an entry to the `buttonTheme`. Basically a way to remove a class previously added to a button through buttonTheme or addButtonTheme.
   * @param  {string} buttons List of buttons to select (separated by a space).
   * @param  {string} className Classes to give to the selected buttons (separated by space).
   */      }, {
        key: "removeButtonTheme",
        value: function removeButtonTheme(buttons, className) {
          var _this6 = this;
          /**
     * When called with empty parameters, remove all button themes
     */          if (!buttons && !className) {
            this.options.buttonTheme = [];
            this.render();
            return false;
          }
          /**
     * If buttons are passed and buttonTheme has items
     */          if (buttons && Array.isArray(this.options.buttonTheme) && this.options.buttonTheme.length) {
            var buttonArray = buttons.split(" ");
            buttonArray.forEach(function(button, key) {
              _this6.options.buttonTheme.map(function(buttonTheme, index) {
                /**
           * If className is set, we affect the buttons only for that class
           * Otherwise, we afect all classes
           */ if (className && className.includes(buttonTheme.class) || !className) {
                  var filteredButtonArray = buttonTheme.buttons.split(" ").filter(function(item) {
                    return item !== button;
                  });
                  /**
             * If buttons left, return them, otherwise, remove button Theme
             */                  if (filteredButtonArray.length) {
                    buttonTheme.buttons = filteredButtonArray.join(" ");
                  } else {
                    _this6.options.buttonTheme.splice(index, 1);
                    buttonTheme = null;
                  }
                }
                return buttonTheme;
              });
            });
            this.render();
          }
        }
        /**
   * Get the DOM Element of a button. If there are several buttons with the same name, an array of the DOM Elements is returned.
   * @param  {string} button The button layout name to select
   */      }, {
        key: "getButtonElement",
        value: function getButtonElement(button) {
          var output;
          var buttonArr = this.buttonElements[button];
          if (buttonArr) {
            if (buttonArr.length > 1) {
              output = buttonArr;
            } else {
              output = buttonArr[0];
            }
          }
          return output;
        }
        /**
   * This handles the "inputPattern" option
   * by checking if the provided inputPattern passes
   */      }, {
        key: "inputPatternIsValid",
        value: function inputPatternIsValid(inputVal) {
          var inputPatternRaw = this.options.inputPattern;
          var inputPattern;
          /**
     * Check if input pattern is global or targeted to individual inputs
     */          if (inputPatternRaw instanceof RegExp) {
            inputPattern = inputPatternRaw;
          } else {
            inputPattern = inputPatternRaw[this.options.inputName];
          }
          if (inputPattern && inputVal) {
            var didInputMatch = inputPattern.test(inputVal);
            if (this.options.debug) {
              console.log('inputPattern ("'.concat(inputPattern, '"): ').concat(didInputMatch ? "passed" : "did not pass!"));
            }
            return didInputMatch;
          } else {
            /**
       * inputPattern doesn't seem to be set for the current input, or input is empty. Pass.
       */ return true;
          }
        }
        /**
   * Retrieves the current cursor position within a input or textarea (if any)
   */      }, {
        key: "handleCaret",
        value: function handleCaret() {
          /**
     * Only first instance should insall the caret handling events
     */ this.caretPosition = null;
          var simpleKeyboardInstances = window["SimpleKeyboardInstances"];
          if (simpleKeyboardInstances && Object.keys(simpleKeyboardInstances)[0] === this.utilities.camelCase(this.keyboardDOMClass) || !simpleKeyboardInstances) {
            if (this.options.debug) {
              console.log("Caret handling started (".concat(this.keyboardDOMClass, ")"));
            }
            document.addEventListener("keyup", this.caretEventHandler);
            document.addEventListener("mouseup", this.caretEventHandler);
            document.addEventListener("touchend", this.caretEventHandler);
          }
        }
        /**
   * Called by {@link handleCaret} when an event that warrants a cursor position update is triggered
   */      }, {
        key: "caretEventHandler",
        value: function caretEventHandler(event) {
          var targetTagName;
          if (event.target.tagName) {
            targetTagName = event.target.tagName.toLowerCase();
          }
          this.dispatch(function(instance) {
            if (instance.isMouseHold) {
              instance.isMouseHold = false;
            }
            if ((targetTagName === "textarea" || targetTagName === "input") && !instance.options.disableCaretPositioning) {
              /**
         * Tracks current cursor position
         * As keys are pressed, text will be added/removed at that position within the input.
         */ instance.caretPosition = event.target.selectionStart;
              if (instance.options.debug) {
                console.log("Caret at: ", event.target.selectionStart, event.target.tagName.toLowerCase(), "(".concat(instance.keyboardDOMClass, ")"));
              }
            } else if (instance.options.disableCaretPositioning) {
              /**
         * If we toggled off disableCaretPositioning, we must ensure caretPosition doesn't persist once reactivated.
         */ instance.caretPosition = null;
            }
          });
        }
        /**
   * Executes the callback function once simple-keyboard is rendered for the first time (on initialization).
   */      }, {
        key: "onInit",
        value: function onInit() {
          if (this.options.debug) {
            console.log("".concat(this.keyboardDOMClass, " Initialized"));
          }
          /**
     * Caret handling
     */          this.handleCaret();
          if (typeof this.options.onInit === "function") {
            this.options.onInit();
          }
        }
        /**
   * Executes the callback function every time simple-keyboard is rendered (e.g: when you change layouts).
   */      }, {
        key: "onRender",
        value: function onRender() {
          if (typeof this.options.onRender === "function") {
            this.options.onRender();
          }
        }
        /**
   * Executes the callback function once all modules have been loaded
   */      }, {
        key: "onModulesLoaded",
        value: function onModulesLoaded() {
          if (typeof this.options.onModulesLoaded === "function") {
            this.options.onModulesLoaded();
          }
        }
        /**
   * Register module
   */      }, {
        key: "loadModules",
        /**
   * Load modules
   */ value: function loadModules() {
          var _this7 = this;
          if (Array.isArray(this.options.modules)) {
            this.options.modules.forEach(function(Module) {
              var module = new Module();
 /* istanbul ignore next */              if (module.constructor.name && module.constructor.name !== "Function") {
                var classStr = "module-".concat(_this7.utilities.camelCase(module.constructor.name));
                _this7.keyboardPluginClasses = _this7.keyboardPluginClasses + " ".concat(classStr);
              }
              module.init(_this7);
            });
            this.keyboardPluginClasses = this.keyboardPluginClasses + " modules-loaded";
            this.render();
            this.onModulesLoaded();
          }
        }
        /**
   * Get module prop
   */      }, {
        key: "render",
        /**
   * Renders rows and buttons as per options
   */ value: function render() {
          var _this8 = this;
          /**
     * Clear keyboard
     */          this.clear();
          var layoutClass = "hg-layout-".concat(this.options.layoutName);
          var layout = this.options.layout || services_KeyboardLayout.getDefaultLayout();
          var useTouchEvents = this.options.useTouchEvents || false;
          /**
     * Account for buttonTheme, if set
     */          var buttonThemesParsed = {};
          if (Array.isArray(this.options.buttonTheme)) {
            this.options.buttonTheme.forEach(function(themeObj) {
              if (themeObj.buttons && themeObj.class) {
                var themeButtons;
                if (typeof themeObj.buttons === "string") {
                  themeButtons = themeObj.buttons.split(" ");
                }
                if (themeButtons) {
                  themeButtons.forEach(function(themeButton) {
                    var themeParsed = buttonThemesParsed[themeButton];
 // If the button has already been added
                                        if (themeParsed) {
                      // Making sure we don't add duplicate classes, even when buttonTheme has duplicates
                      if (!_this8.utilities.countInArray(themeParsed.split(" "), themeObj.class)) {
                        buttonThemesParsed[themeButton] = "".concat(themeParsed, " ").concat(themeObj.class);
                      }
                    } else {
                      buttonThemesParsed[themeButton] = themeObj.class;
                    }
                  });
                }
              } else {
                console.warn('buttonTheme row is missing the "buttons" or the "class". Please check the documentation.');
              }
            });
          }
          /**
     * Adding themeClass, layoutClass to keyboardDOM
     */          this.keyboardDOM.className += " ".concat(this.options.theme, " ").concat(layoutClass, " ").concat(this.keyboardPluginClasses);
          /**
     * Iterating through each row
     */          layout[this.options.layoutName].forEach(function(row, rIndex) {
            var rowArray = row.split(" ");
            /**
       * Creating empty row
       */            var rowDOM = document.createElement("div");
            rowDOM.className += "hg-row";
            /**
       * Iterating through each button in row
       */            rowArray.forEach(function(button, bIndex) {
              var fctBtnClass = _this8.utilities.getButtonClass(button);
              var buttonThemeClass = buttonThemesParsed[button];
              var buttonDisplayName = _this8.utilities.getButtonDisplayName(button, _this8.options.display, _this8.options.mergeDisplay);
              /**
         * Creating button
         */              var buttonType = _this8.options.useButtonTag ? "button" : "div";
              var buttonDOM = document.createElement(buttonType);
              buttonDOM.className += "hg-button ".concat(fctBtnClass).concat(buttonThemeClass ? " " + buttonThemeClass : "");
              if (useTouchEvents) {
                buttonDOM.ontouchstart = function(e) {
                  _this8.handleButtonClicked(button);
                  _this8.handleButtonMouseDown(button, e);
                };
                buttonDOM.ontouchend = function(e) {
                  return _this8.handleButtonMouseUp();
                };
                buttonDOM.ontouchcancel = function(e) {
                  return _this8.handleButtonMouseUp();
                };
              } else {
                buttonDOM.onclick = function() {
                  _this8.isMouseHold = false;
                  _this8.handleButtonClicked(button);
                };
                buttonDOM.onmousedown = function(e) {
                  if (_this8.options.preventMouseDownDefault) {
                    e.preventDefault();
                  }
                  _this8.handleButtonMouseDown(button, e);
                };
              }
              /**
         * Adding identifier
         */              buttonDOM.setAttribute("data-skBtn", button);
              /**
         * Adding unique id
         * Since there's no limit on spawning same buttons, the unique id ensures you can style every button
         */              var buttonUID = "".concat(_this8.options.layoutName, "-r").concat(rIndex, "b").concat(bIndex);
              buttonDOM.setAttribute("data-skBtnUID", buttonUID);
              /**
         * Adding display label
         */              buttonDOM.setAttribute("data-displayLabel", buttonDisplayName);
              /**
         * Adding button label to button
         */              var buttonSpanDOM = document.createElement("span");
              buttonSpanDOM.innerHTML = buttonDisplayName;
              buttonDOM.appendChild(buttonSpanDOM);
              /**
         * Adding to buttonElements
         */              if (!_this8.buttonElements[button]) {
                _this8.buttonElements[button] = [];
              }
              _this8.buttonElements[button].push(buttonDOM);
              /**
         * Appending button to row
         */              rowDOM.appendChild(buttonDOM);
            });
            /**
       * Appending row to keyboard
       */            _this8.keyboardDOM.appendChild(rowDOM);
          });
          /**
     * Calling onRender
     */          this.onRender();
          if (!this.initialized) {
            /**
       * Ensures that onInit is only called once per instantiation
       */ this.initialized = true;
            /**
       * Handling mouseup
       */            if (!useTouchEvents) {
              document.onmouseup = function() {
                return _this8.handleButtonMouseUp();
              };
            }
            /**
       * Calling onInit
       */            this.onInit();
          }
        }
      } ]);
      return SimpleKeyboard;
    }();
 /* harmony default export */    var components_Keyboard = Keyboard_SimpleKeyboard;
    // CONCATENATED MODULE: ./src/lib/index.js
    /* harmony default export */    var lib = __webpack_exports__["default"] = components_Keyboard;
    /***/  }
  /******/ ]);
});