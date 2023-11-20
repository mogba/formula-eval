// Define Abstract Syntax Tree (AST) nodes for different types of expressions
export type Expression = BinaryOperation | UnaryOperation | NumericLiteral;

export class BinaryOperation {
  operator: string;
  left: Expression | undefined;
  right: Expression | undefined;

  constructor(operator: string, left: Expression | undefined, right: Expression | undefined) {
    this.operator = operator;
    this.left = left;
    this.right = right;
  }
}

export class UnaryOperation {
  operator: string;
  operand: Expression;

  constructor(operator: string, operand: Expression) {
    this.operator = operator;
    this.operand = operand;
  }
}

export class NumericLiteral {
  value: number;

  constructor(value: number) {
    this.value = value;
  }
}
