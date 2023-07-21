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
import { ModuleKind, Project, ScriptTarget } from 'ts-morph';
import chalk from 'chalk';

export async function generate(
  input: string,
  output: string,
  prettierConfigPath?: string,
  makeSingular: boolean = false
) {
  const exists = fs.existsSync(input);

  const project = new Project({
    compilerOptions: {
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      module: ModuleKind.ESNext,
      target: ScriptTarget.ESNext,
      strictNullChecks: true,
    },
  });

  const sourceFile = project.addSourceFileAtPath(input);

  if (!exists) {
    console.error(`${chalk.red.bold('error')} Input file not found`);
    return;
  }

  const types: string[] = [];

  const schemas = getSchemasProperties(project, sourceFile);
  for (const schema of schemas) {
    types.push(`// Schema: ${schema.getName()}`);

    const schemaName = schema.getName();
    const tablesProperties = getTablesProperties(
      project,
      sourceFile,
      schemaName
    );
    const enumsProperties = getEnumsProperties(project, sourceFile, schemaName);
    const functionProperties = getFunctionReturnTypes(
      project,
      sourceFile,
      schemaName
    );

    if (enumsProperties.length > 0) {
      types.push('// Enums');
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
      types.push('// Tables');
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
  let updatedFileContent = fileContent + '\n' + types.join('\n') + '\n';
  if (prettierConfigPath) {
    updatedFileContent = await prettierFormat(
      updatedFileContent,
      prettierConfigPath
    );
  }

  fs.writeFileSync(output, updatedFileContent);
}
