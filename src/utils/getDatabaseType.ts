import { SourceFile, Node } from 'ts-morph';

export function getDatabaseType(sourceFile: SourceFile) {
  const databaseInterface = sourceFile.getInterface('Database');
  if (databaseInterface) {
    return databaseInterface;
  } else {
    const node = sourceFile
      .getTypeAliasOrThrow('Database')
      .getTypeNodeOrThrow();
    if (Node.isTypeLiteral(node)) {
      return node;
    } else {
      throw Error('Expected database type to be an object literal.');
    }
  }
}
