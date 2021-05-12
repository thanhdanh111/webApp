import { RichUtils, EditorState, Modifier } from 'draft-js';
import { headingsStandOnlyStyle } from '../../../constants/stand_only_inline_styles';

const handleToolbarActions = (editorState, action) => {
  if (!editorState) {
    return;
  }

  const oldSelection = editorState.getSelection();
  let newEditorState;

  const reducer =
    (contentState, style) => {

      return Modifier.removeInlineStyle(contentState, oldSelection, style);
    };

  switch (action) {
    case 'H1':
    case 'H2':
    case 'H3':
    case 'NORMAL':
      const nextContentState = headingsStandOnlyStyle.reduce(
        reducer,
        editorState.getCurrentContent(),
      );

      const nextEditorState = EditorState.push(
        editorState,
        nextContentState,
      );

      newEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        action,
      );
      break;
    case 'CODE':
      const removedInlineHeadingStyles = headingsStandOnlyStyle.reduce(
        reducer,
        editorState.getCurrentContent(),
      );

      newEditorState = EditorState.push(
        editorState,
        removedInlineHeadingStyles,
      );

      newEditorState = RichUtils.toggleBlockType(
        newEditorState,
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
