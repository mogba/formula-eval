import { evaluate } from "./ast-evaluator";
import { parseExpression } from "./expression-to-ast-parser";

describe("AST Evaluation", () => {
  // Test case 1
  xtest("evaluates a simple addition expression", () => {
    const ast = parseExpression("2 + 3");
    const result = evaluate(ast);
    expect(result).toBe(5);
  });

  // Test case 3
  xtest("handles undefined AST gracefully", () => {
    const ast = undefined;
    const result = evaluate(ast);
    expect(result).toBeUndefined();
  });

  // Test case 4
  xtest("evaluates an expression with unary operations", () => {
    const ast = parseExpression("-3 + 5");
    const result = evaluate(ast);
    expect(result).toBe(2);
  });

  // Test case 5
  xtest("handles division by zero gracefully", () => {
    const ast = parseExpression("1 / 0");
    const result = evaluate(ast);
    expect(result).toBeUndefined();
  });

  // Test case ----
  xtest("handles single numeric literal", () => {
    const ast = parseExpression("-10");
    const result = evaluate(ast);
    expect(result).toBe(-10);
  });

  // Test case 6
  xtest("evaluates a complex expression", () => {
    /**
     * bf with variables: (int_time_dedication_target_document / 100) * (flt_total_achievement_score / 100) * (flt_band_multiplier / 100) * flt_salary
     * bf: (50 / 100) * (97 / 100) * (42 / 100) * 140000
     */

    const ast = parseExpression("(50 / 100) * (97 / 100) * (42 / 100) * 140000");

    const result = evaluate(ast);
    expect(result).toBe(28518);

    // the correct order to calculate the formula args is not respected
    // the calculation of the formula above happens in the following order:
    // 50/(100*(97/(100*(42/(140000*100)))))
    // the result is: 0.0000015463917525773197
  });

  // Add more test cases as needed
});
