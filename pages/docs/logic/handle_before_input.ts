import { urlRegex } from 'constants/docs_regex';
import { Modifier, EditorState, SelectionState } from 'draft-js';

export function handleBeforeInput(chars, editorState, handleOnChange) {
  if (chars === ' ') {
    const oldSelection = editorState?.getSelection();
    const newContentState = Modifier?.insertText(
      editorState?.getCurrentContent(),
      oldSelection,
      ' ',
      editorState.getCurrentInlineStyle(),
    );
    const addedSpaceEditorState = EditorState.push(editorState, newContentState);

    const newEditorState = findURLInTextOfBlock(addedSpaceEditorState);

    handleOnChange(newEditorState);

    return 'handled';
  }

  return;
}

function findURLInTextOfBlock(editorState) {
  let contentState = editorState?.getCurrentContent();
  const selectionState = editorState?.getSelection();
  const blockKey = selectionState?.getStartKey();
  const currentContentBlock = contentState?.getBlockForKey(blockKey);
  const textOfBlock = currentContentBlock?.getText();
  const splitedSpaces = textOfBlock?.split(' ');

  let filteredIndex = 0;

  splitedSpaces.forEach((word) => {
    const urlRegexFunc = new RegExp(urlRegex);
    const spaceLength = 1;
    const isUrl = word.length > 5 && urlRegexFunc.test(word);

    if (isUrl) {
      const contentStateWithEntity = contentState.createEntity(
        'LINK',
        'IMMUTABLE',
        { url: word, href: word },
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newSelection = SelectionState.createEmpty(blockKey);
      const startOffset = filteredIndex;
      const endOffset = filteredIndex + word.length - 1;
      const updatedSelection = newSelection.merge({
        anchorOffset: startOffset,
        focusOffset: endOffset + 1,
        hasFocus: false,
      });

      contentState = Modifier.applyEntity(
        contentState,
        updatedSelection,
        entityKey,
      );
    }

    filteredIndex = filteredIndex + word.length + spaceLength;
  });

  return EditorState.forceSelection(EditorState.push(editorState, contentState), selectionState);
}
