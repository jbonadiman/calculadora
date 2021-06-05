import Display from './display.js';
import Operation from './operation.js';

let display = new Display();
let operation = new Operation();

display.update(operation.getCurrentOperand());

if (document.addEventListener) {
  document.addEventListener('keyup', (evt) => {
    let {key} = evt;

    if (key >= '0' && key <= '9') {
      operation.addDigit(key);
      display.update(operation.getCurrentOperand());
    }
  }, false);
}