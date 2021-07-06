import { getDefaultKeyBinding } from 'draft-js';
import { checkOnlyTrueInArray } from 'helpers/check_only_true';
import { checkTrueInArray } from 'helpers/check_true_in_array';

export function handleKeyBinding({ state, event }) {
  if (event?.code === 'Enter' && event?.keyCode === 13) {
    return handleEnter(state, event);
  }

  return getDefaultKeyBinding(event);
}

function handleEnter(state, event) {
  const onSelectBlockKey = state?.getSelection()?.getAnchorKey();
  const oldContentState = state?.getCurrentContent();

  const blockBeforeOnSelectBlock = oldContentState?.getBlockBefore(onSelectBlockKey);
  const blockOnSelect = oldContentState?.getBlockForKey(onSelectBlockKey);
  const onSelectBlockType = blockOnSelect?.getType();

  if (onSelectBlockType !== 'code-block' || !blockBeforeOnSelectBlock) {
    return getDefaultKeyBinding(event);
  }

  const beforeOnSelectHaveText = checkTrueInArray({
    conditionsArray: [
      blockBeforeOnSelectBlock.getLength(),
      blockOnSelect?.getLength(),
    ],
  });
  const bothHaveSameType = checkOnlyTrueInArray({
    conditionsArray: [
      blockBeforeOnSelectBlock.getType() === 'code-block',
      onSelectBlockType === 'code-block',
    ],
  });

  if (!beforeOnSelectHaveText && bothHaveSameType) {
    return 'normalized-code-block';
  }

  return  getDefaultKeyBinding(event);
}
