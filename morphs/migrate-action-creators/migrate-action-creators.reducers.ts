import { CaseClause, SourceFile, SyntaxKind, VariableDeclarationKind } from 'ts-morph';

import { checkForNamespaceImports, createActionTypes, getReducerFunction } from '../morph-helpers/morph-helpers';

import { ActionCreatorsMorpher } from './migrate-action-creators';

export class ActionCreatorsReducerMorpher {
  switchStatements: {
    identifier: string;
    hasLogic: boolean;
    statements: string;
    previousIdentifiers: string[];
  }[];
  dependencies: string[] = [];
  constructor(public reducerFile: SourceFile, public parent: ActionCreatorsMorpher) {}

  migrateReducer() {
    if (!this.reducerFile) {
      console.log('no reducer file found');
      return;
    }
    if (!this.checkUmigratedFile()) {
      return;
    }
    console.log('replacing reducers...');
    checkForNamespaceImports(this.reducerFile);
    this.addImports();
    this.declareNewReducer();
    this.updateFeatureReducer();
    this.parent.modifiedFiles.push(this.reducerFile);
    this.reducerFile.fixMissingImports();
    if (this.dependencies.length > 0) {
      console.log(`  store depends on foreign actions: `);
      this.dependencies.forEach(dep => console.log(`    ${dep}`));
      console.log('  please migrate the corresponding stores');
    }
  }
  /**
   * add required imports to prevent problems with automatic adding
   */
  private addImports() {
    this.reducerFile.addImportDeclaration({
      moduleSpecifier: '@ngrx/store',
      namedImports: ['on'],
    });
  }

  /**
   * declare new reducer function created with new createReducer factory
   */
  private declareNewReducer() {
    this.extractReducerContents();

    // create new reducer function
    const reducer = this.reducerFile.addVariableStatement({
      isExported: false,
      isDefaultExport: false,
      hasDeclareKeyword: false,
      declarationKind: VariableDeclarationKind.Const,
      declarations: [
        {
          name: 'reducer',
          initializer: 'createReducer()',
          type: undefined,
          hasExclamationToken: false,
        },
      ],
    });

    // add first reducer argument
    const createReducerFunction = reducer.getFirstDescendantByKindOrThrow(SyntaxKind.CallExpression);
    createReducerFunction.addArgument('initialState');

    // for each switch case, add a new on()-function
    this.switchStatements.forEach(clause => {
      // name of the actionCreator function
      const actionTypes = createActionTypes(clause.identifier, clause.previousIdentifiers);
      actionTypes.forEach(actionTypesString => {
        const arrowFunction = clause.hasLogic
          ? `(state, action) => ${clause.statements}`
          : `state => ${clause.statements}`;
        createReducerFunction.addArgument(`on(${actionTypesString}, ${arrowFunction})`);
      });
    });
  }

  /**
   * update reducer function to use the newly constructed version using createReducer
   */
  private updateFeatureReducer() {
    getReducerFunction(this.reducerFile)
      .getParameter('action')
      .remove();
    getReducerFunction(this.reducerFile).addParameter({ name: 'action', type: 'Action' });
    getReducerFunction(this.reducerFile)
      .getFirstChildByKindOrThrow(SyntaxKind.Block)
      .getStatements()
      .forEach(statement => statement.remove());
    getReducerFunction(this.reducerFile).setBodyText('return reducer(state,action)');
  }

  /**
   * extract information from the old reducer switch statement
   */
  private extractReducerContents() {
    // retrieve reducer logic from old reducer
    this.switchStatements = [];
    let previousIdentifiers: string[] = [];

    if (getReducerFunction(this.reducerFile).getDescendantsOfKind(SyntaxKind.SwitchStatement).length === 0) {
      throw new Error('this reducer does not include a switch statement. Please migrate manually');
    }
    // iterate over reducer switch cases and store info
    getReducerFunction(this.reducerFile)
      .getFirstDescendantByKind(SyntaxKind.CaseBlock)
      .getClauses()
      .filter(clause => clause.getKind() === SyntaxKind.CaseClause)
      .forEach((clause: CaseClause) => {
        if (
          this.parent.actionsMorph.actionTypes &&
          !this.parent.actionsMorph.actionTypes[
            clause
              .getExpression()
              .getText()
              .split('.')[1]
          ]
        ) {
          this.dependencies.push(clause.getExpression().getText());
        }
        // store empty clauses for later use and continue
        if (clause.getStatements().length === 0) {
          previousIdentifiers.push(clause.getExpression().getText());
          return;
        }

        // does the clause have a static return or is the payload used?
        const hasLogic =
          clause.getStatements()[0].getKind() !== SyntaxKind.ReturnStatement ||
          clause
            .getStatements()[0]
            .getDescendants()
            .filter(
              desc =>
                desc.getKind() === SyntaxKind.PropertyAccessExpression &&
                desc.getDescendantsOfKind(SyntaxKind.Identifier).filter(dd => dd.getText() === 'action').length > 0
            ).length > 0;
        // push information about switch statement to array
        this.switchStatements.push({
          identifier: clause.getExpression().getText(),
          hasLogic,
          statements:
            clause.getStatements()[0].getKind() === SyntaxKind.Block
              ? clause.getStatements()[0].getText()
              : `{${clause.getStatements()[0].getText()}}`,
          previousIdentifiers: [...previousIdentifiers],
        });
        previousIdentifiers = [];
      });
  }

  private checkUmigratedFile(): boolean {
    if (this.reducerFile.getText().includes('createReducer')) {
      console.log('this file is already migrated, skipping...');
      return false;
    } else {
      return true;
    }
  }
}
