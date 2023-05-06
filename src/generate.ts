import fs from 'fs';
import { getTablesProperties, prettierFormat, toPascalCase } from './utils';

export async function generate(
  input: string,
  output: string,
  prettierConfigPath?: string,
  schemas: string[] = ['public'],
  makeSingular: boolean = false
) {
  const exists = fs.existsSync(input);

  if (!exists) {
    console.error('Input file not found');
    return;
  }

  const types: string[] = [];

  for (const schema of schemas) {
    const tablesProperties = getTablesProperties(input, schema);

    for (const table of tablesProperties) {
      const tableName = table.getName();
      const tableNameType = toPascalCase(tableName, makeSingular);

      types.push(
        `export type ${tableNameType} = Database['${schema}']['Tables']['${tableName}']['Row'];`,
        `export type Insert${tableNameType} = Database['${schema}']['Tables']['${tableName}']['Insert'];`,
        `export type Update${tableNameType} = Database['${schema}']['Tables']['${tableName}']['Update'];`,
        '\n'
      );
    }
  }

  const fileContent = fs.readFileSync(input, 'utf-8');
  let updatedFileContent = fileContent + '\n' + types.join('\n') + '\n';
  if (prettierConfigPath) {
    updatedFileContent = await prettierFormat(
      updatedFileContent,
      prettierConfigPath
    );
  }

  fs.writeFileSync(output, updatedFileContent);
}
