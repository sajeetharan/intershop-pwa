"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var projectStructureRule_1 = require("./projectStructureRule");
describe('ProjectStructureRule', function () {
    describe('kebabCaseFromPascalCase', function () {
        test('should convert simple class names', function () {
            expect(projectStructureRule_1.kebabCaseFromPascalCase('test')).toEqual('test');
            expect(projectStructureRule_1.kebabCaseFromPascalCase('Test')).toEqual('test');
        });
        test('should convert complexer class names', function () {
            expect(projectStructureRule_1.kebabCaseFromPascalCase('TeClass')).toEqual('te-class');
            expect(projectStructureRule_1.kebabCaseFromPascalCase('TestClass')).toEqual('test-class');
        });
        test('should convert complexest class names', function () {
            expect(projectStructureRule_1.kebabCaseFromPascalCase('ATest')).toEqual('a-test');
            expect(projectStructureRule_1.kebabCaseFromPascalCase('ABTest')).toEqual('ab-test');
            expect(projectStructureRule_1.kebabCaseFromPascalCase('ABCTest')).toEqual('abc-test');
            expect(projectStructureRule_1.kebabCaseFromPascalCase('TestA')).toEqual('test-a');
            expect(projectStructureRule_1.kebabCaseFromPascalCase('TestAB')).toEqual('test-ab');
            expect(projectStructureRule_1.kebabCaseFromPascalCase('TestABC')).toEqual('test-abc');
        });
    });
});
