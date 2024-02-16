import { format, resolveConfig } from 'prettier';

/**
 * @param {string} fileContent
 * @param {string} configPath
 * @returns {Promise<string>}
 */
export async function prettierFormat(fileContent, configPath) {
  const prettierConfig = await resolveConfig(configPath);

  const formattedFileContent = format(fileContent, {
    parser: 'typescript',
    ...(prettierConfig || {}),
  });

  return formattedFileContent;
}
