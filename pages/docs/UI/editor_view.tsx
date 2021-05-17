import React, { FunctionComponent } from 'react';
import MyEditor from '@components/my_editor/my_editor';
import { useDispatch, useSelector } from 'react-redux';
import { displayToolbar, updateSingleEditorState } from '../logic/docs_actions';
import { DocsValueType } from '../logic/docs_reducer';
import { RootState } from 'redux/reducers_registration';
import { SelectionState, EditorState } from 'draft-js';
import handleSideToolbarActions from '../logic/docs_side_toolbar_actions';

interface EditorView {
  numbers: number;
  currentIndex?: number;
  selectionRect?: DOMRect;
  handleOnChangeStyleLine?: (action, contentState) => void;
}

const EditorView: FunctionComponent<EditorView> = () => {
  const dispatch = useDispatch();
  const { editorStates, currentEditorIndex, needDisplay }: DocsValueType = useSelector((state: RootState) => state?.docs);

  function showUpToolbar(newEditorState) {
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

    if (invalidSelection || haveOtherToolbar) {
      dispatch(displayToolbar({ needDisplay: false }));

      return;
    }
    const getRange  = selection?.getRangeAt(0);
    const newSelectionRect = getRange?.getBoundingClientRect();

    dispatch(displayToolbar({ selectionRect: newSelectionRect, needDisplay: true }));
  }

  function onClickSideToolbar(contentBlock) {
    if (!contentBlock) {
      return;
    }

    const editorState = editorStates[0];
    const blockKey = contentBlock.getKey();
    const newSelection = SelectionState.createEmpty(blockKey);
    const updatedSelection = newSelection.merge({
      focusKey: blockKey,
      focusOffset: contentBlock.getLength(),
      hasFocus: true,
    });

    dispatch(updateSingleEditorState({
      currentIndex: currentEditorIndex,
      needDisplay: false,
      editorState: EditorState.forceSelection(editorState, updatedSelection),
    }));
  }

  function handleChangeEditorState(newEditorState, index) {
    showUpToolbar(newEditorState);

    dispatch(updateSingleEditorState({
      editorState: newEditorState,
      currentIndex: index,
    }));
  }

  function onClickOptionInSideToolbar(action) {
    if (!action) {
      return;
    }
    const editorState = editorStates[currentEditorIndex];

    dispatch(updateSingleEditorState({
      currentIndex: currentEditorIndex,
      editorState: handleSideToolbarActions(editorState, action),
    }));
  }

  return <>
    {editorStates.map((editorState, editorIndex) => {

      return <MyEditor
        handleOnChangeStyleLine={onClickOptionInSideToolbar}
        key={`editor-${editorIndex}`}
        index={editorIndex}
        handleChangeEditorState={handleChangeEditorState}
        editorState={editorState ?? EditorState.createEmpty()}
        currentIndex={currentEditorIndex}
        onClickSideToolbar={onClickSideToolbar}
      />;
    })}
  </>;
};

function areEqual(prevProps, nextProps) {
  const equalNumbers = prevProps.numbers !== nextProps.numbers;

  return !equalNumbers;
}

export default React.memo(EditorView, areEqual);
