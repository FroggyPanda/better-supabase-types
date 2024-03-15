import { LiteralTypeNode, Project, SourceFile, ts } from 'ts-morph';
import { toCamelCase } from './toCamelCase';
import chalk from 'chalk';
import { toPascalCase } from './toPascalCase';
import { getDatabaseType } from './getDatabaseType';

export function getEnumsProperties(
  project: Project,
  sourceFile: SourceFile,
  schema: string
) {
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

function getEnumValueLabel(value: LiteralTypeNode, enumPascalCase: boolean) {
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

function getEnumValueText(value: LiteralTypeNode) {
  return value.getText();
}

export function getEnumValuesText(
  enumProperty: ReturnType<typeof getEnumsProperties>[number],
  enumPascalCase: boolean
) {
  // Attempt to find a union type first
  let enumValues = enumProperty
    .getValueDeclarationOrThrow()
    .getChildrenOfKind(ts.SyntaxKind.UnionType)
    .flatMap(enumValue =>
      enumValue.getChildrenOfKind(ts.SyntaxKind.LiteralType),
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
