import fs from 'fs';
import { getTablesProperties, prettierFormat } from './utils';

export async function generate(input: string, output: string, prettierConfigPath?: string) {
  const exists = fs.existsSync(input);

  if (!exists) {
    console.error('Input file not found');
    return;
  }

  const tablesProperties = getTablesProperties(input);
  const types: string[] = [];

  for (const table of tablesProperties) {
    const tableName = table.getName();
    const capitalTableName =
      tableName.charAt(0).toUpperCase() + tableName.substring(1);

    types.push(
      `export type ${capitalTableName} = Database['public']['Tables']['${tableName}']['Row'];`
    );
  }

  const fileContent = fs.readFileSync(input, 'utf-8');
  let updatedFileContent = fileContent + '\n' + types.join('\n') + '\n';
  if (prettierConfigPath) {
    updatedFileContent = await prettierFormat(updatedFileContent, prettierConfigPath);
  }

  fs.writeFileSync(output, updatedFileContent);
}
