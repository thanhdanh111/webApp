import React, { useEffect } from 'react';
import EditorView from './UI/editor_view';
import InlineToolbar from '../../components/inline_toolbar/inline_toolbar';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { updateDocs } from './logic/docs_actions';
import { RootState } from 'redux/reducers_registration';
import { handleToolbarActions } from './logic/docs_inline_toolbar_actions';
import { Input } from '@material-ui/core';
import PrimaryButtonUI from '@components/primary_button/primary_button';
import { autoSavePage, createNewPage, savePage, shareDocument } from './logic/docs_apis';
import { handleKeyCombination } from './logic/handle_combination_key';
import { EditorState, convertToRaw } from 'draft-js';
import { DocProject, DocProjectMap, PageContent, UsersInCompanyMap } from './logic/docs_reducer';
import { SharePermission } from '../../components/share_permission/share_permission';
import { DocsRole, ProjectAccessMapOfUsers } from './logic/get_folder_access';
import { checkTrueInArray } from 'helpers/check_true_in_array';
import { getItemSelectedRolesOfUser } from './logic/get_item_selected_roles_of_user';

interface DocsPageData {
  displayInlineToolbar: boolean;
  selectionRect:  DOMRect | undefined;
  editorState: EditorState;
  title: string;
  loading: boolean;
  selectedPage: PageContent;
  selectedProject: DocProject;
  projectAccessOfUsers: ProjectAccessMapOfUsers;
  accountUserID: string;
  displayShare: boolean;
  usersInCompanyMap: UsersInCompanyMap;
  shouldAutoSave: boolean;
  editTimestamp: number;
  lastUpdateEditTimestamp: number;
  docProjectsMap: DocProjectMap;
}

type DocsPageDataType = DocsPageData;

const docsAutoSaveTimeOut = 10000;

const DocsPage = () => {
  const dispatch = useDispatch();
  const {
    displayInlineToolbar,
    selectionRect,
    editorState,
    title,
    loading,
    selectedPage,
    selectedProject,
    projectAccessOfUsers,
    accountUserID,
    displayShare,
    usersInCompanyMap,
    editTimestamp,
    shouldAutoSave,
    lastUpdateEditTimestamp,
    docProjectsMap,
  }: DocsPageDataType = useSelector((state: RootState) => {

    return {
      displayInlineToolbar: state?.docs?.displayInlineToolbar,
      selectionRect: state?.docs?.selectionRect,
      editorState: state?.docs?.editorState,
      title: state?.docs?.title,
      loading: state?.docs?.loading,
      selectedPage: state?.docs?.selectedPage,
      selectedProject: state?.docs?.selectedDocProject,
      accountUserID: state?.userInfo?.userID,
      projectAccessOfUsers: state?.docs?.projectAccessOfUsers,
      displayShare: state?.docs?.displayShare,
      usersInCompanyMap: state?.docs?.usersInCompanyMap,
      editTimestamp: state?.docs?.editTimestamp,
      shouldAutoSave: state?.docs?.shouldAutoSave,
      lastUpdateEditTimestamp:  state?.docs?.lastUpdateEditTimestamp,
      docProjectsMap: state?.docs?.docProjectsMap,
    };
  }, shallowEqual);
  const onEditPage = !!selectedPage?._id || !!selectedPage?.title;
  const readOnly = !checkHavePermissionToEdit();
  const cannotClickButton = checkTrueInArray({
    conditionsArray: [
      loading,
      !title?.length,
      !selectedProject._id,
      readOnly,
    ],
  });

  const unload = (event) => {
    if (editTimestamp !== lastUpdateEditTimestamp){

      return event.returnValue = 'Wait a second to save your changes';
    }

    return;
  };

  useEffect(() => {
    window.addEventListener('beforeunload', unload);

    return () => {
      window.removeEventListener('beforeunload', unload);
    };
  }, [editTimestamp, lastUpdateEditTimestamp]);

  useEffect(() => {
    const docProjectID = selectedProject?._id ?? '';
    const selectedPageID = selectedPage?._id ?? '';

    const shouldNotSave = checkTrueInArray({
      conditionsArray: [
        readOnly,
        !docProjectID,
        !onEditPage,
        editTimestamp === lastUpdateEditTimestamp,
      ],
    });

    if (shouldNotSave) {

      return;
    }

    const newProjectsMap  = docProjectsMap;
    const rawBlocks = convertToRaw(editorState?.getCurrentContent());
    const pagesInProject = newProjectsMap[docProjectID]?.pages;

    if (!pagesInProject) {

      return;
    }

    pagesInProject[selectedPageID] = {
      title,
      content: rawBlocks?.blocks,
      _id: selectedPageID,
      entityMap: rawBlocks?.entityMap,
      createdBy: selectedPage?.createdBy,
    };

    dispatch(updateDocs({ docProjectsMap: newProjectsMap }));

    if (!shouldAutoSave) {

      return;
    }

    dispatch(updateDocs({ shouldAutoSave: false }));

    setTimeout((timestamp, projectID, pageID) => {
      dispatch(autoSavePage({ timestamp, projectID, selectedPageID: pageID }));
    }, docsAutoSaveTimeOut, editTimestamp, docProjectID, selectedPageID);

  }, [editTimestamp, lastUpdateEditTimestamp]);

  function onClickOptionInToolbar(action) {
    if (!action) {
      return;
    }

    dispatch(updateDocs({
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

  function checkHavePermissionToEdit() {
    const selectedProjectID = selectedProject?._id ?? '';
    const selectedPageID = selectedPage?._id;

    if (!selectedProjectID?.length && !selectedPageID?.length) {

      return true;
    }

    const rolesOfUser = getItemSelectedRolesOfUser({
      selectedPageID,
      selectedProjectID,
      projectAccessOfUsers,
      userID: accountUserID,
    });

    return rolesOfUser.includes(DocsRole.WRITE);
  }

  function onClickShare(role, userID) {
    if (!role?.length || !userID?.length) {
      return;
    }

    dispatch(shareDocument({ role, userID }));
  }

  function onClickRemoveShare({ role, userID }) {
    if (!role?.length || !userID?.length) {

      return;
    }

    return;
  }

  return <div className='docs-layout'>
    <div
      className='docs-page'
      onKeyDown={(e) => handleKeyCombination(e, onEditPage, dispatch)}
    >
      <div className='docs-action-bar'>
        <PrimaryButtonUI
          disabled={cannotClickButton}
          title={onEditPage ? 'Save' : 'Create'}
          handleClick={handleClickHeadingButton}
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
        disabled={readOnly}
      />
      <EditorView
        readOnly={readOnly}
        editorState={editorState}
        displayInlineToolbar={displayInlineToolbar}
      />
      <SharePermission
        selectedProject={selectedProject}
        displayShare={displayShare}
        usersInCompanyMap={usersInCompanyMap}
        loading={loading}
        projectAccessOfUsers={projectAccessOfUsers}
        accountUserID={accountUserID}
        selectedPage={selectedPage}
        handleShare={onClickShare}
        handleRemoveRole={onClickRemoveShare}
      />
    </div>
      <InlineToolbar
        editorState={editorState}
        onClickOption={onClickOptionInToolbar}
        displayInlineToolbar={displayInlineToolbar}
        selectionRect={selectionRect}
      />
  </div>;
};

export default DocsPage;
