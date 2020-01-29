import { Project } from 'ts-morph';

import { environment } from './environment';

const project = new Project({ tsConfigFilePath: environment.tsconfig });
project.getSourceFiles().forEach(sf => {
  if (sf.getFilePath().includes('store')) {
    console.log(sf.getBaseName());
    sf.fixUnusedIdentifiers();
    sf.fixMissingImports();
  }
});
project.save();
