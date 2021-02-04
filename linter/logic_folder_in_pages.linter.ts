// tslint:disable:no-console
export default function linterFolderLogic(child) {
  let error = 0;

  for (const each of child.children) {
    if (each.type === 'file' && each.extension === '.ts') {
      continue;
    }

    error += 1;
    console.log(`Error: ${each.path}`);
    console.log('You cannot put other file formats here');
  }

  return error;
}
