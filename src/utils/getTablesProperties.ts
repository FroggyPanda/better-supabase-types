import chalk from 'chalk';
import { Project, SourceFile } from 'ts-morph';
import { getDatabaseType } from './getDatabaseType';

export function getTablesProperties(
  project: Project,
  sourceFile: SourceFile,
  schema: string
) {
  const databaseInterface = getDatabaseType(sourceFile);
  const publicProperty = databaseInterface.getPropertyOrThrow(schema);
  const publicType = publicProperty.getType();

  const tablesProperty = publicType
    .getApparentProperties()
    .find((property) => property.getName() === 'Tables');

  if (!tablesProperty) {
    console.log(
      `${chalk.yellow.bold(
        'warn'
      )} No Tables property found within the Database interface for schema ${schema}.`
    );
    return [];
  }

  const tablesType = project
    .getProgram()
    .getTypeChecker()
    .getTypeAtLocation(tablesProperty.getValueDeclarationOrThrow());
  const tablesProperties = tablesType.getProperties();

  if (tablesProperties.length < 1) {
    console.log(
      `${chalk.yellow.bold(
        'warn'
      )} No tables found within the Tables property for schema ${schema}.`
    );
    return [];
  }

  return tablesProperties;
}
