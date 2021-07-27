import React, { FunctionComponent } from 'react'
import MyEditor from '@components/my_editor/my_editor'
import { useDispatch } from 'react-redux'
import { updateDocs } from '../logic/docs_actions'
import { SelectionState, EditorState } from 'draft-js'
import { handleSideToolbarActions, onMoveBlockAction } from '../logic/docs_side_toolbar_actions'
import { showUpToolbarAndUpdateState } from '../logic/docs_inline_toolbar_actions'

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
    showUpToolbarAndUpdateState(newEditorState, dispatch)
  }

  function onClickOptionInSideToolbar(action, contentBlock) {
    if (!action) {
      return
    }

    const timestamp = new Date().getTime()
    const blockKey = contentBlock.getKey()
    const newSelection = SelectionState.createEmpty(blockKey)
    const updatedSelection = newSelection.merge({
      focusKey: blockKey,
      focusOffset: contentBlock.getLength(),
      hasFocus: false,
    })

    dispatch(updateDocs({
      editTimestamp: timestamp,
      editorState: handleSideToolbarActions(
        EditorState.forceSelection(editorState, updatedSelection),
        action,
      ),
    }))
  }

  return <div className='editor-view'>
    <MyEditor
      handleOnChangeLineStyle={onClickOptionInSideToolbar}
      onMoveBlockAction={(action, contentBlock) => onMoveBlockAction({
        action,
        dispatch,
        editorState,
        contentBlock,
      })}
      readOnly={readOnly}
      handleChangeEditorState={handleChangeEditorState}
      editorState={editorState ?? EditorState.createEmpty()}
      onClickSideToolbar={onClickSideToolbar}
    />
  </div>
}

export default EditorView
