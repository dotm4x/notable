export function joinClassNames(
  ...classNames: (string | false | null | undefined)[]
) {
  return classNames.filter(Boolean).join(' ');
}
