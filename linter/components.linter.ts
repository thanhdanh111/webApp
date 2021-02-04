import { checkType,  checkName } from './type_extension_name';
import checkRequiredFiles from './required_files';

// tslint:disable:no-console
export default function linterComponents(componentsTree) {
  // let error = 0;

  // const filterComponents = componentsTree?.children.filter(
  //   (folder) => folder.name !== 'handle_errors' && folder.name !== '.DS_Store');

  // for (const item of filterComponents) {
  //   if (item.type !== 'directory') {
  //     console.log(`Error: ${item.name}`);
  //     console.log('Please contains only folders in Components');
  //     process.exit(1);
  //   }

  //   const isValidType = checkType(item);

  //   const isValidName = checkName(item);

  //   if (!isValidType) {
  //     error += 1;
  //   }

  //   if (isValidName) {
  //     item.children.forEach((element) => {
  //       const firstName = element.name.substring(0, element.name.indexOf('.'));
  //       const extensions = ['.stories.tsx', '.tsx'];

  //       error = error + checkRequiredFiles(firstName, extensions, item.children, item.path);
  //     });

  //     continue;
  //   }

  //   error += 1;
  // }

  // return error;

  return;
}
