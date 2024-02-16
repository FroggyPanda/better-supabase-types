import chalk from 'chalk';

/**
 * @param {import('ts-morph').Project} project
 * @param {import('ts-morph').SourceFile} sourceFile
 * @param {string} schema
 * @returns
 */
export function getViewsProperties(project, sourceFile, schema) {
  const databaseInterface = sourceFile.getInterfaceOrThrow('Database');
  const publicProperty = databaseInterface.getPropertyOrThrow(schema);
  const publicType = publicProperty.getType();

  const viewsProperty = publicType
    .getApparentProperties()
    .find((property) => property.getName() === 'Views');

  if (!viewsProperty) {
    console.log(
      `${chalk.yellow.bold(
        'warn'
      )} No Views property found within the Database interface for schema ${schema}.`
    );
    return [];
  }

  const viewsType = project
    .getProgram()
    .getTypeChecker()
    .getTypeAtLocation(viewsProperty.getValueDeclarationOrThrow());
  const viewsProperties = viewsType.getProperties();

  if (viewsProperties.length < 1) {
    console.log(
      `No views found within the Views property for schema ${schema}.`
    );
    return [];
  }

  return viewsProperties;
}
