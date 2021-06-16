// prettier-ignore
export function hasStyleTransition(element: Element): boolean {
  const style = getComputedStyle(element);
  if (style.transitionProperty === 'none') {
    return false;
  }
  let sum = 0;
  sum += style.transitionDuration
    .split(',').map((x) => parseFloat(x)).reduce((a, b) => a + b);
  sum += style.transitionDelay
    .split(',').map((x) => parseFloat(x)).reduce((a, b) => a + b);
  return sum > 0;
}
