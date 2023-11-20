import { BinaryOperation, NumericLiteral, UnaryOperation } from "./ast-types";
import { parseExpression } from "./expression-to-ast-parser";

describe("Expression Parser", () => {
  test("should parse basic addition", () => {
    // Arrange
    const expression = "2 + 3";
    const expected = new BinaryOperation("+", new NumericLiteral(2), new NumericLiteral(3));

    // Act
    const actual = parseExpression(expression);

    // Arrange
    expect(actual).toEqual(expected);
  });

  test("should handle parentheses correctly", () => {
    // Arrange
    const expression = "2 * (3 + 4)";
    const expected = new BinaryOperation(
      "*",
      new NumericLiteral(2),
      new BinaryOperation("+", new NumericLiteral(3), new NumericLiteral(4)),
    );

    // Act
    const actual = parseExpression(expression);

    // Assert
    expect(actual).toEqual(expected);
  });

  test("should parse unary operators", () => {
    // Arrange
    const expression = "-5 * 2";
    const expected = new BinaryOperation("*", new UnaryOperation("-", new NumericLiteral(5)), new NumericLiteral(2));

    // Act
    const actual = parseExpression(expression);

    // Asert
    expect(actual).toEqual(expected);
  });

  test("should handle higher priority arithmetic operator", () => {
    // Arrange
    const expression = "50 / 100";

    const expected = new BinaryOperation("/", new NumericLiteral(50), new NumericLiteral(100));

    // Act
    const actual = parseExpression(expression);

    // Assert
    expect(actual).toEqual(expected);
  });

  test("should handle parenthesis", () => {
    // Arrange
    const expression = "(50 / 100)";

    const expected = new BinaryOperation("/", new NumericLiteral(50), new NumericLiteral(100));

    // Act
    const actual = parseExpression(expression);

    // Assert
    expect(actual).toEqual(expected);
  });

  test("should handle expressions within parenthesis", () => {
    // Arrange
    const expression = "(50 / -100)";

    const expected = new BinaryOperation("/", new NumericLiteral(50), new UnaryOperation("-", new NumericLiteral(100)));

    // Act
    const actual = parseExpression(expression);

    // Assert
    expect(actual).toEqual(expected);
  });

  test("should handle sub expressions as unary operations", () => {
    // Arrange
    const expression = "-(-50 / -100)";

    const expected = new UnaryOperation(
      "-",
      new BinaryOperation("/", new UnaryOperation("-", new NumericLiteral(50)), new UnaryOperation("-", new NumericLiteral(100))),
    );

    // Act
    const actual = parseExpression(expression);

    // Assert
    expect(actual).toEqual(expected);
  });

  test("should hadle multiple operations and parenthesis", () => {
    // Arrange
    const expression = "+ 30 * (-50 / -100)";

    const expected = new BinaryOperation(
      "*",
      new UnaryOperation("+", new NumericLiteral(30)),
      new BinaryOperation("/", new UnaryOperation("-", new NumericLiteral(50)), new UnaryOperation("-", new NumericLiteral(100))),
    );

    // Act
    const actual = parseExpression(expression);

    // Assert
    expect(actual).toEqual(expected);
  });

  test.each(["(50 / 100) - (97 / 100) * (42 / 100) * 140000", "((50 / 100) - (97 / 100) * (42 / 100)) * 140000"])(
    "should correctly prioritize operations",
    (expression: string) => {
      // Arrange
      const expected = new BinaryOperation(
        "*",
        new BinaryOperation(
          "-",
          new BinaryOperation("/", new NumericLiteral(50), new NumericLiteral(100)),
          new BinaryOperation(
            "*",
            new BinaryOperation("/", new NumericLiteral(97), new NumericLiteral(100)),
            new BinaryOperation("/", new NumericLiteral(42), new NumericLiteral(100)),
          ),
        ),
        new NumericLiteral(140000),
      );

      // Act
      const actual = parseExpression(expression);

      console.log("expected", JSON.stringify(expected));
      console.log("actual", JSON.stringify(actual));

      // Assert
      expect(actual).toEqual(expected);
    },
  );
});
