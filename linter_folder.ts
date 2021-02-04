// import linterComponents from './linter/components.linter';
import linterPages from './linter/pages.linter';

// tslint:disable:no-console
const dirTree = require('directory-tree');
// const componentsTree = dirTree('./components');
const pagesTree = dirTree('./pages');
let errorComponent = 0;
let errorPage = 0;

// Check folder Components uncomment when create component
// const resultComponent = linterComponents(componentsTree);
// errorComponent = errorComponent + resultComponent;
// console.log(`Error Components: ${errorComponent}`);

// Check folder Pages
const resultPage = linterPages(pagesTree);
errorPage = errorPage + resultPage;
console.log(`Error Pages: ${errorPage}`);

if (errorPage > 0 || errorComponent > 0) {
  process.exit(1);
}

console.log('DONE');
