import fs from 'fs';
import { getTablesProperties } from './utils';

export function generate(input: string, output: string) {
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
  const updatedFileContent = fileContent + '\n' + types.join('\n') + '\n';

  fs.writeFileSync(outputFile, updatedFileContent);
}
