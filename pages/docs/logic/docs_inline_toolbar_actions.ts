import { RichUtils, EditorState } from 'draft-js';
import { displayToolbar } from './docs_actions';

export function handleToolbarActions(editorState, action) {
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
}

export function showUpToolbar(newEditorState, needDisplay, dispatch) {
  const selection = window.getSelection();
  const selectedText = selection?.toString();
  const haveOtherToolbar =  !!document.getElementById('sideToolbar');
  const invalidSelection = !selectedText?.length ||
    typeof selectedText !== 'string' ||
    selection?.type === 'Caret' ||
    !newEditorState.getCurrentContent().hasText() ||
    haveOtherToolbar;

  if (invalidSelection && !needDisplay) {

    return;
  }

  if (invalidSelection) {
    dispatch(displayToolbar({ needDisplay: false }));

    return;
  }
  const getRange  = selection?.getRangeAt(0);
  const newSelectionRect = getRange?.getBoundingClientRect();

  dispatch(displayToolbar({ selectionRect: newSelectionRect, needDisplay: true }));
}
