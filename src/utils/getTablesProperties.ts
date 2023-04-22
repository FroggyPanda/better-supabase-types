import { ModuleKind, Project, ScriptTarget } from 'ts-morph';

export function getTablesProperties(typesPath: string) {
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
  const publicProperty = databaseInterface.getPropertyOrThrow('public');
  const publicType = publicProperty.getType();

  const tablesProperty = publicType
    .getApparentProperties()
    .find((property) => property.getName() === 'Tables');

  if (!tablesProperty)
    throw new Error('No Tables property found within the Database interface.');

  const tablesType = project
    .getProgram()
    .getTypeChecker()
    .getTypeAtLocation(tablesProperty.getValueDeclarationOrThrow());
  const tablesProperties = tablesType.getProperties();

  if (tablesProperties.length < 1)
    throw new Error('No tables found within the Tables property.');

  return tablesProperties;
}
