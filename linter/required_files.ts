// tslint:disable:no-console
export default function checkRequiredFiles(fileName: string , extensions: string[], filesInFolder: object, folderName: string) {
  let numberOfError = 0;

  for (const extension of extensions) {
    const fullFileName = fileName + extension;
    const isInFolder = checkFileInFolder(fullFileName, filesInFolder);
    if (isInFolder) {
      continue;
    }

    console.log(`Error: there is no file ${fullFileName} in ${folderName}`);
    numberOfError += 1;
  }

  return numberOfError;
}

const checkFileInFolder = (fullFileName: string ,  filesInFolder: object) : boolean => {

  for (const [, file] of Object.entries(filesInFolder)) {
    if (fullFileName !== file.name) {
      continue;
    }

    return true;
  }

  return false;
};
