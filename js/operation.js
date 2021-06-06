class Operation {
  static OPERATORS = [
    'sum', 'division', 'subtraction', 'multiplication'
  ]

  static MAX_DIGITS = 9;
  static DECIMAL_SEP = null;
  static THOUSAND_SEP = null;

  constructor() {
    this.operands = [];
    this.operator = null;
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
      alert(`Não é possível inserir mais de ${Operation.MAX_DIGITS} dígitos`);
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

  addDecimal(separator) {
    if (separator === Operation.DECIMAL_SEP) {
      console.debug(`decimal separator: ${separator}`)

      if (this.reachedDigitLimit()) {
        alert(`Não é possível inserir mais de ${Operation.MAX_DIGITS} dígitos`);
        return;
      }

      this.currentOperand += '.0';
    } else {
      console.debug(`thousand separator: ${separator}`)
    }
  }

  deleteDigit() {
    if (this.currentOperand.length === 1) {
      this.currentOperand = '0';
    }

    this.currentOperand = this.currentOperand.substring(0, this.currentOperand.length - 1);
  }

  reachedDigitLimit() {
    let digits = [...this.currentOperand.matchAll(/\d/g)];
    return digits.length >= Operation.MAX_DIGITS;
  }

  getCurrentOperand() {
    return this.currentOperand;
  }
}

export default Operation;