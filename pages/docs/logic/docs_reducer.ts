import { DocsActionTypes } from './docs_actions';
import { EditorState } from 'draft-js';

interface DocsValue {
  needDisplay: boolean;
  selectionRect: DOMRect | undefined;
  actionOnCurrent?: string;
  editorKeys: string[];
  currentEditorKey?: string;
  editorState: EditorState;
}

const initialState: DocsValue = {
  needDisplay: false,
  selectionRect: undefined,
  editorKeys: [],
  editorState: null,
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
    case DocsActionTypes.UpdateEditorView:
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
