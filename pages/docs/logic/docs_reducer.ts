import { DocsActionTypes, UpdateSelectedItemInDrawerType } from './docs_actions';
import { EditorState, CompositeDecorator, convertFromRaw } from 'draft-js';
import { Company, User } from 'helpers/type';
import { ProjectAccessMapOfUsers } from './get_folder_access';
import { checkEmptyObject } from 'helpers/check_empty_object';
import { docsImageDecorator } from '../UI/decorator_image';
import { docsLinkDecorator } from '../UI/decorator_link';
import { checkOnlyTrueInArray } from 'helpers/check_only_true';
import { checkTrueInArray } from 'helpers/check_true_in_array';

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
  editTimestamp: number;
  lastUpdateEditTimestamp: number;
  autoSaving: boolean;
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

export interface PagesMap {
  [pageID: string]: PageContent;
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
  pages?: PagesMap;
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
  editTimestamp: 0,
  lastUpdateEditTimestamp: 0,
  openShare: false,
  projectAccessOfUsers: {},
  usersInCompanyMap: {},
  autoSaving: false,
};

export type DocsValueType = DocsValue;

function notChangeFocusOfEditorState(oldState, newState) {
  const oldSelection = oldState?.getSelection();
  const newSelection = newState?.getSelection();

  if (!oldSelection || !newSelection) {

    return false;
  }

  const oldBlockKey = oldSelection?.getAnchorKey();
  const newBlockKey = newSelection?.getAnchorKey();
  const oldFocus = oldSelection?.getHasFocus();
  const newFocus = newSelection?.getHasFocus();

  return oldBlockKey === newBlockKey && oldFocus === newFocus;
}

function updateSelectedItemInDrawer(data, state: DocsValue) {
  const { pageID, projectID, ...restData }: UpdateSelectedItemInDrawerType  = data;
  const decorator = new CompositeDecorator([
    docsLinkDecorator,
    docsImageDecorator,
  ]);
  const project = state?.docProjectsMap?.[projectID ?? ''];
  const page = project?.pages?.[pageID ?? ''];

  if (project) {
    state.selectedDocProject = project;
    state.editorState = EditorState.createEmpty(decorator);
    state.title = '';
    state.selectedPage = {};
  }

  if (page) {
    const convertedBlocks = JSON.parse(page?.pageContent ?? '[]');
    const convertedEntityMap = JSON.parse(page?.entityMap ?? '[]');
    const newContentState = convertFromRaw({ blocks: convertedBlocks, entityMap: convertedEntityMap });

    state.autoSaving = false;
    state.selectedPage = page;
    state.title = page.title ?? '';
    state.editorState = EditorState.createWithContent(
      newContentState,
      decorator,
    );
  }

  return {
    ...state,
    ...restData,
  };
}

const docsReducer = (state = initialState, action) => {
  switch (action.type) {
    case DocsActionTypes.UpdateDocs:
      const editContent = checkOnlyTrueInArray({
        conditionsArray: [
          !checkEmptyObject(action?.data?.editorState),
          notChangeFocusOfEditorState(state?.editorState, action?.data?.editorState),
        ],
      });
      const editTitle = !!action?.data?.title;
      if (checkTrueInArray({ conditionsArray: [editContent, editTitle] })) {
        const timestamp = new Date().getTime();

        state.editTimestamp = timestamp;
      }

      return {
        ...state,
        ...action.data,
      };
    case DocsActionTypes.UpdateDocsInDrawer:

      return {
        ...state,
        ...action.data,
      };

    case DocsActionTypes.UpdateSelectedItemInDrawer:

      return updateSelectedItemInDrawer(action.data, state);
    default:
      return state;
  }
};

export default docsReducer;
