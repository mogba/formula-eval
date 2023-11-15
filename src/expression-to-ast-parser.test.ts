import { parseExpression, BinaryExpression, UnaryOperation, NumericLiteral } from "./expression-to-ast-parser"; // Assuming your parser code is in a separate file

describe("Expression Parser", () => {
  xtest("should parse basic addition", () => {
    // Arrange
    const expression = "2 + 3";
    const expected = new BinaryExpression("+", new NumericLiteral(2), new NumericLiteral(3));

    // Act
    const ast = parseExpression(expression);

    // Arrange
    expect(ast).toEqual(expected);
  });

  xtest("should handle parentheses correctly", () => {
    // Arrange
    const expression = "2 * (3 + 4)";
    const expected = new BinaryExpression(
      "*",
      new NumericLiteral(2),
      new BinaryExpression("+", new NumericLiteral(3), new NumericLiteral(4)),
    );

    // Act
    const ast = parseExpression(expression);

    // Assert
    expect(ast).toEqual(expected);
  });

  xtest("should parse unary operators", () => {
    // Arrange
    const expression = "-5 * 2";
    const expected = new BinaryExpression("*", new UnaryOperation("-", new NumericLiteral(5)), new NumericLiteral(2));

    // Act
    const ast = parseExpression(expression);

    // Asert
    expect(ast).toEqual(expected);
  });

  xtest("should handle complex expressions", () => {
    // Arrange
    const expression = "2 * (3 - 4) / -2";
    const expected = new BinaryExpression(
      "/",
      new BinaryExpression("*", new NumericLiteral(2), new BinaryExpression("-", new NumericLiteral(3), new NumericLiteral(4))),
      new UnaryOperation("-", new NumericLiteral(2)),
    );

    // Act
    const ast = parseExpression(expression);

    // Assert
    expect(ast).toEqual(expected);
  });

  xtest("should handle multiple parenthesis expressions", () => {
    // Arrange
    const expression = "(50 / 100) - (97 / 100) * (42 / 100) * 140000";
    const expected = new BinaryExpression(
      "*",
      new BinaryExpression(
        "*",
        new BinaryExpression(
          "-",
          new BinaryExpression("/", new NumericLiteral(50), new NumericLiteral(100)),
          new BinaryExpression("/", new NumericLiteral(97), new NumericLiteral(100)),
        ),
        new BinaryExpression("/", new NumericLiteral(42), new NumericLiteral(100)),
      ),
      new NumericLiteral(140000),
    );

    // Act
    const ast = parseExpression(expression);

    // Assert
    expect(ast).toEqual(expected);
  });

  test("should handle multiple parenthesis expressions 2", () => {
    // Arrange
    const expression = "(50 / 100) - ((97 / 100) * (42 / 100)) * 140000";

    const expected = new BinaryExpression(
      "*",
      new BinaryExpression(
        "*",
        new BinaryExpression(
          "-",
          new BinaryExpression("/", new NumericLiteral(50), new NumericLiteral(100)),
          new BinaryExpression("/", new NumericLiteral(97), new NumericLiteral(100)),
        ),
        new BinaryExpression("/", new NumericLiteral(42), new NumericLiteral(100)),
      ),
      new NumericLiteral(140000),
    );

    // Act
    const ast = parseExpression(expression);
    const ast2 = parseExpression("(50 / 100) - (97 / 100) * (42 / 100) * 140000");
    // Assert
    expect(ast).toEqual(expected);
  });
});
