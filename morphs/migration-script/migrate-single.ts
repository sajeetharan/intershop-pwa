import { Project } from 'ts-morph';

import { ActionCreatorsMorpher } from '../migrate-action-creators/migrate-action-creators';

import { environment } from './environment';

const store = 'contact';
const project = new Project({ tsConfigFilePath: environment.tsconfig });

const morpher = new ActionCreatorsMorpher(store, project, '');

morpher.actionsMorph.migrateActions();
morpher.reducerMorph.migrateReducer();
morpher.effectsMorph.migrateEffects();

project.save();

project.getSourceFiles().forEach(sf => {
  if (sf.getFilePath().includes('store') && sf.getFilePath().includes(store)) {
    console.log(sf.getBaseName());
    sf.fixUnusedIdentifiers();
    sf.fixMissingImports();
  }
});
project.save();
