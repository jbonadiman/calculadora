export class Operation {
  static MAX_DIGITS = 9;
  static DECIMAL_SEP = null;
  static THOUSAND_SEP = null;
  static INTL = Intl.NumberFormat(undefined, {
    maximumFractionDigits: 8
  });

  constructor() {
    this.op = {
      'sum': (a, b) => a + b,
      'subtract': (a, b) => a - b,
      'divide': (a, b) => a / b,
      'multiply': (a, b) => a * b,
    }

    this.currentOperand = '0'
    this.accumulatedValue = 0;

    this.currentOperator = null;
    this.lastOperator = null;

    if (!Operation.DECIMAL_SEP || !Operation.THOUSAND_SEP) {
      const parts =
        Intl.NumberFormat()
          .formatToParts(1000.1);

      Operation.DECIMAL_SEP = parts
        .find(part => part.type === 'decimal')
        .value;

      Operation.THOUSAND_SEP = parts
        .find(part => part.type === 'group')
        .value;
    }
  }

  addDigit(stringDigit) {
    if (this.reachedDigitLimit()) {
      return;
    }

    if (this.isOperandZeroed()) {
      this.currentOperand = stringDigit.trim();
    } else {
      this.currentOperand += stringDigit.trim();
    }
  }

  addDecimal() {
    if (this.reachedDigitLimit() || this.isDecimal()) {
      return;
    }

    this.currentOperand += Operation.DECIMAL_SEP;
  }

  deleteDigit() {
    if (this.currentOperand.length === 1) {
      this.resetOperand();
    }

    this.currentOperand = this.currentOperand.substring(0, this.currentOperand.length - 1);
  }

  resetOperand() {
    this.currentOperand = '0';
  }

  resetOperator() {
    this.lastOperator = null;
    this.currentOperator = null;
  }

  deleteOperation() {
    this.resetOperand();
    this.resetOperator();
    this.accumulatedValue = 0;
  }

  reachedDigitLimit() {
    let digits = [...this.currentOperand.matchAll(/\d/g)];

    if (digits.length >= Operation.MAX_DIGITS) {
      alert(`Não é possível inserir mais de ${Operation.MAX_DIGITS} dígitos`);
      return true;
    }

    return false;
  }

  getCurrentOperand() {
    return this.currentOperand;
  }

  getOperandAsNumber() {
    alert('test of error ' + this.currentOperand.replaceAll(Operation.THOUSAND_SEP, ''));

    let normalizedOperand = this.currentOperand.replaceAll(Operation.THOUSAND_SEP, '');
    alert('before ' + normalizedOperand)
    normalizedOperand = this.currentOperand.replaceAll(Operation.DECIMAL_SEP, '.');
    alert('after' + normalizedOperand);

    alert('as number ' + Number(normalizedOperand));
    return Number(normalizedOperand);
  }

  isOperandZeroed() {
    return Number(this.currentOperand) === 0;
  }

  accumulate() {
    this.accumulatedValue = this.op[this.currentOperator](
      this.accumulatedValue,
      this.getOperandAsNumber()
    );
  }

  setOperator(operator) {
    if (!this.lastOperator) {
      alert('inside if');
      this.accumulatedValue = this.getOperandAsNumber();
    } else {
      alert('inside else');
      this.accumulate();
    }

    this.currentOperator = operator;
    this.lastOperator = this.currentOperator;

    alert('resetting operand');
    this.resetOperand();
  }

  resolveOperation() {
    if (!this.currentOperator) {
      return;
    }

    this.accumulate();
    this.lastOperator = this.currentOperator = null;
    this.currentOperand = `${this.accumulatedValue}`;
  }

  formatNumber() {
    const operandParts = this.currentOperand.split(Operation.DECIMAL_SEP);
    const secondPart = operandParts.length > 1 ? `${Operation.DECIMAL_SEP}${operandParts[1]}` : '';

    return `${Operation.INTL.format(Number(operandParts[0]))}${secondPart}`;
  }

  isDecimal() {
    return this.currentOperand.match(new RegExp('\\' + Operation.DECIMAL_SEP));
  }

  toggleSign() {
    if (this.isOperandZeroed()) return;

    if (this.currentOperand.startsWith('-')) {
      this.currentOperand = this.currentOperand.replace('-', '');
    } else {
      this.currentOperand = `-${this.currentOperand}`;
    }
  }

  getPercentage() {
    this.currentOperand = `${(this.accumulatedValue / 100) * this.getOperandAsNumber()}`;
  }
}