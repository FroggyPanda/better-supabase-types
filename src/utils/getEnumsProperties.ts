import { LiteralTypeNode, Project, SourceFile, ts } from 'ts-morph';
import { toCamelCase } from './toCamelCase';
import chalk from 'chalk';
import { toPascalCase } from './toPascalCase';

export function getEnumsProperties(
  project: Project,
  sourceFile: SourceFile,
  schema: string
) {
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
    enumValue = `"${toPascalCase(
      enumValue.substring(1, enumValue.length - 1)
    )}"`;
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
