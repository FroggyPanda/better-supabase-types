import { ts } from 'ts-morph';
import { toCamelCase } from './toCamelCase';
import chalk from 'chalk';
import { toPascalCase } from './toPascalCase';

/**
 * @param {import('ts-morph').Project} project
 * @param {import('ts-morph').SourceFile} sourceFile
 * @param {string} schema
 * @returns
 */
export function getEnumsProperties(project, sourceFile, schema) {
  const databaseInterface = sourceFile.getInterfaceOrThrow('Database');
  const publicProperty = databaseInterface.getPropertyOrThrow(schema);
  const publicType = publicProperty.getType();

  const enumsProperty = publicType
    .getApparentProperties()
    .find((property) => property.getName() === 'Enums');

  if (!enumsProperty) {
    console.log(
      `${chalk.yellow.bold(
        'warn'
      )} No Enums property found within the Database interface for schema ${schema}.`
    );
    return [];
  }

  const enumsType = project
    .getProgram()
    .getTypeChecker()
    .getTypeAtLocation(enumsProperty.getValueDeclarationOrThrow());
  const enumsProperties = enumsType.getProperties();

  if (enumsProperties.length < 1) {
    console.log(
      `${chalk.yellow.bold(
        'warn'
      )} No enums found within the Enums property for schema ${schema}.`
    );
    return [];
  }

  return enumsProperties;
}

/**
 * @param {import('ts-morph').LiteralTypeNode} value
 * @param {boolean} enumPascalCase
 * @returns
 */
function getEnumValueLabel(value, enumPascalCase) {
  let enumValue = value.getText().replace(/"/g, '');
  if (enumValue.includes(' ')) {
    enumValue.replace(/ /g, '_');
  }
  if (enumValue.includes('-')) {
    enumValue.replace(/-/g, '_');
  }
  if (enumValue.includes('.')) {
    enumValue = toCamelCase(enumValue, '.');
  }
  if (enumPascalCase) {
    enumValue = enumValue.replace(/-/g, '_');
    enumValue = `"${toPascalCase(enumValue.substring(0, enumValue.length))}"`;
  }

  return enumValue;
}

/**
 * @param {import('ts-morph').LiteralTypeNode} value
 * @returns
 */
function getEnumValueText(value) {
  return value.getText();
}

/**
 * @param {ReturnType<typeof getEnumsProperties>[number]} enumProperty
 * @param {boolean} enumPascalCase
 * @returns
 */
export function getEnumValuesText(enumProperty, enumPascalCase) {
  const enumValues = enumProperty
    .getValueDeclarationOrThrow()
    .getChildrenOfKind(ts.SyntaxKind.UnionType)
    .flatMap((enumValue) =>
      enumValue.getChildrenOfKind(ts.SyntaxKind.LiteralType)
    );

  return enumValues.map(
    (value) =>
      `  ${getEnumValueLabel(value, enumPascalCase)} = ${getEnumValueText(
        value
      )},`
  );
}
