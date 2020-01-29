const fs = require('fs');
const { parse, stringify } = require('comment-json');
const { execSync } = require('child_process');

const tslintJson = parse(fs.readFileSync('./tslint.json', { encoding: 'UTF-8' }));
tslintJson.rules['no-star-imports-in-store'] = true;
fs.writeFileSync('./tslint.json', stringify(tslintJson, null, 2));

execSync('npx prettier --write tslint.json');
