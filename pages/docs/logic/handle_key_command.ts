import { RichUtils } from 'draft-js';

export default function handleKeyCommand(command, state, handleOnChange) {
  if (command === 'normalized-code-block') {
    handleOnChange(RichUtils.toggleBlockType(state, 'unstyled'));

    return 'handled';
  }

  const newState = RichUtils.handleKeyCommand(state, command);

  if (!newState) {
    return 'not-handled';
  }

  handleOnChange(newState);
}
