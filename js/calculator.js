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

    this.display.update(this.operation.formatNumber());

    this.digitsElements = [...document.getElementsByClassName('digit')];
    this.eraseElement = document.getElementById('erase');
    this.operatorsElements = [...document.getElementsByName('operator')].filter(btn => btn.id !== 'equals');
    this.equalsElement = document.getElementById('equals');

    [...document.getElementsByClassName('button')]
      .forEach(btn => {
         if (btn.addEventListener) {
           btn.addEventListener('mouseover', () => {
             if (!btn.classList.contains('active')) {
               btn.classList.add('hover')
             }
           });

           btn.addEventListener('mouseout', () => {
             btn.classList.remove('hover')
           });

           btn.addEventListener('mousedown', () => {
             btn.classList.remove('hover')
             btn.classList.add('active')
           });

           btn.addEventListener('mouseup', () => {
             btn.classList.remove('active');
             btn.classList.add('hover');
           });
         }
      })

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
              const checkedElement = this.operatorsElements.filter(el => el.checked);
              if (checkedElement.length > 0) {
                checkedElement[0].checked = false;
              }
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
    button.click();
  }

  pressEquals() {
    this.equalsElement.click();
  }

  pressDigit(digit) {
    const button = this.digitsElements.filter(btn => btn.textContent === digit)[0];
    button.classList.add('active')
    setTimeout(function(){ button.classList.remove('active'); }, 200);
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
    this.operation.resetOperand();
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
    this.operation.resolveOperation();

    const checkedElement = this.operatorsElements.filter(el => el.checked);
    if (checkedElement.length >= 1) {
      checkedElement[0].checked = false;
    }

    this.updateDisplay();
  }

  updateDisplay() {
    this.display.update(this.operation.formatNumber());
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