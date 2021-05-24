import React, { FunctionComponent } from 'react';
import MyEditor from '@components/my_editor/my_editor';
import { useDispatch, useSelector } from 'react-redux';
import { updateSingleEditorState } from '../logic/docs_actions';
import { DocsValueType } from '../logic/docs_reducer';
import { RootState } from 'redux/reducers_registration';
import { SelectionState, EditorState } from 'draft-js';
import { handleSideToolbarActions, onMoveBlockAction } from '../logic/docs_side_toolbar_actions';
import { showUpToolbar } from '../logic/docs_inline_toolbar_actions';

interface EditorView {
  numbers: number;
  currentIndex?: number;
  selectionRect?: DOMRect;
  handleOnChangeStyleLine?: (action, contentState) => void;
}

const EditorView: FunctionComponent<EditorView> = () => {
  const dispatch = useDispatch();
  const { editorStates, currentEditorIndex, needDisplay }: DocsValueType = useSelector((state: RootState) => state?.docs);

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
    showUpToolbar(newEditorState, needDisplay, dispatch);

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
        onMoveBlockAction={(action) => onMoveBlockAction({
          action,
          dispatch,
          currentEditorIndex,
          editorState: editorState[currentEditorIndex],
        })}
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
