import fs from 'fs';
import { getTablesProperties, prettierFormat, toPascalCase } from './utils';

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
    const tableNameType = toPascalCase(tableName);

    types.push(
      `export type ${tableNameType} = Database['public']['Tables']['${tableName}']['Row'];`
    );
  }

  const fileContent = fs.readFileSync(input, 'utf-8');
  let updatedFileContent = fileContent + '\n' + types.join('\n') + '\n';
  if (prettierConfigPath) {
    updatedFileContent = await prettierFormat(updatedFileContent, prettierConfigPath);
  }

  fs.writeFileSync(output, updatedFileContent);
}
