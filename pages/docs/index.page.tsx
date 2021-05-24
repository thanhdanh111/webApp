import React from 'react';
import EditorView from './UI/editor_view';
import InlineToolbar from '../../components/inline_toolbar/inline_toolbar';
import { useDispatch, useSelector } from 'react-redux';
import { updateDocs, updateSingleEditorState } from './logic/docs_actions';
import { RootState } from 'redux/reducers_registration';
import { DocsValueType } from './logic/docs_reducer';
import { handleToolbarActions } from './logic/docs_inline_toolbar_actions';
import { Input } from '@material-ui/core';
import PrimaryButtonUI from '@components/primary_button/primary_button';
import { saveDocument } from './logic/docs_apis';

const DocsPage = () => {
  const dispatch = useDispatch();
  const {
    needDisplay,
    selectionRect,
    editorState,
    title,
    loading,
  }: DocsValueType = useSelector((state: RootState) => state?.docs);

  function onClickOptionInToolbar(action) {
    if (!action) {
      return;
    }

    dispatch(updateSingleEditorState({
      editorState: handleToolbarActions(editorState, action),
    }));
  }

  function onChangeTitle(event) {
    if (!event?.target?.value) {
      return;
    }

    dispatch(updateDocs({ data: { title: event.target.value } }));
  }

  function handleSave() {
    dispatch(saveDocument());
  }

  return <div className='docs-page' >
    <PrimaryButtonUI disabled={loading} title='Save' handleClick={handleSave}/>
    <Input
      defaultValue={title}
      className='docs-page--title'
      disableUnderline
      autoFocus
      onChange={(event) => onChangeTitle(event)}
      placeholder='UNTITLED'
      multiline={false}
      required={true}
    />
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
