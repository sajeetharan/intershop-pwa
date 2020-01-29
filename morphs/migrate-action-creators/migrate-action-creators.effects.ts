import { CallExpression, SourceFile, SyntaxKind } from 'ts-morph';

import { checkForNamespaceImports, isMap } from '../morph-helpers/morph-helpers';

import { ActionCreatorsMorpher } from './migrate-action-creators';

export class ActionCreatorsEffectMorpher {
  constructor(public effectsFile: SourceFile, public parent: ActionCreatorsMorpher) {}

  migrateEffects() {
    if (!this.effectsFile) {
      console.log('no effects file found');
      return;
    }
    console.log('replacing effects...');
    checkForNamespaceImports(this.effectsFile);
    this.effectsFile
      .getClasses()[0]
      .getChildrenOfKind(SyntaxKind.PropertyDeclaration)
      .filter(property => property.getFirstChildByKind(SyntaxKind.Decorator))
      .forEach(effect => {
        // retrieve information from effect
        const name = effect.getName();
        const decoratorConfig = effect.getFirstChildByKindOrThrow(SyntaxKind.Decorator).getArguments();
        let logic = effect.getInitializerIfKindOrThrow(SyntaxKind.CallExpression);

        // update effect logic
        logic = this.ensurePipeSafety(logic);
        logic = this.updateIif(logic);
        logic = this.updateOfType(logic);
        logic = this.updateMapErrorToAction(logic);

        // add new updated property declaration
        this.effectsFile.getClasses()[0].addProperty({
          name,
          initializer:
            decoratorConfig.length > 0
              ? `createEffect(() => ${logic.getText()}, ${decoratorConfig[0].getText()})`
              : `createEffect(() => ${logic.getText()})`,
        });
        effect.remove();
      });
    this.parent.modifiedFiles.push(this.effectsFile);
    this.effectsFile.fixMissingImports();
  }

  private ensurePipeSafety(pipe: CallExpression): CallExpression {
    const exps = pipe.getDescendantsOfKind(SyntaxKind.CallExpression);
    exps.push(pipe);
    exps
      .filter(
        exp =>
          exp
            .getExpression()
            .getText()
            .includes('pipe') && exp.getArguments().length > 10
      )
      .forEach(pipeExp => {
        const args = pipeExp.getArguments();
        let chunks = [];
        let i = 0;
        while (i < args.length) {
          chunks.push(args.slice(i, (i += 10)));
        }
        chunks = chunks.map(chunk => chunk.map(c => c.getText()).join(', '));
        const newString = `${pipeExp.getExpression().getText()}(${chunks.join(' ).pipe( ')})`;
        pipeExp.replaceWithText(newString);
      });
    return pipe;
  }
  /**
   * updates ofType calls in given pipe
   * @param pipe pipe CallExpression
   */
  private updateOfType(pipe: CallExpression): CallExpression {
    pipe
      // get piped functions and their descendants
      .getDescendantsOfKind(SyntaxKind.CallExpression)
      .filter(exp => exp.getExpression().getText() === 'ofType')
      .forEach(exp => {
        if (exp) {
          // remove Type Argument and update actionType
          if (
            exp.getTypeArguments().length > 0 &&
            !exp
              .getArguments()
              .map(arg => arg.getText())
              .includes('UPDATE')
          ) {
            exp.removeTypeArgument(exp.getFirstChildByKind(SyntaxKind.TypeReference));
          }
          const args = exp.getArguments();
          args.forEach(argument => {
            if (!(argument.getText() === 'ROOT_EFFECTS_INIT' || argument.getText() === 'UPDATE')) {
              const t = argument.getLastChildByKind(SyntaxKind.Identifier) || argument;
              exp.addArgument(`${t.getText().replace(/^\w/, c => c.toLowerCase())}`);
              exp.removeArgument(argument);
            }
          });
        }
      });
    return pipe;
  }

  /**
   * PLACEHOLDER: updates different map calls in given pipe
   * @param pipe pipe CallExpression
   */
  private updateMap(pipe: CallExpression): CallExpression {
    const lastCall = pipe.getLastChildByKind(SyntaxKind.CallExpression);
    if (isMap(lastCall.getFirstChildByKind(SyntaxKind.Identifier).getText())) {
      return pipe;
    }
    return pipe;
  }

  /**
   * updates Iif calls in given pipe by adding a type argument
   * @param pipe pipe CallExpression
   */
  private updateIif(pipe: CallExpression): CallExpression {
    const exps = pipe.getDescendantsOfKind(SyntaxKind.CallExpression);
    exps.push(pipe);
    exps
      .filter(exp => exp.getExpression().getText() === 'iif')
      .forEach(iif => iif.addTypeArguments(['ApplyConfiguration ', 'ApplyConfiguration']));
    return pipe;
  }

  /**
   * updated mapErrorToAction calls to use new version "mapErroToActionV8"
   * @param pipe pipe CallExpression
   */
  private updateMapErrorToAction(pipe: CallExpression): CallExpression {
    pipe.getDescendantsOfKind(SyntaxKind.CallExpression).forEach(descendant => {
      if (descendant.getExpression().getText() === 'mapErrorToAction') {
        descendant.getExpression().replaceWithText('mapErrorToActionV8');
      }
    });
    return pipe;
  }
}
