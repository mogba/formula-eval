export function replaceVariables(
  expression: string,
  variables: Record<string, number>,
): string {
  return expression.replace(/[a-zA-Z_][a-zA-Z0-9_]*/g, (match) => {
    const variableName = match.trim();
    if (!variables.hasOwnProperty(variableName)) {
      // Keep the original variable if not found in the map
      return match;
    }

    return variables?.[variableName]?.toString() || "0";
  });
}
