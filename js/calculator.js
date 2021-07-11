import Display from './display.js';
import {Operation} from './calculation.js';

let setBtnStateAsClass = function (btnArray) {
  btnArray.forEach(btn => {
    if (btn.addEventListener) {
      btn.addEventListener('pointerover', () => {
        if (!btn.classList.contains('active')) {
          btn.classList.add('hover')
        }
      });

      btn.addEventListener('pointerout', () => {
        btn.classList.remove('hover')
      });

      btn.addEventListener('pointerdown', () => {
        btn.classList.remove('hover')
        btn.classList.add('active')
      });

      btn.addEventListener('pointerup', () => {
        btn.classList.remove('active');
        btn.classList.add('hover');
      });
    } else {
      browserNotCompatibleError();
    }
  })
}

let browserNotCompatibleError = function () {
  console.error('Browser not compatible!');
}

class Calculator {
  static DIGIT_KEYS = /^\d$/;
  static SEP_KEYS = /^[,.]$/;
  static OPERATOR_KEYS = /^[\/*\-+]$/;
  static EQUALS_KEYS = /^Enter$|^=$/;
  static DELETE_KEYS = /^Backspace$/;
  static SPECIAL_KEYS = /^Delete$/;

  static ACTIVE_STYLE_DURATION = 200;

  constructor() {
    this.display = new Display();
    this.operation = new Operation();

    this.display.update(this.operation.formatNumber());

    this.checkedOperator = null;
    this.digitsElements = [...document.getElementsByClassName('digit')];
    this.eraseElement = document.getElementById('erase');
    this.operatorsElements = [...document.getElementsByName('operator')].filter(btn => btn.id !== 'equals');
    this.equalsElement = document.getElementById('equals');

    this.eraseElement.changeAcText = function () {
      if (this.textContent === 'AC') {
        this.textContent = 'C';
      }
    };

    this.eraseElement.changeCText = function () {
      if (this.textContent === 'C') {
        this.textContent = 'AC';
      }
    };

    setBtnStateAsClass([...document.getElementsByClassName('button')]);

    if (this.equalsElement.addEventListener) {
      this.equalsElement.addEventListener(
        'click',
        () => this.resolveOperation(),
        false
      );
    } else {
      browserNotCompatibleError();
    }

    this.operatorsElements
      .forEach(btn => {
        if (btn.addEventListener) {
          btn.addEventListener(
            'click',
            () => this.setOperator(btn),
            false
          );
        } else {
          browserNotCompatibleError();
        }
      });

    if (this.eraseElement.addEventListener) {
      this.eraseElement.addEventListener(
        'click',
        () => {
          if (this.eraseElement.textContent === 'C') {
            this.deleteOperand();
          } else if (this.eraseElement.textContent === 'AC') {
            this.deleteOperation();
          }
        }, false);
    } else {
      browserNotCompatibleError();
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

              if (this.checkedOperator) {
                this.checkedOperator.checked = false;
              }

              this.eraseElement.changeAcText();
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

  pressOperator(operatorId) {
    const button = this.operatorsElements.find(op => op.id === operatorId);
    button.click();
  }

  keyUpEquals() {
    setTimeout(
      () => this.equalsElement.classList.remove('active'),
      Calculator.ACTIVE_STYLE_DURATION
    );

    this.equalsElement.click();
  }

  keyDownEquals() {
    this.equalsElement.classList.add('active');
  }

  keyUpDigit(digit) {
    const button = this.digitsElements.find(btn => btn.textContent === digit);
    setTimeout(
      () => button.classList.remove('active'),
      Calculator.ACTIVE_STYLE_DURATION
    );

    button.click();
  }

  keyDownDigit(digit) {
    const button = this.digitsElements.find(btn => btn.textContent === digit);
    button.classList.add('active')
  }

  pressSeparator() {
    this.operation.addDecimal();
    this.eraseElement.changeAcText();
    this.updateDisplay();
  }

  deleteDigit() {
    this.operation.deleteDigit();

    if (this.operation.isOperandZeroed()) {
      this.eraseElement.changeCText();
    }

    this.updateDisplay();
  }

  deleteOperand() {
    this.operation.resetOperand();
    this.eraseElement.changeCText();
    this.updateDisplay();
  }

  deleteOperation() {
    this.operation.deleteOperation();
    this.eraseElement.changeCText();
    this.updateDisplay();
  }

  setOperator(btn) {
    this.checkedOperator = btn;
    this.operation.setOperator(this.checkedOperator.value);
    this.updateDisplay();
  }

  resolveOperation() {
    this.operation.resolveOperation();

    this.checkedOperator.checked = false;
    this.checkedOperator = null;
    this.updateDisplay();
  }

  updateDisplay() {
    this.display.update(this.operation.formatNumber());
  }

  keyDownAc() {
    this.eraseElement.classList.add('active')
  }

  keyUpAc() {
    setTimeout(
      () => this.eraseElement.classList.remove('active'),
      Calculator.ACTIVE_STYLE_DURATION
    );

    this.eraseElement.click();
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
        calculator.keyUpDigit(key);
        break;
      case Calculator.SEP_KEYS.test(key):
        calculator.pressSeparator();
        break;
      case Calculator.OPERATOR_KEYS.test(key):
        calculator.pressOperator(convOperators[key]);
        break;
      case Calculator.EQUALS_KEYS.test(key):
        calculator.keyUpEquals();
        break;
      case Calculator.SPECIAL_KEYS.test(key):
        calculator.keyUpAc();
        break;
    }

    calculator.updateDisplay();
  }, false);

  document.addEventListener('keydown', evt => {
    const {key} = evt;
    switch (true) {
      case Calculator.DIGIT_KEYS.test(key):
        calculator.keyDownDigit(key);
        break;
      case Calculator.DELETE_KEYS.test(key):
        calculator.deleteDigit();
        break;
      case Calculator.EQUALS_KEYS.test(key):
        calculator.keyDownEquals();
        break;
      case Calculator.SPECIAL_KEYS.test(key):
        calculator.keyDownAc();
        break;
    }
  });

} else {
  browserNotCompatibleError();
}