import { getDefaultKeyBinding } from 'draft-js';

export function handleKeyBinding({ state, event }) {
  if (event?.code !== 'Enter' && event?.keyCode !== 13) {
    return getDefaultKeyBinding(event);
  }

  const onSelectBlockKey = state?.getSelection()?.getAnchorKey();
  const oldContentState = state?.getCurrentContent();

  const blockBeforeOnSelectBlock = oldContentState?.getBlockBefore(onSelectBlockKey);
  const blockOnSelect = oldContentState?.getBlockForKey(onSelectBlockKey);
  const onSelectBlockType = blockOnSelect?.getType();

  if (onSelectBlockType !== 'code-block') {
    return getDefaultKeyBinding(event);
  }

  const beforeOnSelectHaveText =
    blockBeforeOnSelectBlock?.getLength() ||
    blockOnSelect.getLength();
  const bothHaveSameType =
    blockBeforeOnSelectBlock.getType() === 'code-block' &&
    onSelectBlockType === 'code-block';

  if (!beforeOnSelectHaveText && bothHaveSameType) {
    return 'normalized-code-block';
  }

  return  getDefaultKeyBinding(event);
}
