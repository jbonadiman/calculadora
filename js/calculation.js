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

    //this.expression = new Expression();
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

    if (this.currentOperand === '0') {
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
      this.currentOperand = '0';
    }

    this.currentOperand = this.currentOperand.substring(0, this.currentOperand.length - 1);
  }

  resetOperand() {
    this.currentOperand = '0';
  }

  deleteOperation() {
    this.expression = new Expression();
    this.currentOperand = '0'
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
    let normalizedOperand = this.currentOperand.replaceAll(Operation.THOUSAND_SEP, '');
    normalizedOperand = this.currentOperand.replaceAll(Operation.DECIMAL_SEP, '.');

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
    if (this.lastOperator === null) {
      this.accumulatedValue = this.getOperandAsNumber();
    } else {
      this.accumulate();
    }

    this.lastOperator = this.currentOperator;
    this.currentOperator = operator;

    // this.expression.operation = operator;
    // this.expression.operands.push(Number(this.currentOperand));
    this.resetOperand();
  }

  resolveOperation() {
    if (!this.currentOperator) {
      return;
    }

    this.accumulate();

    this.lastOperator = this.currentOperator = null;
    this.currentOperand = `${this.accumulatedValue}`;

    // this.expression.operands.push(Number(this.currentOperand));
    // this.currentOperand = this.expression.resolve();
    // this.expression = new Expression();
  }

  formatNumber() {
    const operandParts = this.currentOperand.split(Operation.DECIMAL_SEP);
    const secondPart = operandParts.length > 1? `,${operandParts[1]}` : '';

    return `${Operation.INTL.format(Number(operandParts[0]))}${secondPart}`;
  }

  isDecimal() {
    return this.currentOperand.match(new RegExp('\\' + Operation.DECIMAL_SEP));
  }
}

export class Expression {
  operation = undefined;
  operands = undefined;

  constructor(operation, ...operands) {
    this.operation = operation
    this.operands = operands;
  }

  sum() {
    return this.getSolvedOperands().reduce((op1, op2) => op1 + op2);
  }

  subtract() {
    return this.getSolvedOperands().reduce((op1, op2) => op1 - op2);

  }

  multiply() {
    return this.getSolvedOperands().reduce((op1, op2) => op1 * op2);
  }

  divide() {
    return this.getSolvedOperands().reduce((op1, op2) => op1 / op2);
  }

  resolve() {
    if (this.operation === undefined || this.operation === null) return Error('operation must be defined');
    return this[this.operation]();
  }

  getSolvedOperands() {
    return this.operands.map(op => {
      if (op instanceof Expression) {
        return op.resolve();
      }

      return op;
    });
  }

  toString() {
    let convOperands = {
      'sum': '+',
      'subtract': '-',
      'multiply': '*',
      'divide': '/',
    }

    return this.operands
      .map(op => {
        if (op instanceof Expression) {
          return op.toString();
        }

        return op;
      })
      .join(` ${convOperands[this.operation]} `);
  }
}