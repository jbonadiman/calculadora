import Display from './display.js';
import Operation from './operation.js';

const display = new Display();
const operation = new Operation();
const recognizedKeys = '^[0-9,.]$|^Backspace$';

display.update(operation.getCurrentOperand());

function doDigitAction(input) {
  if (input.match(/^\d$/)) {
    operation.addDigit(input);
  }

  if (input.match(/^[.,]$/)) {
    operation.addDecimal(input);
  }
}

let digits = [...document.getElementsByClassName('digit')];

digits
  .filter(dg => dg.id === 'dot')
  .forEach(dg => dg.textContent = Operation.DECIMAL_SEP);

digits
  .forEach(btn => {
    if (btn.addEventListener) {
      btn.addEventListener('click', () => {
        doDigitAction(btn.textContent);
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

    if (key.match(new RegExp(recognizedKeys))) {
      doDigitAction(key);

      if (key === 'Backspace') {
        operation.deleteDigit();
      }

      display.update(operation.getCurrentOperand());
    }
  }, false);
} else {
  console.error('Browser not compatible!');
}