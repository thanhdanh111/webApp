import { EditorState } from 'draft-js'
import { DocProject, PageContent, UsersInCompanyMap } from './docs_reducer'
import { ProjectAccessMapOfUsers } from './get_folder_access'

export enum DocsActionTypes {
  UpdateDocs = 'UpdateDocs',
  UpdateDocsInDrawer = 'UpdateDocsInDrawer',
  UpdateSelectedItemInDrawer = 'updateSelectedItemInDrawer',
}

interface UpdateDocs {
  docProjectsMap?: object
  loading?: boolean
  selectedDocProject?: DocProject
  selectedPage?: PageContent
  title?: string
  editorState?: EditorState
  lastUpdateEditTimestamp?: number
  editTimestamp?: number
  shouldAutoSave?: boolean
  displayInlineToolbar?: boolean
  selectionRect?: DOMRect
  displayShare?: boolean
  projectAccessOfUsers?: ProjectAccessMapOfUsers
  usersInCompanyMap?: UsersInCompanyMap
}

export const updateDocs = (data: UpdateDocs) => {
  return {
    data,
    type: DocsActionTypes.UpdateDocs,
  }
}

export const updateDocsInDrawer = (data: UpdateDocs) => {
  return {
    data,
    type: DocsActionTypes.UpdateDocsInDrawer,
  }
}

interface UpdateSelectedItemInDrawer extends UpdateDocs {
  pageID?: string
  projectID?: string
}

export type UpdateSelectedItemInDrawerType = UpdateSelectedItemInDrawer

export const updateSelectedItemInDrawer = (data: UpdateSelectedItemInDrawer) => {
  return {
    data,
    type: DocsActionTypes.UpdateSelectedItemInDrawer,
  }
}
