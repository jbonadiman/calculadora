import Display from './display.js';
import Operation from './operation.js';

const display = new Display();
const operation = new Operation();
const recognizedKeys = '[0-9,.]|Backspace';

display.update(operation.getCurrentOperand());


let digits = [...document.getElementsByClassName('digit')];
digits.forEach(btn => {
  if (btn.addEventListener) {
    btn.addEventListener('click', () => {
      operation.addDigit(btn.textContent);
      display.update(operation.getCurrentOperand());
    })
  } else {
    console.error('Browser not compatible!');
  }
});


if (document.addEventListener) {
  document.addEventListener('keyup', evt => {
    let {key} = evt;
    console.debug({key})

    if (key.match(new RegExp(recognizedKeys, "g"))) {
      if (key.match(/\d/)) {
        operation.addDigit(key);
      }

      if (key.match(/[.,]/g)) {
        operation.addDecimal(key);
      }

      if (key === 'Backspace') {
        operation.deleteDigit();
      }

      display.update(operation.getCurrentOperand());
    }
  }, false);
} else {
  console.error('Browser not compatible!');
}