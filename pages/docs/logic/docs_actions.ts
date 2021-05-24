import { EditorState } from 'draft-js';

export enum DocsActionTypes {
  DisplayToolbar = 'DisplayToolbar',
  OnFocusElement = 'OnFocusElement',
  UpdateSingleEditorState = 'UpdateSingleState',
  UpdateEditorView = 'UpdateEditorView',
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

export const updateEditorView = ({ numbers }) => {
  return {
    data: {
      editorNumbers: numbers,
    },
    type: DocsActionTypes.UpdateEditorView,
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
