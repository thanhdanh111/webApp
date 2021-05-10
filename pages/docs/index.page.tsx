import React from 'react';
import EditorView from './UI/editor_view';
import InlineToolbar from '../../components/inline_toolbar/inline_toolbar';
import { useDispatch, useSelector } from 'react-redux';
import { updateSingleEditorState } from './logic/docs_actions';
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

  return <div className='docs-page' >
    <EditorView
      selectionRect={selectionRect}
      numbers={editorStates.length}
      currentIndex={currentEditorIndex}
    />
    <InlineToolbar
      editorState={editorStates[currentEditorIndex]}
      onClickOption={onClickOptionInToolbar}
      needDisplay={needDisplay}
      selectionRect={selectionRect}
    />
  </div>;
};

export default DocsPage;
