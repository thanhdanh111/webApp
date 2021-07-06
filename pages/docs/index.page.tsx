import React, { useMemo } from 'react';
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
import { EditorState } from 'draft-js';
import { DocProject, PageContent, UsersInCompanyMap } from './logic/docs_reducer';
import { SharePermission } from '../../components/share_permission/share_permission';
import { DocsRole, ProjectAccessMapOfUsers } from './logic/get_folder_access';
import { checkTrueInArray } from 'helpers/check_true_in_array';

interface DocsPageData {
  needDisplay: boolean;
  selectionRect:  DOMRect | undefined;
  editorState: EditorState;
  title: string;
  loading: boolean;
  selectedPage: PageContent;
  selectedProject: DocProject;
  projectAccessOfUsers: ProjectAccessMapOfUsers;
  accountUserID: string;
  openShare: boolean;
  usersInCompanyMap: UsersInCompanyMap;
  autoSaving: boolean;
  editTimestamp: number;
  lastUpdateEditTimestamp: number;

}

type DocsPageDataType = DocsPageData;

const docsAutoSaveTimeOut = 10000;

const DocsPage = () => {
  const dispatch = useDispatch();
  const {
    needDisplay,
    selectionRect,
    editorState,
    title,
    loading,
    selectedPage,
    selectedProject,
    projectAccessOfUsers,
    accountUserID,
    openShare,
    usersInCompanyMap,
    editTimestamp,
    autoSaving,
    lastUpdateEditTimestamp,
  }: DocsPageDataType = useSelector((state: RootState) => {

    return {
      needDisplay: state?.docs?.needDisplay,
      selectionRect: state?.docs?.selectionRect,
      editorState: state?.docs?.editorState,
      title: state?.docs?.title,
      loading: state?.docs?.loading,
      selectedPage: state?.docs?.selectedPage,
      selectedProject: state?.docs?.selectedDocProject,
      accountUserID: state?.userInfo?.userID,
      projectAccessOfUsers: state?.docs?.projectAccessOfUsers,
      openShare: state?.docs?.openShare,
      usersInCompanyMap: state?.docs?.usersInCompanyMap,
      editTimestamp: state?.docs?.editTimestamp,
      autoSaving: state?.docs?.autoSaving,
      lastUpdateEditTimestamp:  state?.docs?.lastUpdateEditTimestamp,
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

  useMemo(() => {
    const shouldNotSave = checkTrueInArray({
      conditionsArray: [
        readOnly,
        !onEditPage,
        editTimestamp === lastUpdateEditTimestamp,
        autoSaving,
      ],
    });

    if (shouldNotSave) {

      return;
    }

    dispatch(updateDocs({ autoSaving: true }));

    const docProjectID = selectedProject?._id;
    const selectedPageID = selectedPage?._id;

    setTimeout((timestamp, state, projectID, pageID) => {
      dispatch(autoSavePage({ timestamp, projectID, editorState: state, selectedPageID: pageID }));
    }, docsAutoSaveTimeOut, editTimestamp, editorState, docProjectID, selectedPageID);

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

    const rolesInProject = projectAccessOfUsers?.[accountUserID]?.[selectedProjectID]?.roles ?? [];
    let haveWritePermission = rolesInProject.includes(DocsRole.WRITE);

    if (selectedPageID && !haveWritePermission) {
      haveWritePermission = projectAccessOfUsers?.
                                [accountUserID]?.
                                [selectedProjectID]?.
                                accessInPages?.
                                [selectedPageID]?.
                                includes(DocsRole.WRITE);
    }

    return haveWritePermission;
  }

  function onClickShare(role, userID) {
    if (!role?.length || !userID?.length) {
      return;
    }

    dispatch(shareDocument({ role, userID }));
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
    <EditorView readOnly={readOnly} />
    <InlineToolbar
      editorState={editorState}
      onClickOption={onClickOptionInToolbar}
      needDisplay={needDisplay}
      selectionRect={selectionRect}
    />
    <SharePermission
      selectedProject={selectedProject}
      openShare={openShare}
      usersInCompanyMap={usersInCompanyMap}
      loading={loading}
      projectAccessOfUsers={projectAccessOfUsers}
      accountUserID={accountUserID}
      selectedPage={selectedPage}
      handleShare={onClickShare}
    />
  </div>;
};

export default DocsPage;
