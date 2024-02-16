import { format, resolveConfig } from 'prettier';

export async function prettierFormat(fileContent: string, configPath: string): Promise<string> {
  const prettierConfig = await resolveConfig(configPath);

  const formattedFileContent = format(fileContent, {
    parser: 'typescript',
    ...(prettierConfig || {}),
  });

  return formattedFileContent;
}
