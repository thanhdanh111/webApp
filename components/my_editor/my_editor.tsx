import React, { FunctionComponent } from 'react'
import { Editor, EditorState } from 'draft-js'
import { customStyleMapDraftjs } from 'constants/custom_style_map'
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
    preserveSelectionOnBlur={true}
    onChange={(newEditorState) => handleOnChange(newEditorState)}
  />
}

export default MyEditor
