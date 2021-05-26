import { DocsActionTypes } from './docs_actions';
import { EditorState } from 'draft-js';
import { Company } from 'helpers/type';

interface DocsValue {
  needDisplay: boolean;
  selectionRect: DOMRect | undefined;
  actionOnCurrent?: string;
  editorKeys: string[];
  editorState: EditorState;
  title: string;
  selectedDocProject: DocProject;
  docProjects: DocProject[];
  loading: boolean;
  selectedPage?: PageContent;
  shouldCallApi: boolean;
  storeProjectsIndice: object;
}

interface CreatedBy {
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
}

export interface DocProject {
  _id?: string;
  title?: string;
  createdBy?: CreatedBy;
  companyID?: Company;
  departmentID?: string;
  userIDs?: string[];
  documentPicture?: string;
  pages?: PageContent[];
}

const initialState: DocsValue = {
  needDisplay: false,
  selectionRect: undefined,
  editorKeys: [],
  editorState: null,
  title: '',
  selectedPage: {},
  selectedDocProject: {},
  docProjects: [],
  loading: false,
  shouldCallApi: true,
  storeProjectsIndice: {},
};

export type DocsValueType = DocsValue;

const updateSingleEditorState = ({ needDisplay, state, editorState }) => {
  if (!state || !editorState) {
    return state;
  }

  if (typeof needDisplay === 'boolean') {
    state.needDisplay = needDisplay;
  }

  return {
    ...state,
    editorState,
  };
};

const docsReducer = (state = initialState, action) => {
  switch (action.type) {
    case DocsActionTypes.DisplayToolbar:
      return {
        ...state,
        ...action.data,
      };
    case DocsActionTypes.OnFocusElement:
      return {
        ...state,
        ...action.data,
      };
    case DocsActionTypes.UpdateDocs:
      return {
        ...state,
        ...action.data,
      };
    case DocsActionTypes.UpdateSingleEditorState:

      return updateSingleEditorState({
        state,
        ...action.data,
      });
    default:
      return {
        ...state,
      };
  }
};

export default docsReducer;
