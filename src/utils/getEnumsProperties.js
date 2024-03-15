import { ts } from 'ts-morph';
import chalk from 'chalk';
import { toCamelCase } from './toCamelCase.js';
import { toPascalCase } from './toPascalCase.js';
import { getDatabaseType } from './getDatabaseType.js';

/**
 * @param {import('ts-morph').Project} project
 * @param {import('ts-morph').SourceFile} sourceFile
 * @param {string} schema
 * @returns
 */
export function getEnumsProperties(project, sourceFile, schema) {
  const databaseType = getDatabaseType(sourceFile);
  const publicProperty = databaseType.getPropertyOrThrow(schema);
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
  // Attempt to find a union type first
  let enumValues = enumProperty
    .getValueDeclarationOrThrow()
    .getChildrenOfKind(ts.SyntaxKind.UnionType)
    .flatMap((enumValue) =>
      enumValue.getChildrenOfKind(ts.SyntaxKind.LiteralType)
    );

  // If no union type was found, try to get a literal type directly
  if (enumValues.length === 0) {
    const directLiteral = enumProperty
      .getValueDeclarationOrThrow()
      .getChildrenOfKind(ts.SyntaxKind.LiteralType);
    if (directLiteral.length > 0) {
      enumValues = directLiteral;
    }
  }

  return enumValues.map(
    (value) =>
      `  ${getEnumValueLabel(value, enumPascalCase)} = ${getEnumValueText(
        value
      )},`
  );
}
