import { DocsActionTypes } from './docs_actions';
import { EditorState } from 'draft-js';
import { Company, User } from 'helpers/type';
import { ProjectAccessMapOfUsers } from './get_folder_access';

interface DocsValue {
  needDisplay: boolean;
  selectionRect: DOMRect | undefined;
  actionOnCurrent?: string;
  editorState: EditorState;
  title: string;
  selectedDocProject: DocProject;
  docProjectsMap: DocProjectMap;
  loading: boolean;
  selectedPage?: PageContent;
  shouldCallApi: boolean;
  projectAccessOfUsers: ProjectAccessMapOfUsers;
  openShare: boolean;
  usersInCompanyMap: UsersInCompanyMap;
}

export interface UsersInCompanyMap {
  [userID: string]: User;
}

export interface CreatedBy {
  status?: string;
  lastAccessAt?: string;
  createdAt?: string;
  updatedAt?: string;
  _id?: string;
  email?: string;
  googleID?: string;
  firstName?: string;
  lastName?: string;
  profilePhoto?: string;
}

export interface PageContent {
  pageContent?: string;
  title?: string;
  _id?: string;
  entityMap?: string;
  createdBy?: CreatedBy;
}

export interface DocProjectMap {
  [projectID: string] : DocProject;
}

export interface DocProject {
  _id?: string;
  title?: string;
  createdBy?: CreatedBy | string;
  companyID?: Company;
  departmentID?: string;
  userIDs?: string[];
  documentPicture?: string;
  pages?: PageContent[];
}

const initialState: DocsValue = {
  needDisplay: false,
  selectionRect: undefined,
  editorState: null,
  title: '',
  selectedPage: {},
  selectedDocProject: {},
  docProjectsMap: {},
  loading: false,
  shouldCallApi: true,
  openShare: false,
  projectAccessOfUsers: {},
  usersInCompanyMap: {},
};

export type DocsValueType = DocsValue;

const docsReducer = (state = initialState, action) => {
  switch (action.type) {
    case DocsActionTypes.UpdateDocs:
      return {
        ...state,
        ...action.data,
      };
    default:
      return state;
  }
};

export default docsReducer;
