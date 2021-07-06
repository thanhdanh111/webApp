import { checkTrueInArray } from 'helpers/check_true_in_array';

function getClassNameOfCodeBlock(currentContent, currentKey, classNameOverride, defaultClassName) {
  const beforeKey = currentContent?.getKeyBefore(currentKey);
  let codeClassName = classNameOverride;

  const beforeBlockType = currentContent?.getBlockForKey(beforeKey)?.getType();

  if (beforeBlockType !== 'code-block') {
    codeClassName = `${defaultClassName} first-code-block`;
  }

  const afterKey = currentContent?.getKeyAfter(currentKey);

  const afterBlockType = currentContent?.getBlockForKey(afterKey)?.getType();

  if (afterBlockType !== 'code-block') {
    codeClassName = `${defaultClassName} last-code-block`;
  }

  if (afterBlockType !== 'code-block' && beforeBlockType !== 'code-block') {
    codeClassName = `${defaultClassName} initial-code-block`;
  }

  return codeClassName;
}

export default function handleStyleForCodeBlock(contentBlock, editorState) {
  const classNameOverride = 'block-wrapper custom-code-block';
  const defaultClassName = 'block-wrapper custom-code-block';
  const invalidDataToHandle = checkTrueInArray({
    conditionsArray: [
      !contentBlock,
      !editorState,
    ],
  });

  if (invalidDataToHandle) {
    return classNameOverride;
  }

  const currentContent = editorState.getCurrentContent();
  const currentKey = contentBlock.getKey();
  const invalidCurrentData = checkTrueInArray({
    conditionsArray: [
      !currentKey,
      !currentContent,
    ],
  });

  if (invalidCurrentData) {
    return classNameOverride;
  }

  return getClassNameOfCodeBlock(currentContent, currentKey, classNameOverride, defaultClassName);
}
