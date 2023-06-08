import {
  LiteralTypeNode,
  ModuleKind,
  Project,
  ScriptTarget,
  ts,
} from 'ts-morph';

import { toCamelCase } from './toCamelCase'

export function getEnumsProperties(typesPath: string, schema: string) {
  const project = new Project({
    compilerOptions: {
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      module: ModuleKind.ESNext,
      target: ScriptTarget.ESNext,
      strictNullChecks: true,
    },
  });

  const sourceFile = project.addSourceFileAtPath(typesPath);

  const databaseInterface = sourceFile.getInterfaceOrThrow('Database');
  const publicProperty = databaseInterface.getPropertyOrThrow(schema);
  const publicType = publicProperty.getType();

  const enumsProperty = publicType
    .getApparentProperties()
    .find((property) => property.getName() === 'Enums');

  if (!enumsProperty) {
    console.log(
      `No Enums property found within the Database interface for schema ${schema}.`
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
      `No enums found within the Enums property for schema ${schema}.`
    );
    return [];
  }

  return enumsProperties;
}

function getEnumValueLabel(value: LiteralTypeNode) {
  let enumValue = value.getText().replace(/"/g, '');
  if(enumValue.includes(' ')) {
    enumValue.replace(/ /g, '_');
  }
  if(enumValue.includes('.')) {
    enumValue = toCamelCase(enumValue, '.');
  }
  return enumValue
}

function getEnumValueText(value: LiteralTypeNode) {
  return value.getText();
}

export function getEnumValuesText(
  enumProperty: ReturnType<typeof getEnumsProperties>[number]
) {
  const enumValues = enumProperty
    .getValueDeclarationOrThrow()
    .getChildrenOfKind(ts.SyntaxKind.UnionType)
    .flatMap((enumValue) =>
      enumValue.getChildrenOfKind(ts.SyntaxKind.LiteralType)
    );

  return enumValues.map(
    (value) => `  ${getEnumValueLabel(value)} = ${getEnumValueText(value)},`
  );
}
