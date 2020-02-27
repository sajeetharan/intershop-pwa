import * as Lint from 'tslint';
import { ImportDeclaration, SourceFile, SyntaxKind } from 'typescript';

import { RuleHelpers } from './ruleHelpers';

export class Rule extends Lint.Rules.AbstractRule {
  filePattern = '^.*.(effects|reducer|actions).(ts|spec.ts)$';
  apply(sourceFile: SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, ctx => {
      sourceFile.statements
        .filter(stm => stm.kind === SyntaxKind.ImportDeclaration)
        .forEach(node => {
          this.visitImportDeclaration(ctx, node as ImportDeclaration);
        });
    });
  }

  private visitImportDeclaration(ctx: Lint.WalkContext<void>, importStatement: ImportDeclaration) {
    if (
      new RegExp(this.filePattern).test(importStatement.getSourceFile().fileName) &&
      importStatement.getChildAt(1).getChildAt(0).kind === SyntaxKind.NamespaceImport
    ) {
      const importString = importStatement
        .getChildAt(1)
        .getChildAt(0)
        .getChildAt(2)
        .getText();
      // get all Nodes that use the star import
      const importNodes = RuleHelpers.getAllStarImportNodes(importStatement.getSourceFile()).filter(node =>
        RuleHelpers.hasChildNodesWithText(node, importString)
      );

      // replace import itself
      const newImportStrings = importNodes
        .map(node =>
          node
            .getText()
            .replace(`${importString}.`, '')
            .split('.')
        )
        .reduce((acc, value) => acc.concat(value), [])
        .filter((node, index, array) => array.indexOf(node) === index);

      const importFix = new Lint.Replacement(
        importStatement.getStart(),
        importStatement.getWidth(),
        `import {${newImportStrings.join(',')}} from ${importStatement.getChildAt(3).getText()}`
      );
      ctx.addFailureAtNode(importStatement, `Star imports in ngrx store files are banned.`, importFix);

      // replace all star import references
      importNodes.forEach(node => {
        const fix = new Lint.Replacement(
          node.getStart(),
          node.getWidth(),
          node.getText().replace(`${importString}.`, '')
        );
        ctx.addFailureAtNode(node, 'star imports are banned', fix);
      });
    }
  }
}
