import { RichUtils, EditorState } from 'draft-js';

const handleSideToolbarActions = (editorState, action) => {
  if (!editorState) {
    return;
  }

  const oldSelection = editorState.getSelection();
  let newEditorState;

  switch (action) {
    case 'unstyled':
    case 'header-one':
    case 'header-two':
    case 'header-three':
    case 'code-block':
    case 'ordered-list-item':
    case 'unordered-list-item':

      newEditorState = RichUtils.toggleBlockType(
        editorState,
        action,
      );
      break;
    default:
      newEditorState = RichUtils.toggleInlineStyle(
        editorState,
        action,
      );

      break;
  }

  return EditorState.forceSelection(
    newEditorState,
    oldSelection,
  );
};

export default handleSideToolbarActions;
