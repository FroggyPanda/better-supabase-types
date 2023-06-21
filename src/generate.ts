import fs from 'fs';
import {
  getEnumValuesText,
  getEnumsProperties,
  getFunctionReturnTypes,
  getSchemasProperties,
  getTablesProperties,
  prettierFormat,
  toPascalCase,
} from './utils';

export async function generate(
  input: string,
  output: string,
  prettierConfigPath?: string,
  makeSingular: boolean = false
) {
  const exists = fs.existsSync(input);

  if (!exists) {
    console.error('Input file not found');
    return;
  }

  const types: string[] = [];

  const schemas = getSchemasProperties(input);
  for (const schema of schemas) {
    const schemaName = schema.getName();
    const tablesProperties = getTablesProperties(input, schemaName);
    const enumsProperties = getEnumsProperties(input, schemaName);
    const functionProperties = getFunctionReturnTypes(input, schemaName);

    for (const enumProperty of enumsProperties) {
      const enumName = enumProperty.getName();
      const enumNameType = toPascalCase(enumName, makeSingular);

      types.push(
        `export enum ${enumNameType} {`,
        ...(getEnumValuesText(enumProperty) ?? []),
        '}',
        '\n'
      );
    }

    for (const table of tablesProperties) {
      const tableName = table.getName();
      const tableNameType = toPascalCase(tableName, makeSingular);

      types.push(
        `export type ${tableNameType} = Database['${schemaName}']['Tables']['${tableName}']['Row'];`,
        `export type Insert${tableNameType} = Database['${schemaName}']['Tables']['${tableName}']['Insert'];`,
        `export type Update${tableNameType} = Database['${schemaName}']['Tables']['${tableName}']['Update'];`,
        '\n'
      );
    }
    for (const functionProperty of functionProperties) {
      const functionName = functionProperty.getName();
      const functionNameType = toPascalCase(functionName, makeSingular);

      types.push(
        `export type Args${functionNameType} = Database['${schemaName}']['Functions']['${functionName}']['Args'];`,
        `export type ReturnType${functionNameType} = Database['${schemaName}']['Functions']['${functionName}']['Returns'];`,
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
