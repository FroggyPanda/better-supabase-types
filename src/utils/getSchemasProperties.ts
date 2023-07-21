import { Project, SourceFile } from 'ts-morph';

export function getSchemasProperties(project: Project, sourceFile: SourceFile) {
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
