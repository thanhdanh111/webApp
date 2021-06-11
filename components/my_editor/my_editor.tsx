import React, { FunctionComponent } from 'react';
import { Editor, EditorState } from 'draft-js';
import { customStyleMapDraftjs } from 'constants/custom_style_map';
import editorBlockRenderer from '../../pages/docs/logic/handle_block_renderer';
import { extendedBlockRenderMap } from '../../pages/docs/UI/custom_blocks';
import _immutable from 'immutable';
import handlePastedText from 'pages/docs/logic/handle_pasted_text';
import myBlockStyleFn from 'pages/docs/logic/handle_return_styles';
import handleKeyCommand from 'pages/docs/logic/handle_key_command';
import { handleKeyBinding } from 'pages/docs/logic/handle_key_binding';

interface MyEditor {
  editorState?: EditorState;
  handleChangeEditorState: (newEditorState) => void;
  handleOnChangeStyleLine?: (action, contentState) => void;
  onClickSideToolbar?: (props) => void;
  onMoveBlockAction?: (action) => void;
}

const MyEditor: FunctionComponent<MyEditor> = ({
  editorState,
  handleChangeEditorState,
  handleOnChangeStyleLine,
  onClickSideToolbar,
  onMoveBlockAction,
}) => {

  function handleOnChange(newEditorState) {

    handleChangeEditorState(newEditorState);
  }

  return <Editor
    stripPastedStyles={true}
    customStyleMap={customStyleMapDraftjs}
    handlePastedText={(_, styles, state) => handlePastedText({ styles, state, handleOnChange })}
    editorState={editorState}
    blockRendererFn={(contentState) =>
      editorBlockRenderer(
        contentState,
        handleOnChangeStyleLine,
        onClickSideToolbar,
        onMoveBlockAction,
      )}
    blockStyleFn={(contentBlock) => myBlockStyleFn(contentBlock, editorState)}
    blockRenderMap={extendedBlockRenderMap}
    preserveSelectionOnBlur={true}
    keyBindingFn={(event) => handleKeyBinding({
      event,
      state: editorState,
    })}
    onChange={(newEditorState) => handleOnChange(newEditorState)}
    handleKeyCommand={(command, state) => handleKeyCommand(command, state, handleOnChange)}
  />;
};

export default MyEditor;
