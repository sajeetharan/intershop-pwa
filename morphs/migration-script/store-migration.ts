import { Project } from 'ts-morph';

import { ActionCreatorsMorpher } from '../migrate-action-creators/migrate-action-creators';

import { environment } from './environment';

// tslint:disable: no-console
/*
  Please make sure there are no star imports used in your store!
*/

const project = new Project({ tsConfigFilePath: environment.tsconfig });

const morphers = environment.stores.map(store => {
  if (typeof store === 'string') {
    return new ActionCreatorsMorpher(store, project, '');
  } else {
    return new ActionCreatorsMorpher(store.name, project, store.path);
  }
});

console.log('updating all actions');
morphers.forEach(morpher => {
  console.log(`migrating ${morpher.storeName} actions`);
  morpher.actionsMorph.migrateActions();
  environment.saveIndividual ? project.save() : null;
});

console.log('updating all reducers');
morphers.forEach(morpher => {
  console.log(`migrating ${morpher.storeName} reducer`);
  morpher.reducerMorph.migrateReducer();
  environment.saveIndividual ? project.save() : null;
});

console.log('updating all effects');
morphers.forEach(morpher => {
  console.log(`migrating ${morpher.storeName} effects`);
  morpher.effectsMorph.migrateEffects();
  environment.saveIndividual ? project.save() : null;
});

if (environment.save) {
  console.log('saving changes...');
  project.save();
}
