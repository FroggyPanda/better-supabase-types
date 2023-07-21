import { ModuleKind, Project, ScriptTarget, SyntaxKind } from 'ts-morph';

export function changeParameterTypeInInterface(
  typesPath: string,
  interfaceName: string,
  parameterParentName: string,
  parameterName: string,
  newType: string
) {
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

  const interfaceDeclaration = sourceFile.getInterface(interfaceName);

  // Check if the interface declaration is found in the source file
  if (interfaceDeclaration) {
    // Find the parent parameter (property signature) containing the desired parameter
    const parentParameter = interfaceDeclaration
      .getDescendantsOfKind(SyntaxKind.PropertySignature)
      .find((property) => property.getName() === parameterParentName);

    // Check if the parent parameter is found in the interface
    if (parentParameter) {
      // Find all occurrences of the parameter (property signature) within the parent parameter
      const parameters = parentParameter
        .getDescendantsOfKind(SyntaxKind.PropertySignature)
        .filter((property) => property.getName() === parameterName);

      // Check if any occurrences of the parameter are found
      if (parameters) {
        parameters.forEach((property) => {
          // Check if the existing type has square brackets
          const existingType = property.getTypeNode()?.getText();
          const isArray = existingType && existingType.includes('[]');

          // Append square brackets to the new type if needed
          const updatedType = isArray ? `${newType}[]` : newType;

          // Clone the parameter with the updated type
          const newParameter = property.set({ type: updatedType });

          // Replace the old parameter with the new one
          property.replaceWithText(newParameter.getText());
        });
      }
    }
  }

  // Save the changes to the file
  sourceFile.saveSync();
}
