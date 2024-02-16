import { singular } from 'pluralize';

/**
 * @param {boolean} makeSingular
 * @returns
 */
const wordToPascalCase =
  (makeSingular) =>
  /**
   * @param {string} word
   * @returns
   */
  (word) => {
    const singularWord = makeSingular ? singular(word) : word;
    return singularWord.charAt(0).toUpperCase() + singularWord.substring(1);
  };

/**
 * @param {string} str
 * @param {boolean} makeSingular
 * @returns
 */
export function toPascalCase(str, makeSingular = false) {
  return str.split('_').map(wordToPascalCase(makeSingular)).join('');
}
