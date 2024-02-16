import { singular } from 'pluralize';

const wordToPascalCase = (makeSingular: boolean) => (word: string) => {
  const singularWord = makeSingular ? singular(word) : word;
  return singularWord.charAt(0).toUpperCase() + singularWord.substring(1);
}

export function toPascalCase(str: string, makeSingular: boolean = false) {
  return str
    .split('_')
    .map(wordToPascalCase(makeSingular))
    .join('');
}

