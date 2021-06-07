import Display from './display.js';
import {Operation} from './calculation.js';

class Calculator {
  static DIGIT_KEYS = /^\d$/;
  static SEP_KEYS = /^[,.]$/;
  static OPERATOR_KEYS = /^[\/*\-+]$/;
  static EQUALS_KEYS = /^Enter$|^=$/;
  static DELETE_KEYS = /^Backspace$/;

  constructor() {
    this.display = new Display();
    this.operation = new Operation();

    this.display.update(this.operation.getCurrentOperand());

    this.digitsElements = [...document.getElementsByClassName('digit')];
    this.eraseElement = document.getElementById('erase');
    this.operatorsElements = [...document.getElementsByName('operator')].filter(btn => btn.id !== 'equals');
    this.equalsElement = document.getElementById('equals');

    if (this.equalsElement.addEventListener) {
      this.equalsElement.addEventListener('click', () => this.resolveOperation(), false);
    } else {
      console.error('Browser not compatible!');
    }

    this.operatorsElements
      .forEach(btn => {
        if (btn.addEventListener) {
          btn.addEventListener('click', () => this.setOperator(), false);
        } else {
          console.error('Browser not compatible!');
        }
      });

    if (this.eraseElement.addEventListener) {
      this.eraseElement.addEventListener('click', () => {
        if (this.eraseElement.textContent === 'C') {
          this.deleteOperand();
        } else if (this.eraseElement.textContent === 'AC') {
          this.deleteOperation();
        }
      }, false);
    } else {
      console.error('Browser not compatible!');
    }

    this.digitsElements
      .filter(dg => dg.id === 'dot')[0]
      .textContent = Operation.DECIMAL_SEP;

    this.digitsElements
      .forEach(btn => {
        if (btn.addEventListener) {
          if (btn.textContent.match(/\d/)) {
            btn.addEventListener('click', () => {
              this.operation.addDigit(btn.textContent);
              this.changeAcBtn();
              this.updateDisplay();
            }, false);
          } else if (btn.textContent === Operation.DECIMAL_SEP) {
            btn.addEventListener('click', () => this.pressSeparator(), false);
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

  pressOperator(operatorId) {
    const button = this.operatorsElements.filter(op => op.id === operatorId)[0];
    button.focus();
    button.click();
  }

  pressEquals() {
    this.equalsElement.focus();
    this.equalsElement.click();
  }

  pressDigit(digit) {
    const button = this.digitsElements.filter(btn => btn.textContent === digit)[0];
    button.focus();
    button.click();
  }

  pressSeparator() {
    this.operation.addDecimal();
    this.changeAcBtn();
    this.updateDisplay();
  }

  deleteDigit() {
    this.operation.deleteDigit();

    if (this.operation.isOperandZeroed()) {
      this.changeCBtn();
    }

    this.updateDisplay();
  }

  deleteOperand() {
    this.operation.deleteOperand();
    this.changeCBtn();
    this.updateDisplay();
  }

  deleteOperation() {
    this.operation.deleteOperation();
    this.changeCBtn();
    this.updateDisplay();
  }

  setOperator() {
    const checkedElement = this.operatorsElements.filter(el => el.checked);
    if (checkedElement.length === 0) return;

    this.operation.setOperator(checkedElement[0].value);
    this.updateDisplay();
  }

  resolveOperation() {
    const checkedElement = this.operatorsElements.filter(el => el.checked)[0];
    if (checkedElement.length === 0) return;
    
    checkedElement.checked = false;

    this.operation.resolveOperation();
    this.updateDisplay();
  }

  updateDisplay() {
    this.display.update(this.operation.getCurrentOperand());
  }
}

const calculator = new Calculator();

const convOperators = {
  '/': 'division',
  '*': 'multiplication',
  '-': 'subtraction',
  '+': 'sum'
}

if (document.addEventListener) {
  document.addEventListener('keyup', evt => {
    const {key} = evt;
    console.debug({key})

    switch (true) {
      case Calculator.DIGIT_KEYS.test(key):
        calculator.pressDigit(key);
        break;
      case Calculator.SEP_KEYS.test(key):
        calculator.pressSeparator();
        break;
      case Calculator.OPERATOR_KEYS.test(key):
        calculator.pressOperator(convOperators[key]);
        break;
      case Calculator.EQUALS_KEYS.test(key):
        calculator.pressEquals();
        break;
    }

    calculator.updateDisplay();
  }, false);

  document.addEventListener('keydown', evt => {
    const {key} = evt;
    switch (true) {
      case Calculator.DELETE_KEYS.test(key):
        calculator.deleteDigit();
        break;
    }
  });

} else {
  console.error('Browser not compatible!');
}