import { ConditionalExpression, Expression, SourceFile } from 'ts-morph';

/**
 * helper: construct on()-arguments from case identifier and possible preceding empty case identifiers
 * @param identifier switch-case text
 * @param previousIdentifiers array of switch-case texts of previous empty clauses
 */
export function createActionTypes(identifier: string, previousIdentifiers: string[]): string[] {
  const returnArray = [];
  while (previousIdentifiers.length > 9) {
    const subarray = previousIdentifiers.splice(0, 10);
    returnArray.push(subarray.map(standardizeIdentifier).join(','));
  }
  const newId = standardizeIdentifier(identifier);
  const newPrevId = previousIdentifiers.map(standardizeIdentifier).join(', ');
  returnArray.push(previousIdentifiers.length === 0 ? newId : `${newId}, ${newPrevId}`);
  return returnArray;
}

/**
 * returns the new action name from an ActionClass or Action multiple export
 * @param identifier string that contains the action name
 */
export function standardizeIdentifier(identifier: string) {
  return identifier.includes('.')
    ? identifier.split('.')[1].replace(/^\w/, c => c.toLowerCase())
    : identifier.replace(/^\w/, c => c.toLowerCase());
}

/**
 * helper: checks whether the given expression text belongs to a map operator
 * @param identifier expression text
 */
export function isMap(identifier: string) {
  return identifier === 'map' || 'concatMap' || 'mergeMap' || 'switchMap' || 'mapTo';
}

/**
 * helper: construct string for a action call, using the action's class and possible arguments
 * @param actionClassString actionClass name
 * @param argumentString optional, argument string for the action call
 */
export function updateNewExpressionString(actionClassString: string, argumentString: string = ''): string {
  return `${actionClassString.replace(/^\w/, c => c.toLowerCase())}(${argumentString})`;
}

/**
 * helper: searches the given sourceFile for namespace imports and throws an error if one exists
 * @param sourceFile sourceFile to check
 */
export function checkForNamespaceImports(sourceFile: SourceFile) {
  sourceFile.getImportDeclarations().forEach(im => {
    if (im.getNamespaceImport()) {
      throw new Error('please ensure your store files include no star imports');
    }
  });
}

/**
 * returns expression from conditional as array
 * @param conditional the conditional to extract expressions from
 */
export function getConditionalWhenExpressions(conditional: ConditionalExpression): Expression[] {
  return [conditional.getWhenTrue(), conditional.getWhenFalse()];
}

/**
 *
 */
export function getReducerFunction(reducerFile: SourceFile) {
  return reducerFile.getFunctions().filter(func => func.getName().endsWith('Reducer'))[0];
}
