/**
 * @param {string} str
 * @param {string} delimiter
 * @returns
 */
export function toCamelCase(str, delimiter = '-') {
  const pattern = new RegExp('\\' + delimiter + '([a-z])', 'g');
  return str.replace(pattern, (match, capture) => capture.toUpperCase());
}
