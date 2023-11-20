import { Expression, BinaryOperation, UnaryOperation, NumericLiteral } from "./ast-types";

const hasTokens = (tokens: string[] | undefined) => tokens && tokens.length > 0;

const getOperatorPriority = (operator?: string): number => {
  switch (operator) {
    case "+":
    case "-":
      return 1;
    case "*":
    case "/":
      return 2;
    default:
      return 0; // Default priority for literals
  }
};

const isDigit = (token: string) => /\d+/.test(token);

const isUnaryOperator = (token: string): boolean => /[\+\-]/.test(token);

const isArithmeticOperator = (token: string): boolean => /[\+\-\*\/]/.test(token);

function parseExpression(expression: string): Expression | undefined {
  // Matches integers or floating numbers and parenthesis
  const tokens = (expression.match(/\d+(\.\d+)?|\+|\-|\*|\/|\(|\)/g) || []) as string[];

  // Split expression into tokens using regex.
  // The array is reversed so the code can remove tokens from the tail instead
  // of the head, seing that Array.shift() is O(n) and Array.pop() is O(1).
  let tokensReversed = Array.from(tokens).reverse();

  if (!hasTokens(tokensReversed)) {
    return undefined;
  }

  const stack: Expression[] = [];
  const operators: string[] = [];

  // First token refers to the head of the original unreversed array.
  const removeAndGetFirstToken = () => tokensReversed?.pop() as string;

  const applyHigherPriorityOperators = (currentOperator?: string) => {
    const lastOperatorPriority = getOperatorPriority(operators[operators.length - 1] || "");
    const currentOperatorPriority = getOperatorPriority(currentOperator);

    const hasEnoughElementsForBinaryOperation = stack.length >= 2;

    while (
      hasEnoughElementsForBinaryOperation &&
      operators.length > 0 &&
      (!currentOperator || lastOperatorPriority >= currentOperatorPriority)
    ) {
      const operator = operators.pop() as string;
      const right = stack.pop() as Expression;
      const left = stack.pop() as Expression;

      stack.push(new BinaryOperation(operator, left, right));
    }
  };

  const parseToken = (): Expression | undefined => {
    // Og formula: - 140000 * (- 50 / 100) - (97 + 100) * (42 / 100)
    // Reversed: ) 100 / 42 ( * ) 100 + 97 ( - ) 100 / 50 - ( * 140000 -
    // The formula is reversed so the token can be removed from the tail with an O(1) time complexity

    // Testing a scenario with parenthis, starting from here
    // (-50 / 100) - (97 + 100) * (42 / 100)
    // Again, at this point, the code handles just tokensReversed, so the actual formula is:
    // ) 100 / 42 ( * ) 100 + 97 ( - ) 100 / 50 - (

    let token = removeAndGetFirstToken();
    // Popped the opening parenthesis at the end of tokensReversed
    // ) 100 / 42 ( * ) 100 + 97 ( - ) 100 / 50 -

    if (!token) {
      // If there's no token, it means the whole expression have been parsed.
      // It's time to organize the last stack elements and the operators together.
      applyHigherPriorityOperators();

      // All stack elements have been organized into a tree with a single root element,
      // which is the tree's starting point, therefore the root element should be returned.
      return stack[0];
    } else if (token === "(") {
      // Expressions within parenthesis will be removed from the original expression
      // and handled separately as an independent expression.

      // Gets the expression within parenthesis by identifying where it ends through the
      // closing parenthesis position. The closing parenthesis is not included in the new expression.
      const closingParenthesisIndex = tokensReversed.lastIndexOf(")");
      const parenthesisExpression = tokensReversed
        .slice(closingParenthesisIndex + 1, tokensReversed.length)
        .reverse()
        .join("");
      // Resulting expression (not reversed):
      // -50/100

      let result = parseExpression(parenthesisExpression) as Expression;

      // It's necessary to check if the token before the expresionn is an unary operator.
      // If it is, then the expression needs to be added to the stack as an unary operation.
      // E.g. the root element of this expression would be considered as an unary operation: - ( 3 * 2 )

      // -2 = -1 (index of opening parenthesis) -1 (preceding index)
      const indexBeforeToken = tokens.length - tokensReversed.length - 2;
      const tokenBeforeOpenParenthesis = tokens[indexBeforeToken] as string;
      const secondTokenBeforeOpenParenthesis = tokens[indexBeforeToken - 1] as string;

      if (
        isUnaryOperator(tokenBeforeOpenParenthesis) &&
        (!secondTokenBeforeOpenParenthesis || isArithmeticOperator(secondTokenBeforeOpenParenthesis))
      ) {
        result = new UnaryOperation(tokenBeforeOpenParenthesis, result);

        operators.pop();
      }

      stack.push(result);

      // Remove parenthesisExpression and closing parenthesis character.
      tokensReversed = tokensReversed.slice(0, closingParenthesisIndex);
      // The expression within parenthesis and the closing parenthesis were removed: ) 100 / 50 -
      // The original expression is now: ) 100 / 42 ( * ) 100 + 97 ( -
    } else if (isDigit(token)) {
      let operation: UnaryOperation | NumericLiteral = new NumericLiteral(parseFloat(token));

      // Check if the token before the digit is a unary operator.
      // -2 = -1 (from length to index) -1 (preceding index)
      const indexBeforeToken = tokens.length - tokensReversed.length - 2;
      const firstTokenBeforeDigit = tokens[indexBeforeToken] as string;
      const secondTokenBeforeDigit = tokens[indexBeforeToken - 1] as string;

      if (isUnaryOperator(firstTokenBeforeDigit) && (!secondTokenBeforeDigit || isArithmeticOperator(secondTokenBeforeDigit))) {
        operation = new UnaryOperation(firstTokenBeforeDigit, operation);

        // Remove the last operator because it was joined with
        // the digit in the stack as an unary operation.
        operators.pop();
      }

      stack.push(operation);
    } else if (isArithmeticOperator(token)) {
      applyHigherPriorityOperators(token);
      operators.push(token);
    }

    // Go to the next token.
    return parseToken();
  };

  return parseToken();
}

export { parseExpression };
