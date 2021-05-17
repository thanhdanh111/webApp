import React, { FunctionComponent, useEffect } from 'react';
import { Editor, EditorState } from 'draft-js';
import { customStyleMapDraftjs } from '@components/inline_toolbar/UI/custom_style_map';
import myBlockStyleFn from './logic/handle_return_styles';
import editorBlockRenderer from './logic/handle_block_renderer';
import handleKeyCommand from './logic/handle_key_command';
import { extendedBlockRenderMap } from './UI/custom_blocks';
import _immutable from 'immutable';

interface MyEditor {
  index: number;
  currentIndex: number;
  action?: string;
  editorState?: EditorState;
  handleChangeEditorState: (newEditorState, index) => void;
  handleOnChangeStyleLine?: (action) => void;
}

const MyEditor: FunctionComponent<MyEditor> = ({
  index,
  editorState,
  handleChangeEditorState,
  handleOnChangeStyleLine,
}) => {
  let editorRef;

  function handleOnChange(newEditorState) {

    handleChangeEditorState(newEditorState, index);
  }

  const setDomEditorRef = (ref) => editorRef = ref;

  useEffect(() => editorRef?.focus());

  return <Editor
    stripPastedStyles={true}
    ref={setDomEditorRef}
    customStyleMap={customStyleMapDraftjs}
    tabIndex={index}
    editorState={editorState}
    blockRendererFn={(contentState) => editorBlockRenderer(contentState, handleOnChangeStyleLine)}
    blockStyleFn={(contentBlock) => myBlockStyleFn(contentBlock, editorState)}
    blockRenderMap={extendedBlockRenderMap}
    preserveSelectionOnBlur={true}
    onChange={(newEditorState) => handleOnChange(newEditorState)}
    handleKeyCommand={(command, state) => handleKeyCommand(command, state, handleOnChange)}
  />;
};

function areEqual(_, { index, currentIndex }) {
  const equalFocusing = index === currentIndex;

  return !equalFocusing;
}

export default React.memo(MyEditor, areEqual);
