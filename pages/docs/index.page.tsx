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
import { createNewPage, deleteDocProject, deletePage, savePage } from './logic/docs_apis';
import { handleKeyCombination } from './logic/handle_combination_key';

const DocsPage = () => {
  const dispatch = useDispatch();
  const {
    needDisplay,
    selectionRect,
    editorState,
    title,
    loading,
    selectedPage,
    selectedDocProject,
  }: DocsValueType = useSelector((state: RootState) => state?.docs);
  const onEditPage = selectedPage?._id || selectedPage?.title;
  const cannotClickButton = loading || !title?.length;
  const cannotDelete = loading || !selectedDocProject._id || (!selectedPage?._id && !selectedDocProject._id);

  function onClickOptionInToolbar(action) {
    if (!action) {
      return;
    }

    dispatch(updateSingleEditorState({
      editorState: handleToolbarActions(editorState, action),
    }));
  }

  function onChangeTitle(event) {
    if (typeof event?.target?.value !== 'string') {
      return;
    }

    dispatch(updateDocs({ title: event.target.value }));
  }

  function handleClickHeadingButton() {
    if (onEditPage) {
      dispatch(savePage());

      return;
    }

    dispatch(createNewPage());
  }

  function handleDeleteButton() {
    if (onEditPage) {
      dispatch(deletePage());

      return;
    }

    dispatch(deleteDocProject());
  }

  return <div
    className='docs-page'
    onKeyDown={(e) => handleKeyCombination(e, onEditPage, dispatch)}
  >
    <div className='docs-action-bar'>
      <PrimaryButtonUI
        disabled={cannotClickButton}
        title={onEditPage ? 'Save' : 'Create'}
        handleClick={handleClickHeadingButton}
      />
      <PrimaryButtonUI
        title='Delete'
        disabled={cannotDelete}
        extendClass='primary-red-btn'
        handleClick={handleDeleteButton}
      />
    </div>
    <Input
      style={{ marginTop: '20px', paddingLeft: '45px', marginBottom: '20px' }}
      value={title}
      className='docs-page--title'
      disableUnderline
      onChange={(event) => onChangeTitle(event)}
      placeholder='UNTITLED'
      multiline={false}
      autoFocus
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
