import { RichUtils } from 'draft-js'

export default function handleKeyCommand(command, state, handleOnChange) {
  const newState = RichUtils.handleKeyCommand(state, command)

  if (!newState) {
    return 'not-handled'
  }

  handleOnChange(newState)
}
