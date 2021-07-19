import React from 'react'
import EditorView from './UI/editor_view'
import InlineToolbar from '../../components/inline_toolbar/inline_toolbar'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { updateDocs } from './logic/docs_actions'
import { RootState } from 'redux/reducers_registration'
import { handleToolbarActions } from './logic/docs_inline_toolbar_actions'
import { Input } from '@material-ui/core'
import PrimaryButtonUI from '@components/primary_button/primary_button'
import { createNewPage, savePage } from './logic/docs_apis'
import { handleKeyCombination } from './logic/handle_combination_key'
import { EditorState } from 'draft-js'
import { DocProject, PageContent } from './logic/docs_reducer'
import { DocsRole, ProjectAccessMapOfUsers } from './logic/get_folder_access'
import { checkTrueInArray } from 'helpers/check_true_in_array'
import { getItemSelectedRolesOfUser } from './logic/get_item_selected_roles_of_user'

interface DocsPageData {
  displayInlineToolbar: boolean
  selectionRect:  DOMRect | undefined
  editorState: EditorState
  title: string
  loading: boolean
  selectedPage: PageContent
  selectedProject: DocProject
  projectAccessOfUsers: ProjectAccessMapOfUsers
  accountUserID: string
}

type DocsPageDataType = DocsPageData

const DocsPage = () => {
  const dispatch = useDispatch()
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
    }
  }, shallowEqual)
  const onEditPage = !!selectedPage?._id || !!selectedPage?.title
  const readOnly = !checkHavePermissionToEdit()
  const cannotClickButton = checkTrueInArray({
    conditionsArray: [
      loading,
      !title?.length,
      !selectedProject._id,
      readOnly,
    ],
  })

  function onClickOptionInToolbar(action) {
    if (!action) {
      return
    }

    dispatch(updateDocs({
      editorState: handleToolbarActions(editorState, action),
    }))
  }

  function onChangeTitle(event) {
    if (typeof event?.target?.value !== 'string') {
      return
    }

    dispatch(updateDocs({ title: event.target.value }))
  }

  function handleClickHeadingButton() {
    if (onEditPage) {
      dispatch(savePage())

      return
    }

    dispatch(createNewPage())
  }

  function checkHavePermissionToEdit() {
    const selectedProjectID = selectedProject?._id ?? ''
    const selectedPageID = selectedPage?._id

    if (!selectedProjectID?.length && !selectedPageID?.length) {

      return true
    }

    const rolesOfUser = getItemSelectedRolesOfUser({
      selectedPageID,
      selectedProjectID,
      projectAccessOfUsers,
      userID: accountUserID,
    })

    return rolesOfUser.includes(DocsRole.WRITE)
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
    </div>
      <InlineToolbar
        editorState={editorState}
        onClickOption={onClickOptionInToolbar}
        displayInlineToolbar={displayInlineToolbar}
        selectionRect={selectionRect}
      />
  </div>
}

export default DocsPage
