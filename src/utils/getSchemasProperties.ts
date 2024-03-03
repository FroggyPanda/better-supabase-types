import { Project, SourceFile } from 'ts-morph';
import { getDatabaseType } from './getDatabaseType';

export function getSchemasProperties(project: Project, sourceFile: SourceFile) {
  const databaseType = getDatabaseType(sourceFile);

  const schemasType = project
    .getProgram()
    .getTypeChecker()
    .getTypeAtLocation(databaseType);
  const schemasProperties = schemasType.getProperties();

  if (schemasProperties.length < 1)
    throw new Error('No schemas found within the Database property.');

  return schemasProperties;
}
