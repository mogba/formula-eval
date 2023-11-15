// Define Abstract Syntax Tree (AST) nodes for different types of expressions
type Operand = UnaryOperation | NumericLiteral;

class BinaryExpression {
  operator: string;
  left: BinaryExpression | Operand | undefined;
  right: BinaryExpression | Operand | undefined;

  constructor(
    operator: string,
    left: BinaryExpression | Operand | undefined,
    right: BinaryExpression | Operand | undefined,
  ) {
    this.operator = operator;
    this.left = left;
    this.right = right;
  }
}

class UnaryOperation {
  operator: string;
  operand: Operand;

  constructor(operator: string, operand: Operand) {
    this.operator = operator;
    this.operand = operand;
  }
}

class NumericLiteral {
  value: number;

  constructor(value: number) {
    this.value = value;
  }

  /**
   * Overrides default JS toString to return the
   * numeric literal value parsed as string.
   * @returns String-parsed value
   */
  toString() {
    return String(this.value);
  }
}

/**
 * Parses an arithmetic expression into an Abstract Syntax Tree (AST).
 * @param {string} expression - The arithmetic expression to parse.
 * @returns {BinaryExpression | Operand | undefined} - The root node of the AST.
 */
function parseExpression(
  expression: string,
): BinaryExpression | Operand | undefined {
  const arithmeticOperators = ["+", "-", "*", "/"];
  const unaryOperators = ["+", "-"];

  // Split expression into tokens using regex.
  // The array is reversed so the code can remove tokens from the tail instead
  // of the head, seing that Array.shift() is O(n) and Array.pop() is O(1).
  const tokens = expression.match(/\d+|\+|\-|\*|\/|\(|\)/g)?.reverse();
  const hasTokens = () => tokens && tokens.length > 0;

  if (!hasTokens()) {
    return undefined;
  }

  // First token refers to the head of the original unreversed array.
  const removeAndGetFirstToken = () => tokens?.pop() as string;

  function parsePrimary(): BinaryExpression | Operand | undefined {
    const token = removeAndGetFirstToken();

    if (token === "(") {
      const result = parseBinaryExpression();

      // Consume the closing parenthesis
      removeAndGetFirstToken();

      return result;
    }

    if (unaryOperators.includes(token)) {
      const operand = parsePrimary() as NumericLiteral;

      return new NumericLiteral(parseFloat(`${token}${operand}`));
    }

    return new NumericLiteral(parseFloat(token));
  }

  function parseBinaryExpression(): BinaryExpression | Operand | undefined {
    let left = parsePrimary();
    // (50 / 100)

    while (
      hasTokens() &&
      arithmeticOperators.includes(tokens![tokens!.length - 1] || "")
    ) {
      let operator = removeAndGetFirstToken();
      // -

      let right = parsePrimary();
      // ((97 / 100) * (42 / 100))

      if (
        unaryOperators.includes(operator) &&
        arithmeticOperators.includes(tokens![tokens!.length - 1] || "")
      ) {
        //   // if (right instanceof BinaryExpression && !unaryOperators.includes(right.operator)) {
        //   //   right.left =
        //   // }
        right = new BinaryExpression(operator, left, right);

        operator = removeAndGetFirstToken();

        left = parsePrimary();

        left = new BinaryExpression(operator, right, left);

        //   left = new BinaryExpression(operator, new BinaryExpression(operator, right, left), left);
      }

      left = new BinaryExpression(operator, left, right);
    }

    return left;
  }

  // ((50 / 100) - ((97 / 100) * (42 / 100))) * 140000

  // (50 / 100) - ((97 / 100) * (42 / 100)) * 140000
  return parseBinaryExpression();
}

type Operand_fix = BinaryExpression | UnaryOperation | NumericLiteral;

