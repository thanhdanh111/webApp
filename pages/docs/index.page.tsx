import React from 'react';
import EditorView from './UI/editor_view';
import InlineToolbar from '../../components/inline_toolbar/inline_toolbar';
import { useDispatch, useSelector } from 'react-redux';
import { updateSingleEditorState } from './logic/docs_actions';
import { RootState } from 'redux/reducers_registration';
import { DocsValueType } from './logic/docs_reducer';
import { handleToolbarActions } from './logic/docs_inline_toolbar_actions';

const DocsPage = () => {
  const dispatch = useDispatch();
  const {
    needDisplay,
    selectionRect,
    editorState,
  }: DocsValueType = useSelector((state: RootState) => state?.docs);

  function onClickOptionInToolbar(action) {
    if (!action) {
      return;
    }

    dispatch(updateSingleEditorState({
      editorState: handleToolbarActions(editorState, action),
    }));
  }

  return <div className='docs-page' >
    <EditorView
      selectionRect={selectionRect}
    />
    <InlineToolbar
      editorState={editorState}
      onClickOption={onClickOptionInToolbar}
      needDisplay={needDisplay}
      selectionRect={selectionRect}
    />
  </div>;
};

export default DocsPage;
