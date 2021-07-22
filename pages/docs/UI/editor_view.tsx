import React, { FunctionComponent } from 'react'
import MyEditor from '@components/my_editor/my_editor'
import { useDispatch } from 'react-redux'
import { updateDocs } from '../logic/docs_actions'
import { EditorState } from 'draft-js'

interface EditorView {
  readOnly: boolean
  displayInlineToolbar: boolean
  editorState: EditorState
}

const EditorView: FunctionComponent<EditorView> = ({ readOnly, editorState }) => {
  const dispatch = useDispatch()

  function onClickSideToolbar() {
    if (readOnly) {

      return
    }

    dispatch(updateDocs({
      displayInlineToolbar: false,
    }))
  }

  function handleChangeEditorState(newEditorState) {
    dispatch(updateDocs({ editorState: newEditorState }))
  }

  return <div className='editor-view'>
    <MyEditor
      handleOnChangeLineStyle={() => 'handled'}
      onMoveBlockAction={() => 'handled'}
      readOnly={readOnly}
      handleChangeEditorState={handleChangeEditorState}
      editorState={editorState ?? EditorState.createEmpty()}
      onClickSideToolbar={onClickSideToolbar}
    />
  </div>
}

export default EditorView
