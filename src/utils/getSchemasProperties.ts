import { ModuleKind, Project, ScriptTarget } from 'ts-morph';

export function getSchemasProperties(typesPath: string) {
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

  const schemasType = project
    .getProgram()
    .getTypeChecker()
    .getTypeAtLocation(databaseInterface);
  const schemasProperties = schemasType.getProperties();

  if (schemasProperties.length < 1)
    throw new Error('No schemas found within the Database property.');

  return schemasProperties;
}
