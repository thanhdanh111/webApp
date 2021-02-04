import linterFolderUI from './ui_folder_in_pages.linter';
import linterFolderLogic from './logic_folder_in_pages.linter';
import linterFolderTest from './test_folder_in_pages.linter';

// tslint:disable:no-console
export default function linterPages(pagesTree) {
  const FILE = ['.DS_Store', 'index.page.tsx', '_app.page.tsx', '_document.page.tsx'];
  let error = 0;

  const filterPages = pagesTree.children.filter((folder) => !(FILE.includes(folder.name)));

  filterPages.forEach((child) => {
    // tslint:disable-next-line:early-exit
    if (child.type !== 'directory') {
      console.log(`Error: ${child.path}`);
      console.log('Do not put the file here, please check folders pages');
    }
  });

  const sizePages = Object.keys(filterPages).length;

  // tslint:disable-next-line:no-increment-decrement
  for (let count = 0; count < sizePages; count++) {
    error = error + checkEachFolder(filterPages[count].path);
  }

  return error;
}

function checkEachFolder(path) {
  const dirTree = require('directory-tree');
  const tree = dirTree(path);
  const arr = ['UI', 'logic', 'test'];
  const name = { ui: 'UI', logic: 'logic', test: 'test' };
  let error = 0;

  const isValid = arr.every((each) => tree.children.some((child) => child.name === each));

  if (!isValid) {
    console.log(`Error folder in pages: ${tree.name}`);
    console.log('Each folder in the pages should have three folders: UI, logic, test');
    process.exit(1);
  }

  for (const child of tree.children) {
    if (child.type === 'file' && child.extension !== '.tsx') {
      error += 1;
      console.log(`Error: ${child.path}`);
      console.log('You cannot put other file formats here');
    }

    switch (child.name) {
      case (name.ui):
        error = error + linterFolderUI(child);
        continue;
      case (name.logic):
        error = error + linterFolderLogic(child);
        continue;
      case (name.test):
        error = error + linterFolderTest(child);
        continue;
      default:
        break;
    }
  }

  return error;
}
