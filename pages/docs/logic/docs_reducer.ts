import { DocsActionTypes } from './docs_actions';
import { EditorState } from 'draft-js';

interface DocsValue {
  needDisplay: boolean;
  selectionRect: DOMRect | undefined;
  currentEditorIndex: number;
  actionOnCurrent?: string;
  editorKeys: string[];
  currentEditorKey?: string;
  editorStates: EditorState[];
}

const initialState: DocsValue = {
  needDisplay: false,
  selectionRect: undefined,
  currentEditorIndex: -1,
  editorKeys: [],
  editorStates: [
    null,
  ],
};

export type DocsValueType = DocsValue;

const updateSingleEditorState = ({ needDisplay, currentEditorIndex, state, editorState }) => {
  if (typeof currentEditorIndex !== 'number' || !state || !editorState) {
    return state;
  }

  if (typeof needDisplay === 'boolean') {
    state.needDisplay = needDisplay;
  }

  const editorStates = state.editorStates;

  editorStates[currentEditorIndex] = editorState;

  return {
    ...state,
    editorStates,
    currentEditorIndex,
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
