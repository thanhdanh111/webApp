import { EditorState } from 'draft-js';
import { DocProject, PageContent, UsersInCompanyMap } from './docs_reducer';
import { ProjectAccessMapOfUsers } from './get_folder_access';

export enum DocsActionTypes {
  DisplayToolbar = 'DisplayToolbar',
  OnFocusElement = 'OnFocusElement',
  UpdateSingleEditorState = 'UpdateSingleState',
  UpdateDocs = 'UpdateDocs',
}

interface DisplayToolbar {
  needDisplay: boolean;
  selectionRect?: DOMRect;
}

export const displayToolbar = ({ needDisplay, selectionRect }: DisplayToolbar) => {
  return {
    data: {
      needDisplay,
      selectionRect,
    },
    type: DocsActionTypes.DisplayToolbar,
  };
};

interface UpdateOnFocusing {
  currentIndex?: number;
}

export const updateOnFocusing = ({ currentIndex }: UpdateOnFocusing) => {
  return {
    data: {
      currentEditorIndex: currentIndex,
    },
    type: DocsActionTypes.OnFocusElement,
  };
};

interface UpdateDocs {
  docProjectsMap?: object;
  loading?: boolean;
  selectedDocProject?: DocProject;
  selectedPage?: PageContent;
  title?: string;
  editorState?: EditorState;
  shouldCallApi?: boolean;
  needDisplay?: boolean;
  selectionRect?: DOMRect;
  openShare?: boolean;
  selectedProjectAccess?: ProjectAccessMapOfUsers;
  usersInCompanyMap?: UsersInCompanyMap;
}

export const updateDocs = (data: UpdateDocs) => {
  return {
    data,
    type: DocsActionTypes.UpdateDocs,
  };
};

interface UpdateSingleEditorState {
  needDisplay?: boolean;
  editorState: EditorState;
}

export const updateSingleEditorState = ({ needDisplay, editorState }: UpdateSingleEditorState) => {
  return {
    data: {
      editorState,
      needDisplay,
    },
    type: DocsActionTypes.UpdateSingleEditorState,
  };
};
