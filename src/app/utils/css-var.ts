export function cssStr(name: string): string;
export function cssStr(name: string, defaultValue: string): string;
// prettier-ignore
export function cssStr(name: string, defaultValue: string, element: Element): string;
export function cssStr(name: string, element: Element): string;
export function cssStr(name: string, ...args: (string | Element)[]): string {
  if (typeof args[0] === 'string') {
    const v = cssVar(name, args[1] as Element);
    return v || args[0];
  }
  return cssVar(name, args[0]);
}

export function cssNum(name: string): number;
export function cssNum(name: string, defaultValue: number): number;
// prettier-ignore
export function cssNum(name: string, defaultValue: number, element: Element): number;
export function cssNum(name: string, element: Element): number;
export function cssNum(name: string, ...args: (number | Element)[]): number {
  if (typeof args[0] === 'number') {
    const v = cssVar(name, args[1] as Element);
    return v ? parseFloat(v) : args[0];
  }
  return parseFloat(cssVar(name, args[0]));
}

function cssVar(name: string, element: Element): string {
  const style = getComputedStyle(element);
  return style.getPropertyValue(name).trim();
}
