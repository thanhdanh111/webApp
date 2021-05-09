import { RichUtils, EditorState } from 'draft-js';

const handleToolbarActions = (editorState, action) => {
  if (!editorState) {
    return;
  }

  const oldSelection = editorState.getSelection();
  let newEditorState;

  switch (action) {
    case 'CODE':
      newEditorState = RichUtils.toggleBlockType(
        editorState,
        'code-block',
      );

      break;
    case 'unordered-list-item':
      newEditorState = RichUtils.toggleBlockType(
        editorState,
        'unordered-list-item',
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

export default handleToolbarActions;
