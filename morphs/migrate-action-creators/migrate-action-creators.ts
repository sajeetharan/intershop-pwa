import { Project, SourceFile } from 'ts-morph';

import { ActionCreatorsActionsMorpher } from './migrate-action-creators.actions';
import { ActionCreatorsEffectMorpher } from './migrate-action-creators.effects';
import { ActionCreatorsReducerMorpher } from './migrate-action-creators.reducers';

export class ActionCreatorsMorpher {
  actionsMorph: ActionCreatorsActionsMorpher;
  reducerMorph: ActionCreatorsReducerMorpher;
  effectsMorph: ActionCreatorsEffectMorpher;
  modifiedFiles: SourceFile[];

  constructor(public storeName: string, public project: Project, public storePath = '') {
    const fileAccess = storePath !== '' ? `${storePath}/${storeName}` : storeName;
    this.actionsMorph = new ActionCreatorsActionsMorpher(project.getSourceFile(`${fileAccess}.actions.ts`), this);
    this.reducerMorph = new ActionCreatorsReducerMorpher(project.getSourceFile(`${fileAccess}.reducer.ts`), this);
    this.effectsMorph = new ActionCreatorsEffectMorpher(project.getSourceFile(`${fileAccess}.effects.ts`), this);
    this.modifiedFiles = [];
  }
}
