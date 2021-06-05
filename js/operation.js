class Operation {
  static OPERATORS = [
    'sum', 'division', 'subtraction', 'multiplication'
  ]

  static MAX_DIGITS = 9;
  static INTL = Intl.NumberFormat();

  constructor() {
    this.operands = [];
    this.operator = null;
    this.currentOperand = '0'
    this.value = 0;
  }

  addDigit(stringDigit) {
    if (this.currentOperand.length >= Operation.MAX_DIGITS) {
      alert(`Não é possível inserir mais de ${Operation.MAX_DIGITS} dígitos`);
      return;
    }

    if (Number(this.currentOperand) === 0) {
      this.currentOperand = stringDigit.trim();
    } else {
      this.currentOperand += stringDigit.trim();
    }
  }

  getCurrentOperand() {
    return Operation.INTL.format(Number(this.currentOperand));
  }
}

export default Operation;