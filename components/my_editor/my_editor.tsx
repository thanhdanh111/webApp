import React, { FunctionComponent } from 'react'
import { Editor, EditorState } from 'draft-js'
import { customStyleMapDraftjs } from 'constants/custom_style_map'
import editorBlockRenderer from '../../pages/docs/logic/handle_block_renderer'
import { extendedBlockRenderMap } from '../../pages/docs/UI/custom_blocks'
import myBlockStyleFn from 'pages/docs/logic/handle_return_styles'
import handleKeyCommand from 'pages/docs/logic/handle_key_command'

interface MyEditor {
  editorState?: EditorState
  handleChangeEditorState: (newEditorState) => void
  handleOnChangeLineStyle?: (action, contentBlock) => void
  onClickSideToolbar?: (props) => void
  onMoveBlockAction?: (action, contentBlock) => void
  readOnly: boolean
}

const MyEditor: FunctionComponent<MyEditor> = ({
  editorState,
  handleChangeEditorState,
  handleOnChangeLineStyle,
  onClickSideToolbar,
  onMoveBlockAction,
  readOnly,
}) => {

  function handleOnChange(newEditorState) {
    handleChangeEditorState(newEditorState)
  }

  const blockType = editorState.getCurrentContent()?.getFirstBlock()?.getType()

  return <Editor
    stripPastedStyles={true}
    readOnly={readOnly}
    placeholder={blockType !== 'unstyled' ? null : 'Write something'}
    customStyleMap={customStyleMapDraftjs}
    handleKeyCommand={(command, state) => handleKeyCommand(command, state, handleOnChange)}
    editorState={editorState}
    blockRendererFn={(contentBlock) =>
      editorBlockRenderer({
        contentBlock,
        onClickSideToolbar,
        onMoveBlockAction,
        handleOnChangeLineStyle,
        readOnly,
      })}
    blockStyleFn={(contentBlock) => myBlockStyleFn(contentBlock, editorState)}
    blockRenderMap={extendedBlockRenderMap}
    preserveSelectionOnBlur={true}
    onChange={(newEditorState) => handleOnChange(newEditorState)}
  />
}

export default MyEditor
