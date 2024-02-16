/**
 * @param {import('ts-morph').Project} project
 * @param {import('ts-morph').SourceFile} sourceFile
 * @returns
 */
export function getSchemasProperties(project, sourceFile) {
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
