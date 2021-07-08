import React, { FunctionComponent } from 'react';
import MyEditor from '@components/my_editor/my_editor';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { updateDocs } from '../logic/docs_actions';
import { RootState } from 'redux/reducers_registration';
import { SelectionState, EditorState, CompositeDecorator } from 'draft-js';
import { handleSideToolbarActions, onMoveBlockAction } from '../logic/docs_side_toolbar_actions';
import { showUpToolbarAndUpdateState } from '../logic/docs_inline_toolbar_actions';
import { docsLinkDecorator } from 'pages/docs/UI/decorator_link';
import { docsImageDecorator } from './decorator_image';

interface EditorViewData {
  needDisplay: boolean;
  editorState: EditorState;
}

type EditorViewDataType = EditorViewData;

interface EditorView {
  readOnly: boolean;
}

const EditorView: FunctionComponent<EditorView> = ({ readOnly }) => {
  const dispatch = useDispatch();
  const {
    editorState,
    needDisplay,
  }: EditorViewDataType = useSelector((state: RootState) => {

    return {
      editorState: state?.docs?.editorState,
      needDisplay: state?.docs?.needDisplay,
    };
  }, shallowEqual);

  function onClickSideToolbar(props) {
    const contentBlock = props?.contentBlock;
    if (!contentBlock || !editorState || readOnly) {
      return;
    }

    const blockKey = contentBlock.getKey();
    const newSelection = SelectionState.createEmpty(blockKey);
    const updatedSelection = newSelection.merge({
      focusKey: blockKey,
      focusOffset: contentBlock.getLength(),
      hasFocus: true,
    });

    dispatch(updateDocs({
      needDisplay: false,
      editorState: EditorState.forceSelection(editorState, updatedSelection),
    }));
  }

  function handleChangeEditorState(newEditorState) {
    showUpToolbarAndUpdateState(newEditorState, needDisplay, dispatch);
  }

  function onClickOptionInSideToolbar(action) {
    if (!action) {
      return;
    }

    dispatch(updateDocs({
      editorState: handleSideToolbarActions(editorState, action),
    }));
  }

  const decorator = new CompositeDecorator([
    docsLinkDecorator,
    docsImageDecorator,
  ]);

  return <MyEditor
    handleOnChangeLineStyle={onClickOptionInSideToolbar}
    onMoveBlockAction={(action) => onMoveBlockAction({
      action,
      dispatch,
      editorState,
    })}
    readOnly={readOnly}
    key='editor-view'
    handleChangeEditorState={handleChangeEditorState}
    editorState={editorState ?? EditorState.createEmpty(decorator)}
    onClickSideToolbar={onClickSideToolbar}
  />;
};

export default EditorView;
