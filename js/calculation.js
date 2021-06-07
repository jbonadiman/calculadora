export class Operation {
  static MAX_DIGITS = 9;
  static DECIMAL_SEP = null;
  static THOUSAND_SEP = null;

  constructor() {
    this.expression = new Expression();
    this.currentOperand = '0'
    this.value = 0;

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

    if (this.currentOperand.endsWith('.0')) {
      this.currentOperand = this.currentOperand.replace('.0', `.${stringDigit.trim()}`);
    } else if (Number(this.currentOperand) === 0) {
      this.currentOperand = stringDigit.trim();
    } else {
      this.currentOperand += stringDigit.trim();
    }
  }

  addDecimal() {
    if (this.reachedDigitLimit()) {
      return;
    }

    this.currentOperand += '.0';
  }

  deleteDigit() {
    if (this.currentOperand.length === 1) {
      this.currentOperand = '0';
    }

    this.currentOperand = this.currentOperand.substring(0, this.currentOperand.length - 1);
  }

  deleteOperand() {
    this.currentOperand = '0';
  }

  deleteOperation() {
    this.expression = new Expression();
    this.currentOperand = '0'
    this.value = 0;
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

  isOperandZeroed() {
    return Number(this.currentOperand) === 0;
  }

  setOperator(operator) {
    this.expression.operation = operator;
    this.expression.operands.push(Number(this.currentOperand));
    this.currentOperand = '0';
  }

  resolveOperation() {
    this.expression.operands.push(Number(this.currentOperand));
    this.currentOperand = this.expression.resolve();
    this.expression = new Expression();
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