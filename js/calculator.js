import Display from './display.js';
import Operation from './operation.js';

class Calculator {
  static DIGIT_KEYS = /^\d$/;
  static SEP_KEYS = /^[,.]$/;
  static DELETE_KEYS = /^Backspace$/;

  constructor() {
    this.display = new Display();
    this.operation = new Operation();

    this.display.update(this.operation.getCurrentOperand());

    this.digitsElements = [...document.getElementsByClassName('digit')];
    this.eraseElement = document.getElementById('erase');

    this.digitsElements
      .filter(dg => dg.id === 'dot')[0]
      .textContent = Operation.DECIMAL_SEP;

    this.digitsElements
      .forEach(btn => {
        if (btn.addEventListener) {
          if (btn.textContent.match(/\d/)) {
            btn.addEventListener('click', () => {
              this.pressDigit(btn.textContent)
            });
          } else if (btn.textContent === Operation.DECIMAL_SEP) {
            btn.addEventListener('click', this.pressSeparator);
          }
        } else {
          console.error('Browser not compatible!');
        }
      });
  }

  changeAcBtn() {
    if (this.eraseElement.textContent === 'AC') {
      this.eraseElement.textContent = 'C';
    }
  }

  changeCBtn() {
    if (this.eraseElement.textContent === 'C') {
      this.eraseElement.textContent = 'AC';
    }
  }

  pressDigit(digit) {
    this.operation.addDigit(digit);
    this.changeAcBtn();
    this.updateDisplay();
  }

  pressSeparator() {
    this.operation.addDecimal();
    this.changeAcBtn();
    this.updateDisplay();
  }

  deleteDigit() {
    this.operation.deleteDigit();
    this.updateDisplay();
  }

  updateDisplay() {
    this.display.update(this.operation.getCurrentOperand());
  }
}

const calculator = new Calculator();

if (document.addEventListener) {
  document.addEventListener('keyup', evt => {
    const {key} = evt;
    console.debug({key})

    switch (true) {
      case Calculator.DELETE_KEYS.test(key):
        calculator.deleteDigit();
        break;
      case Calculator.DIGIT_KEYS.test(key):
        calculator.pressDigit(key);
        break;
      case Calculator.SEP_KEYS.test(key):
        calculator.pressSeparator();
        break;
    }

    calculator.updateDisplay();
  }, false);
} else {
  console.error('Browser not compatible!');
}