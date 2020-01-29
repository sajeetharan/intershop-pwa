import { UnionType } from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import {
  CallExpression,
  ClassDeclaration,
  EnumDeclaration,
  NewExpression,
  SourceFile,
  SyntaxKind,
  TypeAliasDeclaration,
  TypeReferenceNode,
  UnionTypeNode,
  VariableDeclarationKind,
} from 'ts-morph';

import { checkForNamespaceImports, updateNewExpressionString } from '../morph-helpers/morph-helpers';

import { ActionCreatorsMorpher } from './migrate-action-creators';

// tslint:disable:no-console
export class ActionCreatorsActionsMorpher {
  constructor(public actionsFile: SourceFile, public parent: ActionCreatorsMorpher) {}
  actionTypes: { [typeName: string]: string };

  migrateActions(updateGlobalReferences: boolean = true, migrateTests: boolean = true) {
    if (!this.actionsFile) {
      console.log('no actions file found');
      return;
    }
    if (!this.checkUnmigratedFile()) {
      return;
    }
    console.log('replacing actions...');
    checkForNamespaceImports(this.actionsFile);
    this.readActionTypes();
    this.replaceActions(updateGlobalReferences, migrateTests);
    if (updateGlobalReferences) {
      this.updateGlobalEnumReferences(this.actionsFile.getEnums()[0], migrateTests);
      this.updateGlobalTypeAliasReferences(this.actionsFile.getTypeAliases()[0], migrateTests);
    }

    // clean up old code
    this.actionsFile.getEnums()[0].remove();
    this.actionsFile.getTypeAliases()[0].remove();
    this.parent.modifiedFiles.push(this.actionsFile);
    this.actionsFile.fixMissingImports();
  }

  /**
   * read action types from actions enum and save in this.actionTypes
   */
  private readActionTypes() {
    console.log('  reading action types...');
    this.actionTypes = this.actionsFile
      .getEnums()[0]
      .getMembers()
      .reduce(
        (acc, current) => ({
          ...acc,
          [current.getName()]: current.getInitializer().getText(),
        }),
        {}
      );
    console.log(`    ${Object.keys(this.actionTypes).length} actions found`);
  }

  /**
   * replace action class declaration with createAction factory call
   * @param updateGlobalReferences whether to globally update references for each action
   */
  private replaceActions(updateGlobalReferences: boolean, migrateTests: boolean) {
    console.log('  replacing action classes with creator functions...');
    this.actionsFile.getClasses().forEach(actionClass => {
      // retrieve basic action information
      const className = actionClass.getName();
      const typeString = this.actionTypes[className];

      // get constructor information
      const hasConstructor = actionClass.getConstructors().length > 0;
      const constructorContents = hasConstructor
        ? actionClass
            .getConstructors()[0]
            .getParameter('payload')
            .getText()
            .replace('public ', '')
        : '';

      // assemble structure object
      const createActionStructure = {
        isExported: true,
        isDefaultExport: false,
        hasDeclareKeyword: false,
        declarationKind: VariableDeclarationKind.Const,
        declarations: [
          {
            name: className.replace(/^\w/, c => c.toLowerCase()),
            initializer: hasConstructor
              ? `createAction(${typeString}, props<{${constructorContents}}>())`
              : `createAction(${typeString})`,
            type: undefined,
            hasExclamationToken: false,
            kind: 38,
          },
        ],
      };

      // add variable statement to file
      this.actionsFile.addVariableStatement(createActionStructure);

      // update references in other files
      if (updateGlobalReferences) {
        this.updateGlobalActionReferences(actionClass, migrateTests);
        // fix updated files
        actionClass
          .findReferencesAsNodes()
          .map(node => node.getSourceFile())
          .filter((value, index, array) => index === array.indexOf(value))
          .forEach(sf => {
            this.parent.modifiedFiles.push(sf);
            sf.fixMissingImports();
          });
      }

      // remove class from file
      actionClass.remove();
    });
  }

