import { DocsActionTypes, UpdateSelectedItemInDrawerType } from './docs_actions'
import { EditorState, CompositeDecorator, convertFromRaw } from 'draft-js'
import { Company, User } from 'helpers/type'
import { docsImageDecorator } from '../UI/decorator_image'
import { docsLinkDecorator } from '../UI/decorator_link'
import { ProjectAccessMapOfUsers } from './get_folder_access'

interface DocsValue {
  displayInlineToolbar: boolean
  selectionRect: DOMRect | undefined
  editorState: EditorState
  title: string
  selectedDocProject: DocProject
  docProjectsMap: DocProjectMap
  loading: boolean
  selectedPage?: PageContent
  projectAccessOfUsers: ProjectAccessMapOfUsers
  usersInCompanyMap: UsersInCompanyMap
  drawerLoading: boolean
}

export interface UsersInCompanyMap {
  [userID: string]: User
}

export interface CreatedBy {
  status?: string
  lastAccessAt?: string
  createdAt?: string
  updatedAt?: string
  _id?: string
  email?: string
  googleID?: string
  firstName?: string
  lastName?: string
  profilePhoto?: string
}

export interface PageContent {
  content?: Content[]
  title?: string
  _id?: string
  entityMap?: EntityMap
  createdBy?: CreatedBy
}

interface Content {
  contentData?: ContentData
  depth?: number
  entityRanges?: InlineStylesRanges
  inlineStyleRanges?: InlineStylesRanges
  key: string
  text: string
  type: string
}

interface ContentData {
  textAlignment: string
  renderMediaSize: string
  inlineStyleRanges: InlineStylesRanges[]
}

interface InlineStylesRanges {
  offset: number
  length: number
  style: string
}

interface EntityMap {
  [index: string]: Entity
}

interface Entity {
  type: string
  mutability: string
  data: {
    href: string;
    url: string;
  }
}

export interface PagesMap {
  [pageID: string]: PageContent
}

export interface DocProjectMap {
  [projectID: string] : DocProject
}

export interface DocProject {
  _id?: string
  title?: string
  createdBy?: CreatedBy | string
  companyID?: Company
  departmentID?: string
  userIDs?: string[]
  documentPicture?: string
  pages?: PagesMap
}

const initialState: DocsValue = {
  displayInlineToolbar: false,
  selectionRect: undefined,
  editorState: null,
  title: '',
  selectedPage: {},
  selectedDocProject: {},
  docProjectsMap: {},
  loading: false,
  projectAccessOfUsers: {},
  usersInCompanyMap: {},
  drawerLoading: false,
}

export type DocsValueType = DocsValue

function updateSelectedItemInDrawer(data, state: DocsValue) {
  const { pageID, projectID, ...restData }: UpdateSelectedItemInDrawerType  = data
  const decorator = new CompositeDecorator([
    docsLinkDecorator,
    docsImageDecorator,
  ])
  const project = state?.docProjectsMap?.[projectID ?? '']
  const page = project?.pages?.[pageID ?? '']

  if (project) {
    state.selectedDocProject = project
    state.editorState = EditorState.createEmpty(decorator)
    state.title = ''
    state.selectedPage = {}
  }

  if (page) {
    const newContentState = convertFromRaw({ blocks: page?.content, entityMap: page?.entityMap })

    state.selectedPage = page
    state.title = page.title ?? ''
    state.editorState = EditorState.createWithContent(
      newContentState,
      decorator,
    )
  }

  return {
    ...state,
    ...restData,
  }
}

const docsReducer = (state = initialState, action) => {
  switch (action.type) {
    case DocsActionTypes.UpdateDocs:

      return {
        ...state,
        ...action.data,
      }
    case DocsActionTypes.UpdateSelectedItemInDrawer:

      return updateSelectedItemInDrawer(action.data, state)
    default:
      return state
  }
}

export default docsReducer
