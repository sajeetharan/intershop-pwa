import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { mergeMap } from 'rxjs/operators';

import {
  createAppLastRoutingModule,
  createApplication,
  createModule,
  createSchematicRunner,
} from '../utils/testHelper';

import { determineStoreLocation } from './factory';
import { PWAStoreOptionsSchema as Options } from './schema';

describe('Store Schematic', () => {
  const schematicRunner = createSchematicRunner();
  const defaultOptions: Options = {
    name: 'foo',
    project: 'bar',
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await createApplication(schematicRunner)
      .pipe(
        createModule(schematicRunner, { name: 'shell' }),
        createAppLastRoutingModule(schematicRunner),
        mergeMap(tree => schematicRunner.runSchematicAsync('extension', { name: 'feature', project: 'bar' }, tree))
      )
      .toPromise();

    appTree.create(
      '/src/app/core/store/core-store.module.ts',
      `import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';

import { CoreState } from './core-store';
import { CountriesEffects } from './countries/countries.effects';
import { countriesReducer } from './countries/countries.reducer';

export const coreReducers: ActionReducerMap<CoreState> = {countries: countriesReducer};

export const coreEffects = [
  CountriesEffects,
];

@NgModule({
  imports: [
    EffectsModule.forRoot(coreEffects),
    StoreModule.forRoot(coreReducers),
  ],
})
export class CoreStoreModule {}
`
    );
    appTree.create(
      '/src/app/core/store/core-store.ts',
      `import { Selector } from '@ngrx/store';

import { CountriesState } from './countries/countries.reducer';

export interface CoreState {
  countries: CountriesState;
}

export const getCoreState: Selector<CoreState, CoreState> = state => state;
`
    );
    appTree = await schematicRunner
      .runSchematicAsync('store-group', { ...defaultOptions, name: 'bar' }, appTree)
      .toPromise();
  });

  it('should create a store in core store by default', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematicAsync('store', options, appTree).toPromise();
    const files = tree.files.filter(x => x.search('foo') >= 0);
    expect(files).toMatchInlineSnapshot(`
      Array [
        "/src/app/core/store/foo/foo.actions.ts",
        "/src/app/core/store/foo/foo.effects.spec.ts",
        "/src/app/core/store/foo/foo.effects.ts",
        "/src/app/core/store/foo/foo.reducer.ts",
        "/src/app/core/store/foo/foo.selectors.spec.ts",
        "/src/app/core/store/foo/foo.selectors.ts",
        "/src/app/core/store/foo/index.ts",
      ]
    `);
  });

  it('should register a store in core store by default', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematicAsync('store', options, appTree).toPromise();
    const storeContent = tree.readContent('/src/app/core/store/core-store.ts');
    expect(storeContent).toContain('import { FooState }');
    expect(storeContent).toContain('foo: FooState');
    const storeModuleContent = tree.readContent('/src/app/core/store/core-store.module.ts');
    expect(storeModuleContent).toContain('import { fooReducer }');
    expect(storeModuleContent).toContain('foo: fooReducer');
    expect(storeModuleContent).toContain('import { FooEffects }');
    expect(storeModuleContent).toContain('FooEffects');
  });

  it('should create a store in core feature store if requested', async () => {
    const options = { ...defaultOptions, feature: 'bar' };

    const tree = await schematicRunner.runSchematicAsync('store', options, appTree).toPromise();
    const files = tree.files.filter(x => x.search('foo') >= 0);
    expect(files).toMatchInlineSnapshot(`
      Array [
        "/src/app/core/store/bar/foo/foo.actions.ts",
        "/src/app/core/store/bar/foo/foo.effects.spec.ts",
        "/src/app/core/store/bar/foo/foo.effects.ts",
        "/src/app/core/store/bar/foo/foo.reducer.ts",
        "/src/app/core/store/bar/foo/foo.selectors.spec.ts",
        "/src/app/core/store/bar/foo/foo.selectors.ts",
        "/src/app/core/store/bar/foo/index.ts",
      ]
    `);
  });

  it('should register in feature store', async () => {
    const options = { ...defaultOptions, feature: 'bar' };

    const tree = await schematicRunner.runSchematicAsync('store', options, appTree).toPromise();
    const storeContent = tree.readContent('/src/app/core/store/bar/bar-store.ts');
    expect(storeContent).toContain('import { FooState }');
    expect(storeContent).toContain('foo: FooState');
    const storeModuleContent = tree.readContent('/src/app/core/store/bar/bar-store.module.ts');
    expect(storeModuleContent).toContain('import { fooReducer }');
    expect(storeModuleContent).toContain('foo: fooReducer');
    expect(storeModuleContent).toContain('import { FooEffects }');
    expect(storeModuleContent).toContain('FooEffects');
  });

  it('should create a store in extension if requested', async () => {
    const options = { ...defaultOptions, extension: 'feature' };

    const tree = await schematicRunner.runSchematicAsync('store', options, appTree).toPromise();
    const files = tree.files.filter(x => x.search('foo') >= 0);
    expect(files).toMatchInlineSnapshot(`
      Array [
        "/src/app/extensions/feature/store/foo/foo.actions.ts",
        "/src/app/extensions/feature/store/foo/foo.effects.spec.ts",
        "/src/app/extensions/feature/store/foo/foo.effects.ts",
        "/src/app/extensions/feature/store/foo/foo.reducer.ts",
        "/src/app/extensions/feature/store/foo/foo.selectors.spec.ts",
        "/src/app/extensions/feature/store/foo/foo.selectors.ts",
        "/src/app/extensions/feature/store/foo/index.ts",
      ]
    `);
  });

  it('should register in extension store', async () => {
    const options = { ...defaultOptions, extension: 'feature' };

    const tree = await schematicRunner.runSchematicAsync('store', options, appTree).toPromise();
    const storeContent = tree.readContent('/src/app/extensions/feature/store/feature-store.ts');
    expect(storeContent).toContain('import { FooState }');
    expect(storeContent).toContain('foo: FooState');
    const storeModuleContent = tree.readContent('/src/app/extensions/feature/store/feature-store.module.ts');
    expect(storeModuleContent).toContain('import { fooReducer }');
    expect(storeModuleContent).toContain('foo: fooReducer');
    expect(storeModuleContent).toContain('import { FooEffects }');
    expect(storeModuleContent).toContain('FooEffects');
  });

  it('should throw if both feature and extension are supplied', done => {
    const options = { ...defaultOptions, extension: 'feature', feature: 'bar' };

    schematicRunner.runSchematicAsync('store', options, appTree).subscribe(fail, err => {
      expect(err).toMatchInlineSnapshot(`[Error: cannot add feature store in extension]`);
      done();
    });
  });

  describe('determineStoreLocation', () => {
    it('should handle simple stores', () => {
      const config = {
        extension: undefined,
        feature: undefined,
        name: 'foobar',
        parent: 'core',
        parentStorePath: 'src/app/core/store/core',
        path: 'src/app/core/store/',
        project: 'bar',
      };

      expect(determineStoreLocation(appTree, { ...defaultOptions, name: 'foobar' })).toEqual(config);
      expect(determineStoreLocation(appTree, { ...defaultOptions, name: 'core/store/foobar' })).toEqual(config);
    });

    it('should handle feature stores', () => {
      const config = {
        extension: undefined,
        feature: 'bar',
        name: 'foobar',
        parent: 'bar',
        parentStorePath: 'src/app/core/store/bar/bar',
        path: 'src/app/core/store/bar/',
        project: 'bar',
      };

      expect(determineStoreLocation(appTree, { ...defaultOptions, name: 'foobar', feature: 'bar' })).toEqual(config);
      expect(determineStoreLocation(appTree, { ...defaultOptions, name: 'bar/foobar' })).toEqual(config);
      expect(determineStoreLocation(appTree, { ...defaultOptions, name: 'core/store/bar/foobar' })).toEqual(config);
    });

    it('should handle extension stores', () => {
      const config = {
        extension: 'bar',
        feature: undefined,
        name: 'foobar',
        parent: 'bar',
        parentStorePath: 'src/app/extensions/bar/store/bar',
        path: 'src/app/extensions/bar/store/',
        project: 'bar',
      };

      expect(determineStoreLocation(appTree, { ...defaultOptions, name: 'foobar', extension: 'bar' })).toEqual(config);
      expect(determineStoreLocation(appTree, { ...defaultOptions, name: 'extensions/bar/foobar' })).toEqual(config);
    });

    it('should throw if feature equals store name', () => {
      expect(() =>
        determineStoreLocation(appTree, { ...defaultOptions, feature: defaultOptions.name })
      ).toThrowErrorMatchingInlineSnapshot(`"name of feature and store cannot be equal"`);
    });

    it('should throw if extension equals store name', () => {
      expect(() =>
        determineStoreLocation(appTree, { ...defaultOptions, extension: defaultOptions.name })
      ).toThrowErrorMatchingInlineSnapshot(`"name of extension and store cannot be equal"`);
    });
  });
});