  /**
   * replaces global references to a given actionClass with createAction calls
   * @param actionClass the actionClass to update
   * @param migrateTests whether to migrate .spec.ts files
   */
  private updateGlobalActionReferences(actionClass: ClassDeclaration, migrateTests: boolean) {
    console.log(`  updating references for ${actionClass.getName()}...`);

    // iterate over all actionClass references
    let i = 0;
    actionClass.findReferencesAsNodes().forEach(reference => {
      // exclude tests and the actions file itself
      if (
        (migrateTests
          ? true
          : !reference
              .getSourceFile()
              .getBaseName()
              .includes('spec.ts')) &&
        reference.getSourceFile() !== this.actionsFile
      ) {
        // extract information about the reference
        const newExpression = reference.getFirstAncestorByKind(SyntaxKind.NewExpression);
        const unionType = reference.getFirstAncestorByKind(SyntaxKind.UnionType);
        const callExpression = reference.getFirstAncestorByKind(SyntaxKind.CallExpression);

        // NewExpressions or BinaryExpressions or CallExpressions
        if (newExpression) {
          console.log(`    ${newExpression.getSourceFile().getBaseName()}`);
          // swap new class instantiation to actionCreator call
          const hasArgument = newExpression.getArguments().length > 0;
          const argument = hasArgument ? `{payload: ${newExpression.getArguments()[0].getText()}}` : '';
          newExpression.replaceWithText(updateNewExpressionString(actionClass.getName(), argument));
          i++;
          return;
        } else if (unionType) {
          console.log(`    ${unionType.getSourceFile().getBaseName()}`);

          const typesArray = unionType.getTypeNodes().map(type => type.getText().replace(/^\w/, c => c.toLowerCase()));
          const returnTypeString = `ReturnType <${typesArray.map(str => `typeof ${str}`).join(' | ')}>`;
          unionType.replaceWithText(returnTypeString);
          i++;
        } else if (
          callExpression &&
          callExpression
            .getArguments()
            .filter(arg => arg.getKind() === SyntaxKind.Identifier)
            .includes(reference)
        ) {
          console.log(`    ${callExpression.getSourceFile().getBaseName()}`);

          // update action references in call expressions
          callExpression
            .getArguments()
            .filter(arg => arg === reference)
            .forEach(arg => arg.replaceWithText(actionClass.getName().replace(/^\w/, c => c.toLowerCase())));
          i++;
        }

        // ToDo: maybe update other expressions
      }
    });
    i > 0 ? console.log(`    updated ${i} reference${i > 1 ? 's' : ''}.`) : console.log('    no references found.');
    actionClass.getSourceFile().fixMissingImports();
  }

  /**
   * replaces global references to a given enumDeclaration
   * @param enumDeclaration the enumDeclaration to update references of
   * @param migrateTests whether to migrate .spec.ts files
   */
  private updateGlobalEnumReferences(enumDeclaration: EnumDeclaration, migrateTests: boolean) {
    console.log('  updating enum references...');
    let i = 0;
    enumDeclaration
      .findReferencesAsNodes()
      .filter(
        ref =>
          (migrateTests
            ? true
            : !ref
                .getSourceFile()
                .getBaseName()
                .includes('spec.ts')) &&
          ref.getSourceFile() !== this.actionsFile &&
          !ref
            .getSourceFile()
            .getBaseName()
            .includes('reducer.ts') &&
          !ref
            .getSourceFile()
            .getBaseName()
            .includes('effects.ts') &&
          ref.getFirstAncestorByKind(SyntaxKind.ImportDeclaration) === undefined
      )
      .forEach(reference => {
        const sibling = reference.getParentIfKind(SyntaxKind.PropertyAccessExpression)
          ? reference
              .getParent()
              .getLastChild()
              .getText()
          : undefined;
        if (sibling) {
          reference.getParent().replaceWithText(`${sibling.replace(/^\w/, c => c.toLowerCase())}.type`);
          i++;
        }
      });
    console.log(`    updated ${i} reference${i > 1 || i === 0 ? 's' : ''}`);
  }

  /**
   * replaces global references to a given typeAlias
   * @param typeAlias the typeAlias to update references of
   * @param migrateTests whether to migrate .spec.ts files
   */
  private updateGlobalTypeAliasReferences(typeAlias: TypeAliasDeclaration, migrateTests: boolean) {
    console.log('updating type alias references...');
    // extract types to string array
    const types =
      typeAlias.getTypeNode().getKind() === SyntaxKind.UnionType
        ? (typeAlias.getTypeNode() as UnionTypeNode)
            .getTypeNodes()
            .map(typeNode => typeNode.getText().replace(/^\w/, c => c.toLowerCase()))
        : [
            (typeAlias.getTypeNode() as TypeReferenceNode)
              .getTypeName()
              .getText()
              .replace(/^\w/, c => c.toLowerCase()),
          ];
    const typeString = `ReturnType< ${types.map(type => `typeof ${type}`).join(' | ')} >`;
    typeAlias
      .findReferencesAsNodes()
      .filter(
        ref =>
          (migrateTests
            ? true
            : !ref
                .getSourceFile()
                .getBaseName()
                .includes('spec.ts')) &&
          ref.getSourceFile() !== this.actionsFile &&
          ref.getFirstAncestorByKind(SyntaxKind.ImportDeclaration) === undefined
      )
      .forEach(reference => {
        reference.replaceWithText(typeString);
      });
  }

  private checkUnmigratedFile(): boolean {
    const hasEnum = this.actionsFile.getEnums().length > 0;
    const hasClass = this.actionsFile.getClasses().length > 0;
    const hasTypeAlias = this.actionsFile.getTypeAliases().length > 0;
    if (!hasEnum || !hasClass || !hasTypeAlias) {
      console.log('this file is not a valid action file, skipping...');
      return false;
    } else {
      return true;
    }
  }
}