function parseExpression_fix(expression) {
  const arithmeticOperators = ["+", "-", "*", "/"];
  const unaryOperators = ["+", "-"];

  // Matches integers or floating numbers and parenthesis
  const tokens = expression.match(/\d+(\.\d+)?|\+|\-|\*|\/|\(|\)/g);

  // Split expression into tokens using regex.
  // The array is reversed so the code can remove tokens from the tail instead
  // of the head, seing that Array.shift() is O(n) and Array.pop() is O(1).
  const tokensReversed = tokens?.reverse();

  const hasTokens = () => tokensReversed && tokensReversed.length > 0;

  if (!hasTokens()) {
    return undefined;
  }

  const stack: Operand_fix[] = [];
  const operators: string[] = [];

  const getOperatorPriority = (operator: string): number => {
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

  // First token refers to the head of the original unreversed array.
  const removeAndGetFirstToken = () => tokensReversed?.pop() as string;

  const isDigit = (token: string) => /\d+/.test(token);

  const applyStack = () => {
    const operator = operators.pop() as string;
    const right = stack.pop() as Operand;
    const left = stack.pop() as Operand;

    if (!left) {
      stack.push(new UnaryOperation(operator, right));
    } else {
      stack.push(new BinaryExpression(operator, left, right));
    }
  };

  const applyHigherPriorityOperators = (currentOperator: string) => {
    const lastOperatorPriority = getOperatorPriority(
      operators[operators.length - 1] || "",
    );
    const currentOperatorPriority = getOperatorPriority(currentOperator);

    while (
      !currentOperator
        ? operators.length > 0
        : operators.length > 0 &&
          lastOperatorPriority >= currentOperatorPriority
    ) {
      applyStack();
    }
  };

  const toTest = () => {
    // token = -
    let token = removeAndGetFirstToken();

    // if (token === "(") {
    // token = 50
    // token = removeAndGetFirstToken();

    if (token === ")") {
      //applyStack();
    } else if (isDigit(token)) {
      stack.push(new NumericLiteral(parseFloat(token)));
    } else if (/[\+\-\*\/]/.test(token)) {
      applyHigherPriorityOperators(token);
      operators.push(token);
    }

    // token = 140000
    token = removeAndGetFirstToken();

    if (token === ")") {
      //applyStack();
    } else if (isDigit(token)) {
      stack.push(new NumericLiteral(parseFloat(token)));
    } else if (/[\+\-\*\/]/.test(token)) {
      applyHigherPriorityOperators(token);
      operators.push(token);
    }

    // token = *
    token = removeAndGetFirstToken();

    if (token === ")") {
      //applyStack();
    } else if (isDigit(token)) {
      stack.push(new NumericLiteral(parseFloat(token)));
    } else if (/[\+\-\*\/]/.test(token)) {
      applyHigherPriorityOperators(token);
      operators.push(token);
    }

    // token = (, ignore parenthesis
    token = removeAndGetFirstToken();

    if (token === ")") {
      //applyStack();
    } else if (isDigit(token)) {
      stack.push(new NumericLiteral(parseFloat(token)));
    } else if (/[\+\-\*\/]/.test(token)) {
      applyHigherPriorityOperators(token);
      operators.push(token);
    }

    // First test ends here, token = 1st -, 2nd *, 3rd *
    // Second test, token = -
    token = removeAndGetFirstToken();

    if (token === ")") {
      //applyStack();
    } else if (isDigit(token)) {
      stack.push(new NumericLiteral(parseFloat(token)));
    } else if (/[\+\-\*\/]/.test(token)) {
      applyHigherPriorityOperators(token);
      operators.push(token);
    }

    // Second test extras
    // token = 50
    token = removeAndGetFirstToken();

    if (token === ")") {
      //applyStack();
    } else if (isDigit(token)) {
      stack.push(new NumericLiteral(parseFloat(token)));
    } else if (/[\+\-\*\/]/.test(token)) {
      applyHigherPriorityOperators(token);
      operators.push(token);
    }

    // token = /
    token = removeAndGetFirstToken();

    if (token === ")") {
      //applyStack();
    } else if (isDigit(token)) {
      stack.push(new NumericLiteral(parseFloat(token)));
    } else if (/[\+\-\*\/]/.test(token)) {
      applyHigherPriorityOperators(token);
      operators.push(token);
    }

    // token = 100
    token = removeAndGetFirstToken();

    if (token === ")") {
      //applyStack();
    } else if (isDigit(token)) {
      stack.push(new NumericLiteral(parseFloat(token)));
    } else if (/[\+\-\*\/]/.test(token)) {
      applyHigherPriorityOperators(token);
      operators.push(token);
    }

    // token = -
    token = removeAndGetFirstToken();

    if (token === ")") {
      //applyStack();
    } else if (isDigit(token)) {
      stack.push(new NumericLiteral(parseFloat(token)));
    } else if (/[\+\-\*\/]/.test(token)) {
      applyHigherPriorityOperators(token);
      operators.push(token);
    }

    // stack = [140000, BinaryExpression(/, 50, 100)]
    // stack = [-, *]

    // token = -
    token = removeAndGetFirstToken();

    if (token === ")") {
      //applyStack();
    } else if (isDigit(token)) {
      stack.push(new NumericLiteral(parseFloat(token)));
    } else if (/[\+\-\*\/]/.test(token)) {
      applyHigherPriorityOperators(token);
      operators.push(token);
    }
    // }

    applyHigherPriorityOperators(token);
  };

  /**
   * First test
   *
   * Formula: (50 / 100) - (97 / 100) * (42 / 100) * 140000
   *
   * Ignoring parenthesis
   * 3rd iteration, formula = (50 / 100) - ((97 / 100) * (42 / 100)) * 140000
   * 4th iteration, formula = (50 / 100) - (((97 / 100) * (42 / 100)) * 140000)
   *
   * Correct
   *
   * Second test
   *
   * Formula: - 140000 * (-50 / 100) - (97 / + 100) * (42 / 100)
   *
   */
  toTest();
}

export {
  BinaryExpression,
  UnaryOperation,
  NumericLiteral,
  Operand,
  parseExpression,
};
