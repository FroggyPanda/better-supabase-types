import fs from 'fs';
import { getTablesProperties, prettierFormat } from './utils';

export async function generate(input: string, output: string, prettierConfigPath?: string) {
  const inputFile = input;
  const outputFile = output;

  const tablesProperties = getTablesProperties(inputFile);
  const types: string[] = [];

  for (const table of tablesProperties) {
    const tableName = table.getName();
    const capitalTableName =
      tableName.charAt(0).toUpperCase() + tableName.substring(1);

    types.push(
      `export type ${capitalTableName} = Database['public']['Tables']['${tableName}']['Row'];`
    );
  }

  const fileContent = fs.readFileSync(inputFile, 'utf-8');
  let updatedFileContent = fileContent + '\n' + types.join('\n') + '\n';
  if (prettierConfigPath) {
    updatedFileContent = await prettierFormat(updatedFileContent, prettierConfigPath);
  }

  fs.writeFileSync(outputFile, updatedFileContent);
}
