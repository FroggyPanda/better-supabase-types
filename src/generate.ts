import fs from 'fs';
import { getTablesProperties } from './utils';

export function generate(input: string, output: string) {
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
  const updatedFileContent = fileContent + '\n' + types.join('\n') + '\n';

  fs.writeFileSync(output, updatedFileContent);
}
