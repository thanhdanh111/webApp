export default function handleStyleForCodeBlock(contentBlock, editorState) {
  let classNameOverride = 'block-wrapper custom-code-block';
  const defaultClassName = 'block-wrapper custom-code-block';
  if (!contentBlock || !editorState) {
    return classNameOverride;
  }

  const currentContent = editorState.getCurrentContent();
  const currentKey = contentBlock.getKey();

  if (!currentKey || !currentContent) {
    return classNameOverride;
  }

  const beforeKey = currentContent?.getKeyBefore(currentKey);

  const beforeBlockType = currentContent?.getBlockForKey(beforeKey)?.getType();

  if (beforeBlockType !== 'code-block') {
    classNameOverride = `${defaultClassName} first-code-block`;
  }

  const afterKey = currentContent?.getKeyAfter(currentKey);

  const afterBlockType = currentContent?.getBlockForKey(afterKey)?.getType();

  if (afterBlockType !== 'code-block') {
    classNameOverride = `${defaultClassName} last-code-block`;
  }

  if (afterBlockType !== 'code-block' && beforeBlockType !== 'code-block') {
    classNameOverride = `${defaultClassName} initial-code-block`;
  }

  return classNameOverride;
}
