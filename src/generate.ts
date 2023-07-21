import fs from 'fs';
import { z } from 'zod';
import {
  getEnumValuesText,
  getEnumsProperties,
  getFunctionReturnTypes,
  getSchemasProperties,
  getTablesProperties,
  prettierFormat,
  toPascalCase,
  changeParameterTypeInInterface,
} from './utils';

import { schema } from './index';

type jsonType = z.infer<typeof schema>['json'];

export async function generate(
  input: string,
  output: string,
  prettierConfigPath?: string,
  makeSingular: boolean = false,
  jsonType?: jsonType
) {
  const exists = fs.existsSync(input);

  if (!exists) {
    console.error('Input file not found');
    return;
  }

  const types: string[] = [];

  const schemas = getSchemasProperties(input);
  for (const schema of schemas) {
    types.push(`//Schema: ${schema.getName()}`);

    const schemaName = schema.getName();
    const tablesProperties = getTablesProperties(input, schemaName);
    const enumsProperties = getEnumsProperties(input, schemaName);
    const functionProperties = getFunctionReturnTypes(input, schemaName);

    if (enumsProperties.length > 0) {
      types.push('//Enums');
    }
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

    if (tablesProperties.length > 0) {
      types.push('//Tables');
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

    if (functionProperties.length > 0) {
      types.push('// Functions');
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

  let jsonTypes = '';

  // Make the custom json types
  for (const tableName in jsonType) {
    if (Object.prototype.hasOwnProperty.call(jsonType, tableName)) {
      const value = jsonType[tableName];

      for (const columnName in value) {
        if (Object.prototype.hasOwnProperty.call(value, columnName)) {
          const columnValue = value[columnName];

          // Start making the type text for it
          jsonTypes += `type ${toPascalCase(columnName)} = {`;

          for (const typeName in columnValue) {
            if (Object.prototype.hasOwnProperty.call(columnValue, typeName)) {
              const type = columnValue[typeName];

              jsonTypes += `${typeName}: ${type};\n`;
            }
          }

          jsonTypes += `}; \n`;
        }
      }
    }
  }

  let updatedFileContent =
    jsonTypes + '\n' + fileContent + '\n' + types.join('\n') + '\n';

  if (prettierConfigPath) {
    updatedFileContent = await prettierFormat(
      updatedFileContent,
      prettierConfigPath
    );
  }

  fs.writeFileSync(output, updatedFileContent);

  for (const tableName in jsonType) {
    if (Object.prototype.hasOwnProperty.call(jsonType, tableName)) {
      const value = jsonType[tableName];

      for (const columnName in value) {
        changeParameterTypeInInterface(
          output,
          'Database',
          tableName,
          columnName,
          toPascalCase(columnName)
        );
      }
    }
  }
}
