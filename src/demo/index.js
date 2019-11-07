import "./css/index.css";

/**
 * Demos
 */
import BasicDemo from "./BasicDemo";
//import FullKeyboardDemo from "./FullKeyboardDemo";
//import ButtonThemeDemo from "./ButtonThemeDemo";
//import MultipleKeyboardsDemo from "./MultipleKeyboardsDestroyDemo";

/**
 * Selected demo
 */
const SELECTED_DEMO = BasicDemo;

/**
 * Bootstrap
 */
new SELECTED_DEMO();
