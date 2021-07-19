import { EditorState, AtomicBlockUtils } from 'draft-js'

export function handleDroppedFiles(_, files, editorState, onChangeState) {
  if (!files || !files.length) {

    return 'not-handled'
  }

  if (files[0].type === 'image/png') {
    const newFile = URL.createObjectURL(files[0])
    const contentState = editorState.getCurrentContent()
    const contentStateWithEntity = contentState.createEntity(
      'IMAGE',
      'IMMUTABLE',
      { url:  newFile },
    )
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
    const newEditorState = AtomicBlockUtils.insertAtomicBlock(
      EditorState.push(editorState, contentStateWithEntity),
      entityKey,
      ' ',
    )

    onChangeState(newEditorState)

    return 'handled'
  }

  return 'not-handled'
}
