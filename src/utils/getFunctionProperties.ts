import { ModuleKind, Project, ScriptTarget } from 'ts-morph';

export function getFunctionReturnTypes(typesPath: string, schema: string) {
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

  const functionProperty = publicType
    .getApparentProperties()
    .find((property) => property.getName() === 'Functions');

  if (!functionProperty) {
    console.log(
      `No Functions property found within the Database interface for schema ${schema}.`
    );
    return [];
  }

  const functionType = project
    .getProgram()
    .getTypeChecker()
    .getTypeAtLocation(functionProperty.getValueDeclarationOrThrow());
  const functionProperties = functionType.getProperties();

  if (functionProperties.length < 1) {
    console.log(
      `No functions found within the Functions property for schema ${schema}.`
    );
    return [];
  }

  return functionProperties;
}