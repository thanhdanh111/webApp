// tslint:disable:no-console
export default function linterFolderTest(child) {
  let error = 0;

  for (const each of child.children) {
    if (each.type === 'file' && !(each.name.match('.test.ts$'))) {
      error += 1;
      console.log(`Error: ${each.path}`);
      console.log('You cannot put other file formats here');
    }

    if (each.type !== 'directory') {
      continue;
    }

    for (const result of each.children) {
      if (result.type === 'directory') {
        error += 1;
        console.log(`Error: ${result.path}`);
        console.log('You cannot put other directory here');
      }

      if (result.type === 'file' && result.extension === '.png') {
        continue;
      }

      error += 1;
      console.log(`Error: ${result.path}`);
      console.log('You cannot put other file formats here');

    }
  }

  return error;
}
