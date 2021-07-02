import { EditorState } from 'draft-js';
import { DocProject, PageContent, UsersInCompanyMap } from './docs_reducer';
import { ProjectAccessMapOfUsers } from './get_folder_access';

export enum DocsActionTypes {
  UpdateDocs = 'UpdateDocs',
}

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
  projectAccessOfUsers?: ProjectAccessMapOfUsers;
  usersInCompanyMap?: UsersInCompanyMap;
}

export const updateDocs = (data: UpdateDocs) => {
  return {
    data,
    type: DocsActionTypes.UpdateDocs,
  };
};
