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
  });
}

let browserNotCompatibleError = function () {
  console.error('Browser not compatible!');
}

class Calculator {
  static DIGIT_KEYS = /^\d$/;
  static SEP_KEYS = /^[,.]$/;
  static OPERATOR_KEYS = /^[\/*\-+]$/;
  static EQUALS_KEYS = /^Enter$|^=$/;
  static DELETE_KEY = /^Backspace$/;
  static AC_KEY = /^Delete$/;
  static PERCENT_KEY = /^%$/;

  static ACTIVE_STYLE_DURATION = 200;

  constructor() {
    this.display = new Display();
    this.operation = new Operation();

    this.display.update(this.operation.formatNumber());

    this.currentOperator = null;
    this.digitsElements = [...document.getElementsByClassName('digit')]
      .reduce((acc, element) => {
        acc[element.textContent] = element;
        return acc;
      }, {});

    this.eraseElement = document.getElementById('erase');
    this.signElement = document.getElementById('sign');
    this.percentageElement = document.getElementById('percent');

    this.operatorsElements = [...document.getElementsByName('operator')]
      .filter(btn => btn.id !== 'equals');

    this.equalsElement = document.getElementById('equals');

    if (this.percentageElement.addEventListener) {
      this.percentageElement.addEventListener(
        'click',
        () => this.getPercentage(),
        false
      );
    } else {
      browserNotCompatibleError();
    }

    if (this.signElement.addEventListener) {
      this.signElement.addEventListener(
        'click',
        () => this.changeSign(),
        false
      );
    } else {
      browserNotCompatibleError();
    }

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
            () => {
              alert('dentro do click');
              this.setOperator(btn);
            },
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

    this.digitsElements['.'].textContent = Operation.DECIMAL_SEP;

    Object.values(this.digitsElements)
      .forEach(btn => {
        if (btn.addEventListener) {
          if (btn.textContent.match(/\d/)) {
            btn.addEventListener('click', () => {
              this.operation.addDigit(btn.textContent);

              if (this.currentOperator) {
                this.currentOperator.checked = false;
              }

              this.eraseElement.changeAcText();
              this.updateDisplay();
            }, false);
          } else if (btn.textContent === Operation.DECIMAL_SEP) {
            btn.addEventListener('click', () => this.pressSeparator(), false);
          }
        } else {
          browserNotCompatibleError();
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
    const button = this.digitsElements[digit];
    setTimeout(
      () => button.classList.remove('active'),
      Calculator.ACTIVE_STYLE_DURATION
    );

    button.click();
  }

  keyDownDigit(digit) {
    const button = this.digitsElements[digit];
    button.classList.add('active')
  }

  keyDownAc() {
    this.eraseElement.classList.add('active');
  }

  keyUpAc() {
    setTimeout(
      () => this.eraseElement.classList.remove('active'),
      Calculator.ACTIVE_STYLE_DURATION
    );

    this.eraseElement.click();
  }

  keyDownPercent() {
    this.percentageElement.classList.add('active');
  }

  keyUpPercent() {
    this.percentageElement.click();
    setTimeout(
      () => this.percentageElement.classList.remove('active'),
      Calculator.ACTIVE_STYLE_DURATION
    );
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

    if (this.currentOperator) {
      this.currentOperator.checked = false;
      this.currentOperator = null;
    }

    this.updateDisplay();
  }

  setOperator(btn) {
    this.currentOperator = btn;
    this.operation.setOperator(this.currentOperator.value);
    this.updateDisplay();
  }

  resolveOperation() {
    this.operation.resolveOperation();

    if (this.currentOperator) {
      this.currentOperator.checked = false;
      this.currentOperator = null;
    }

    this.updateDisplay();
  }

  updateDisplay() {
    this.display.update(this.operation.formatNumber());
  }

  changeSign() {
    this.operation.toggleSign();
    this.updateDisplay();
  }

  getPercentage() {
    this.operation.getPercentage();
    this.updateDisplay();
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
      case Calculator.AC_KEY.test(key):
        calculator.keyUpAc();
        break;
      case Calculator.PERCENT_KEY.test(key):
        calculator.keyUpPercent();
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
      case Calculator.DELETE_KEY.test(key):
        calculator.deleteDigit();
        break;
      case Calculator.EQUALS_KEYS.test(key):
        calculator.keyDownEquals();
        break;
      case Calculator.AC_KEY.test(key):
        calculator.keyDownAc();
        break;
      case Calculator.PERCENT_KEY.test(key):
        calculator.keyDownPercent();
        break;
    }
  });

} else {
  browserNotCompatibleError();
}