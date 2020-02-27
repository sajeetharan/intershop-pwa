import { getNextToken } from 'tsutils';
import * as ts from 'typescript';

// tslint:disable:no-console
export class RuleHelpers {
  static dumpNode(node: ts.Node, dumpTokens: boolean = false) {
    if (node) {
      console.log('----------------------------------------');
      console.log('type: ' + node.kind);
      console.log('text: ' + node.getText());
      console.log('child count: ' + node.getChildCount());
      for (let index = 0; index < node.getChildCount(); index++) {
        const c = node.getChildAt(index);
        console.log(`child #${index} ${c.kind}:${c.getText()}`);
      }
      if (dumpTokens) {
        let pointer = node.getFirstToken();
        while (pointer !== node.getLastToken()) {
          console.log(`${pointer.kind}:${pointer.getText()}`);
          pointer = getNextToken(pointer);
        }
        if (pointer) {
          console.log(`${pointer.kind}:${pointer.getText()}`);
        }
      }
    } else {
      console.log(node);
    }
  }

  static extractVariableNameInDeclaration(statement: ts.Node): string {
    return statement
      .getChildAt(1)
      .getFirstToken()
      .getText();
  }

  static getNextChildTokenOfKind(node: ts.Node, kind: ts.SyntaxKind): ts.Node {
    let pointer = node.getFirstToken();
    while (pointer && pointer.kind !== kind) {
      if (pointer === node.getLastToken()) {
        return;
      }
      pointer = getNextToken(pointer);
    }
    return pointer;
  }

  static getDescribeBody(sourceFile: ts.SourceFile): ts.Node {
    const statements = sourceFile.statements.filter(
      stmt => stmt.kind === ts.SyntaxKind.ExpressionStatement && stmt.getFirstToken().getText() === 'describe'
    );
    if (statements.length && statements[0].getChildAt(0)) {
      const describeStatement = statements[0].getChildAt(0).getChildAt(2);
      return describeStatement
        .getChildAt(2)
        .getChildAt(4)
        .getChildAt(1);
    }
    return;
  }

  static getAllStarImportNodes(sourceFile: ts.SourceFile): ts.Node[] {
    return RuleHelpers.filterTreeByCondition(
      sourceFile,
      node => node.kind === ts.SyntaxKind.PropertyAccessExpression || node.kind === ts.SyntaxKind.QualifiedName
    );
  }

  static hasChildNodesWithText(node: ts.Node, text: string): boolean {
    return node.getChildren().filter(child => child.getText() === text).length > 0;
  }

  /**
   *  filters trees by a condition. If a node matches the condition, it's children will not be traversed.
   * @param node node whose subtree should be filtered
   * @param callBack filtering condition
   */
  private static filterTreeByCondition(node: ts.Node, callBack: (n: ts.Node) => boolean): ts.Node[] {
    const nodesList: ts.Node[] = [];
    // add node to list if it matches kind
    if (callBack(node)) {
      nodesList.push(node);
    }
    // recursively filter all children
    node.getChildren().forEach(c => {
      RuleHelpers.filterTreeByCondition(c, callBack).forEach(e => nodesList.push(e));
    });
    return nodesList;
  }
}
