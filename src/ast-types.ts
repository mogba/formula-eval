// Define Abstract Syntax Tree (AST) nodes for different types of expressions
type Expression = BinaryOperation | UnaryOperation | NumericLiteral;

class BinaryOperation {
  operator: string;
  left: Expression | undefined;
  right: Expression | undefined;

  constructor(operator: string, left: Expression | undefined, right: Expression | undefined) {
    this.operator = operator;
    this.left = left;
    this.right = right;
  }
}

class UnaryOperation {
  operator: string;
  operand: Expression;

  constructor(operator: string, operand: Expression) {
    this.operator = operator;
    this.operand = operand;
  }
}

class NumericLiteral {
  value: number;

  constructor(value: number) {
    this.value = value;
  }
}
