export function parseString(str: string | null | undefined, emptyIndicator: string = '-') {
  return str || emptyIndicator;
}
