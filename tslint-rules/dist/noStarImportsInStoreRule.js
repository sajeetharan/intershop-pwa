"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Lint = require("tslint");
var typescript_1 = require("typescript");
var ruleHelpers_1 = require("./ruleHelpers");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.filePattern = '^.*.(effects|reducer|actions).(ts|spec.ts)$';
        return _this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var _this = this;
        return this.applyWithFunction(sourceFile, function (ctx) {
            sourceFile.statements
                .filter(function (stm) { return stm.kind === typescript_1.SyntaxKind.ImportDeclaration; })
                .forEach(function (node) {
                _this.visitImportDeclaration(ctx, node);
            });
        });
    };
    Rule.prototype.visitImportDeclaration = function (ctx, importStatement) {
        if (new RegExp(this.filePattern).test(importStatement.getSourceFile().fileName) &&
            importStatement.getChildAt(1).getChildAt(0).kind === typescript_1.SyntaxKind.NamespaceImport) {
            var importString_1 = importStatement
                .getChildAt(1)
                .getChildAt(0)
                .getChildAt(2)
                .getText();
            var importNodes = ruleHelpers_1.RuleHelpers.getAllStarImportNodes(importStatement.getSourceFile()).filter(function (node) {
                return ruleHelpers_1.RuleHelpers.hasChildNodesWithText(node, importString_1);
            });
            var newImportStrings = importNodes
                .map(function (node) {
                return node
                    .getText()
                    .replace(importString_1 + ".", '')
                    .split('.');
            })
                .reduce(function (acc, value) { return acc.concat(value); }, [])
                .filter(function (node, index, array) { return array.indexOf(node) === index; });
            var importFix = new Lint.Replacement(importStatement.getStart(), importStatement.getWidth(), "import {" + newImportStrings.join(',') + "} from " + importStatement.getChildAt(3).getText());
            ctx.addFailureAtNode(importStatement, "Star imports in ngrx store files are banned.", importFix);
            importNodes.forEach(function (node) {
                var fix = new Lint.Replacement(node.getStart(), node.getWidth(), node.getText().replace(importString_1 + ".", ''));
                ctx.addFailureAtNode(node, 'star imports are banned', fix);
            });
        }
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
