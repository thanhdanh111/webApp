// tslint:disable:no-console
export default function linterFolderUI(folder) {
  let error = 0;
  const regexStories = new RegExp('.stories.tsx$');
  const regexTsx = new RegExp('^(?:(?!stories.tsx$).)*(.tsx)$');
  const regexSass = new RegExp('.sass$');
  const regexT = new RegExp('.sass$|.tsx$|.stories.tsx$');
  const arrRegex = [regexStories, regexTsx, regexSass];

  for (const element of folder.children) {
    if (element.type !== 'file') {
      continue;
    }

    const isValidFile = regexT.test(element.name);

    if (isValidFile) {
      continue;
    }

    error += 1;
    console.log(`Error: ${element.path}`);
    console.log('You cannot put other file formats here');
  }

  const isValidFolder = arrRegex.every((each) => folder.children.some((child) => {
    if (child.type === 'file') {
      const isRightFormat = each.test(child.name);

      return isRightFormat;
    }

    linterFolderUI(child);
  }));

  if (!isValidFolder) {
    error += 1;
    console.log(`Error: ${folder.path}`);
    console.log('Folder here should have these three types of file extensions only: .stories.tsx, .tsx, .sass');
  }

  return error;
}
