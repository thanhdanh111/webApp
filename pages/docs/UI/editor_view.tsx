import React, { FunctionComponent } from 'react';
import MyEditor from '@components/my_editor/my_editor';
import { useDispatch, useSelector } from 'react-redux';
import { updateSingleEditorState } from '../logic/docs_actions';
import { DocsValueType } from '../logic/docs_reducer';
import { RootState } from 'redux/reducers_registration';
import { EditorState } from 'draft-js';

interface EditorView {
  numbers: number;
  currentIndex?: number;
  selectionRect?: DOMRect;
  action?: string;
}

const EditorView: FunctionComponent<EditorView> = ({ action }) => {
  const dispatch = useDispatch();
  const { editorStates, currentEditorIndex }: DocsValueType = useSelector((state: RootState) => state?.docs);

  function handleChangeEditorState(newEditorState, index) {

    dispatch(updateSingleEditorState({
      editorState: newEditorState,
      currentIndex: index,
    }));
  }

  return <>
    {editorStates.map((editorState, editorIndex) => {

      return <MyEditor
        action={action}
        key={`editor-${editorIndex}`}
        index={editorIndex}
        handleChangeEditorState={handleChangeEditorState}
        editorState={editorState ?? EditorState.createEmpty()}
        currentIndex={currentEditorIndex}
      />;
    })}
  </>;
};

function areEqual(prevProps, nextProps) {
  const equalNumbers = prevProps.numbers !== nextProps.numbers;

  return !equalNumbers;
}

export default React.memo(EditorView, areEqual);
