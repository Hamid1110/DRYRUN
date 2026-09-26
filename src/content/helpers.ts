// Helpers for writing lesson content.

/** C++ code without escaping backslashes: cpp`cout << "A\nB";` keeps the \n as two characters. */
export const cpp = (s: TemplateStringsArray, ...v: unknown[]): string => String.raw(s, ...v).replace(/^\n/, '');

/**
 * Wrap statements in the standard skeleton.
 * Line numbers: 1 #include, 2 using, 3 blank, 4 int main() {, body starts at line 5.
 * With extra includes (e.g. '#include <iomanip>\n') everything shifts down.
 */
export function prog(body: string, extraIncludes = ''): string {
  const b = body.replace(/^\n/, '').replace(/\n$/, '');
  return `${extraIncludes}#include <iostream>\nusing namespace std;\n\nint main() {\n${b}\n    return 0;\n}\n`;
}

/**
 * Program with functions (or a struct) written above main.
 * Layout: #include lines, using, blank, the `top` code, blank, int main() {, body, return 0; }
 * Use `npx tsx scripts/unit-tool.ts --file=... lines <id>` to see the line numbers.
 */
export function progF(top: string, body: string, extraIncludes = ''): string {
  const t = top.replace(/^\n/, '').replace(/\n$/, '');
  const b = body.replace(/^\n/, '').replace(/\n$/, '');
  return `${extraIncludes}#include <iostream>\nusing namespace std;\n\n${t}\n\nint main() {\n${b}\n    return 0;\n}\n`;
}
