import React, { FunctionComponent } from 'react';
import MyEditor from '@components/my_editor/my_editor';
import { useDispatch, useSelector } from 'react-redux';
import { updateSingleEditorState } from '../logic/docs_actions';
import { DocsValueType } from '../logic/docs_reducer';
import { RootState } from 'redux/reducers_registration';
import { SelectionState, EditorState, CompositeDecorator } from 'draft-js';
import { handleSideToolbarActions, onMoveBlockAction } from '../logic/docs_side_toolbar_actions';
import { showUpToolbarAndUpdateState } from '../logic/docs_inline_toolbar_actions';
import { docsLinkDecorator } from 'pages/docs/UI/link_decorator';

const EditorView: FunctionComponent = () => {
  const dispatch = useDispatch();
  const { editorState, needDisplay }: DocsValueType = useSelector((state: RootState) => state?.docs);

  function onClickSideToolbar(props) {
    const contentBlock = props?.contentBlock;
    if (!contentBlock) {
      return;
    }

    const blockKey = contentBlock.getKey();
    const newSelection = SelectionState.createEmpty(blockKey);
    const updatedSelection = newSelection.merge({
      focusKey: blockKey,
      focusOffset: contentBlock.getLength(),
      hasFocus: true,
    });

    dispatch(updateSingleEditorState({
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

    dispatch(updateSingleEditorState({
      editorState: handleSideToolbarActions(editorState, action),
    }));
  }

  const decorator = new CompositeDecorator([
    docsLinkDecorator,
  ]);

  return <MyEditor
    handleOnChangeStyleLine={onClickOptionInSideToolbar}
    onMoveBlockAction={(action) => onMoveBlockAction({
      action,
      dispatch,
      editorState,
    })}
    key='editor-view'
    handleChangeEditorState={handleChangeEditorState}
    editorState={editorState ?? EditorState.createEmpty(decorator)}
    onClickSideToolbar={onClickSideToolbar}
  />;
};

export default EditorView;
