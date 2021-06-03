import { RichUtils, EditorState } from 'draft-js';
import { updateDocs } from './docs_actions';

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

export function showUpToolbarAndUpdateState(newEditorState, needDisplay, dispatch) {
  const selection = window.getSelection();
  const selectedText = selection?.toString();
  const haveOtherToolbar =  !!document.getElementById('sideToolbar');
  const invalidSelection = !selectedText?.length ||
    typeof selectedText !== 'string' ||
    selection?.type === 'Caret' ||
    !newEditorState.getCurrentContent().hasText() ||
    haveOtherToolbar;

  if (invalidSelection && !needDisplay) {
    dispatch(updateDocs({ editorState: newEditorState }));

    return;
  }

  if (invalidSelection) {
    dispatch(updateDocs({ needDisplay: false, editorState: newEditorState }));

    return;
  }
  const getRange  = selection?.getRangeAt(0);
  const newSelectionRect = getRange?.getBoundingClientRect();

  dispatch(updateDocs({ selectionRect: newSelectionRect, needDisplay: true,  editorState: newEditorState }));
}
