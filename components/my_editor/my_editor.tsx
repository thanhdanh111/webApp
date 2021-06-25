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
import { handleBeforeInput } from 'pages/docs/logic/handle_before_input';
import { handleDroppedFiles } from 'pages/docs/logic/handle_dropped_files';
import { handlePastedFiles } from 'pages/docs/logic/handle_pasted_files';

interface MyEditor {
  editorState?: EditorState;
  handleChangeEditorState: (newEditorState) => void;
  handleOnChangeLineStyle?: (action, contentState) => void;
  onClickSideToolbar?: (props) => void;
  onMoveBlockAction?: (action) => void;
}

const MyEditor: FunctionComponent<MyEditor> = ({
  editorState,
  handleChangeEditorState,
  handleOnChangeLineStyle,
  onClickSideToolbar,
  onMoveBlockAction,
}) => {

  function handleOnChange(newEditorState) {
    handleChangeEditorState(newEditorState);
  }

  return <Editor
    stripPastedStyles={true}
    placeholder='Write something'
    customStyleMap={customStyleMapDraftjs}
    handlePastedText={(text, html, state) => handlePastedText({ text, html, state, handleOnChange })}
    handleKeyCommand={(command, state) => handleKeyCommand(command, state, handleOnChange)}
    editorState={editorState}
    blockRendererFn={(contentBlock) =>
      editorBlockRenderer({
        contentBlock,
        onClickSideToolbar,
        onMoveBlockAction,
        handleOnChangeLineStyle,
      })}
    blockStyleFn={(contentBlock) => myBlockStyleFn(contentBlock, editorState)}
    blockRenderMap={extendedBlockRenderMap}
    preserveSelectionOnBlur={true}
    keyBindingFn={(event) => handleKeyBinding({ event, state: editorState })}
    onChange={(newEditorState) => handleOnChange(newEditorState)}
    handleBeforeInput={(chars, state) => handleBeforeInput(chars, state, handleOnChange)}
    handleDroppedFiles={(selectionState, files) => handleDroppedFiles(selectionState, files, editorState, handleOnChange)}
    handlePastedFiles={(files) => handlePastedFiles(files, editorState, handleOnChange)}
  />;
};

export default MyEditor;
