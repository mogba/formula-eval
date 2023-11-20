import { Expression, BinaryOperation, UnaryOperation, NumericLiteral } from "./ast-types";

// Evaluation function
function evaluate(ast: Expression | undefined): number | undefined {
  if (!ast) {
    return undefined;
  }

  // @ts-ignore
  switch (ast.operator) {
    case "+":
    case "*":
    case "/":
      return evaluateBinaryExpression(ast as BinaryOperation);
    case "-":
      return evaluateUnaryOperation(ast as UnaryOperation);
    default:
      return evaluateLiteral(ast as NumericLiteral);
  }
}

function evaluateBinaryExpression(ast: BinaryOperation): number | undefined {
  const leftValue = evaluate(ast.left);
  const rightValue = evaluate(ast.right);

  if (leftValue === undefined || rightValue === undefined) {
    return undefined;
  }

  switch (ast.operator) {
    case "+":
      return leftValue + rightValue;
    case "-":
      return leftValue - rightValue;
    case "*":
      return leftValue * rightValue;
    case "/":
      // Avoid division by zero
      return rightValue !== 0 ? leftValue / rightValue : undefined;
    default:
      return undefined;
  }
}

function evaluateUnaryOperation(ast: UnaryOperation): number | undefined {
  const operandValue = evaluate(ast.operand);

  return operandValue !== undefined ? -operandValue : undefined;
}

function evaluateLiteral(ast: NumericLiteral): number {
  return Number(ast.value.toFixed(2));
}

export { evaluate };
