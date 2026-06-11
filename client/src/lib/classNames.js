export function mergeClassNames(...classNames) {
  return classNames.filter(Boolean).join(' ');
}
