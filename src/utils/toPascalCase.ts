export function toPascalCase(str: string) {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.substring(1))
    .join('');
}

