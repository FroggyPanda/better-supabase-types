import chalk from 'chalk';
import { getDatabaseType } from './getDatabaseType.js';

/**
 * @param {import('ts-morph').Project} project
 * @param {import('ts-morph').SourceFile} sourceFile
 * @param {string} schema
 * @returns
 */
export function getTablesProperties(project, sourceFile, schema) {
  const databaseType = getDatabaseType(sourceFile);
  const publicProperty = databaseType.getPropertyOrThrow(schema);
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
