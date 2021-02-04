const regexT = new RegExp('.sass$|.tsx$|.stories.tsx$');
const regexStories = new RegExp('.stories.tsx$');
const regexTsx = new RegExp('^(?:(?!stories.tsx$).)*(.tsx)$');
const regexSass = new RegExp('.sass$');
const arrRegex = [regexStories, regexTsx, regexSass];

// tslint:disable:no-console
export function checkType(item) {
  return arrRegex.every((regex) => {

    const isValidFile = item.children.some((child) => regex.test(child.name));

    if (!isValidFile) {
      console.log(`Error: ${item.path}`);
      console.log('Each folder here should have these three types of file extensions only: .stories.tsx, .tsx, .sass');
    }

    return isValidFile;
  });
}

export function checkName(item) {
  return item.children.every((child) => {
    const isValid = regexT.test(child.name);

    if (!isValid) {
      console.log(`Error: ${child.path}`);
      console.log('You cannot put other file formats here');
    }

    return isValid;
  });
}
