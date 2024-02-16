import chalk from 'chalk';
import { Project, SourceFile } from 'ts-morph';

export function getFunctionReturnTypes(
  project: Project,
  sourceFile: SourceFile,
  schema: string
) {
  const databaseInterface = sourceFile.getInterfaceOrThrow('Database');
  const publicProperty = databaseInterface.getPropertyOrThrow(schema);
  const publicType = publicProperty.getType();

  const functionProperty = publicType
    .getApparentProperties()
    .find((property) => property.getName() === 'Functions');

  if (!functionProperty) {
    console.log(
      `${chalk.yellow.bold(
        'warn'
      )} No Functions property found within the Database interface for schema ${schema}.`
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
      `${chalk.yellow.bold(
        'warn'
      )} No functions found within the Functions property for schema ${schema}.`
    );
    return [];
  }

  return functionProperties;
}
