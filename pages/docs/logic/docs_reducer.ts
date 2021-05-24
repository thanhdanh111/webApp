import { DocsActionTypes } from './docs_actions';
import { EditorState } from 'draft-js';

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

interface DocProject {
  _id?: string;
  title?: string;
  createdBy?: CreatedBy;
  companyID?: string;
  departmentID?: string;
  userIDs?: string[];
  documentPicture?: string;
}

const initialState: DocsValue = {
  needDisplay: false,
  selectionRect: undefined,
  editorKeys: [],
  editorState: null,
  title: '',
  selectedDocProject: {},
  docProjects: [],
  loading: false,
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
