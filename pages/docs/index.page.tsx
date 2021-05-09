import React from 'react';
import EditorView from './UI/editor_view';
import InlineToolbar from '../../components/inline_toolbar/inline_toolbar';
import { useDispatch, useSelector } from 'react-redux';
import { displayToolbar, updateSingleEditorState } from './logic/docs_actions';
import { RootState } from 'redux/reducers_registration';
import { DocsValueType } from './logic/docs_reducer';
import handleToolbarActions from './logic/docs_toolbar_actions';

const DocsPage = () => {
  const dispatch = useDispatch();
  const {
    needDisplay,
    currentEditorIndex,
    selectionRect,
    editorStates,
  }: DocsValueType = useSelector((state: RootState) => state?.docs);

  function showUpToolbar() {
    const selection = window.getSelection();
    const selectedText = selection?.toString();
    const invalidSelection = !selectedText?.length ||
      typeof selectedText !== 'string' ||
      selection?.type === 'Caret';

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

  function onClickOptionInToolbar(action) {
    if (!action) {
      return;
    }

    const editorState = editorStates[currentEditorIndex];

    dispatch(updateSingleEditorState({
      currentIndex: currentEditorIndex,
      editorState: handleToolbarActions(editorState, action),
    }));
  }

  return <div
    className='docs-page'
    onMouseUp={showUpToolbar}
  >
    <EditorView
      selectionRect={selectionRect}
      numbers={editorStates.length}
      currentIndex={currentEditorIndex}
    />
    <InlineToolbar
      onClickOption={onClickOptionInToolbar}
      needDisplay={needDisplay}
      selectionRect={selectionRect}
    />
  </div>;
};

export default DocsPage;
