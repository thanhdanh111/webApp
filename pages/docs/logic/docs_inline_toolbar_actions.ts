import { blockStyles, inlineStyles } from 'constants/toolbar_docs';
import { RichUtils, EditorState, Modifier } from 'draft-js';
import { checkOnlyTrueInArray } from 'helpers/check_only_true';
import { updateDocs } from './docs_actions';

export function handleToolbarActions(editorState, action) {
  if (!editorState) {
    return;
  }

  const oldSelection = editorState.getSelection();
  let newEditorState;

  if (blockStyles.includes(action ?? '')) {
    newEditorState = RichUtils.toggleBlockType(
      editorState,
      action,
    );
  }

  if (inlineStyles.includes(action ?? '')) {
    newEditorState = RichUtils.toggleInlineStyle(
      editorState,
      action,
    );
  }

  if (action === 'unstyled') {
    const newContentState = inlineStyles.reduce((contentState, style) => {
      return Modifier.removeInlineStyle(contentState, editorState.getSelection(), style);
    }, newEditorState.getCurrentContent());
    newEditorState = EditorState.push(newEditorState, newContentState);
  }

  return EditorState.acceptSelection(
    newEditorState,
    oldSelection.merge({ hasFocus: false }),
  );
}

export function showUpToolbarAndUpdateState(newEditorState, dispatch) {
  const selection = window.getSelection();
  const selectedText = selection?.toString();
  const haveOtherToolbar =  !!document.getElementById('sideToolbar');
  const validSelection = checkOnlyTrueInArray({
    conditionsArray: [
      selectedText?.length,
      typeof selectedText === 'string',
      selection?.type !== 'Caret',
      newEditorState?.getCurrentContent()?.hasText(),
      !haveOtherToolbar,
    ],
  });

  if (!validSelection) {
    dispatch(updateDocs({ editorState: newEditorState, displayInlineToolbar: false }));

    return;
  }

  const getRange  = selection?.getRangeAt(0);
  const newSelectionRect = getRange?.getBoundingClientRect();
  const selectionState = newEditorState?.getSelection();

  dispatch(updateDocs({
    selectionRect: newSelectionRect,
    displayInlineToolbar: true,
    editorState: EditorState.acceptSelection(
      newEditorState,
      selectionState,
    ),
  }));
}
