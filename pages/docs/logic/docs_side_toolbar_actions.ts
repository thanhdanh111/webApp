import { blockStyles, inlineStyles } from 'constants/toolbar_docs';
import { RichUtils, EditorState, convertFromRaw, SelectionState, convertToRaw } from 'draft-js';
import { checkOnlyTrueInArray } from 'helpers/check_only_true';
import { updateSingleEditorState } from './docs_actions';

export function handleSideToolbarActions(editorState, action) {
  if (!editorState) {
    return;
  }

  const oldSelection = editorState.getSelection();
  let newEditorState;

  if (blockStyles.includes(action ?? '')) {
    newEditorState = RichUtils.toggleBlockType(
      editorState,
      action,
    );
  }

  if (inlineStyles.includes(action ?? '')) {
    newEditorState = RichUtils.toggleInlineStyle(
      editorState,
      action,
    );
  }

  return EditorState.forceSelection(
    newEditorState,
    oldSelection,
  );
}

function afterMovingPosition(shifttingIndex, onSelectBlockKey , blocks, entityMap) {
  const newBlocks = [];
  let shiftedIndex;

  for (const [index, block] of blocks.entries()) {
    const blockKey = block.key;
    let switchBlock;

    if (typeof shiftedIndex === 'number' && shiftedIndex === index) continue;

    newBlocks.push(block as never);

    if (blockKey !== onSelectBlockKey) continue;

    switchBlock = blocks?.[index + shifttingIndex];

    if (!switchBlock) break;

    shiftedIndex = index + shifttingIndex;
    newBlocks[shiftedIndex] = block as never;
    newBlocks[index] = switchBlock as never;
  }

  if (!newBlocks?.length || newBlocks.length !== blocks.length) return;

  return convertFromRaw({ entityMap, blocks: newBlocks });
}

export function onMoveBlockAction({ action, editorState, dispatch }) {
  const oldSelection = editorState?.getSelection();
  const oldContentState = editorState?.getCurrentContent();
  const onSelectBlockKey = oldSelection?.getAnchorKey();
  const rawData = convertToRaw(oldContentState);
  const blockList = rawData?.blocks;
  const entityMap = rawData?.entityMap;

  if (blockList?.length < 2 || !editorState) {

    return;
  }
  let newContentState;

  switch (action) {
    case 'UP':
      newContentState = afterMovingPosition(-1, onSelectBlockKey, blockList, entityMap);

      break;
    case 'DOWN':
      newContentState = afterMovingPosition(+1, onSelectBlockKey, blockList, entityMap);

      break;
  }

  const canContinue = checkOnlyTrueInArray({
    conditionsArray: [
      !!newContentState,
      !!onSelectBlockKey,
    ],
  });

  if (!canContinue) return;

  const newEditorState = EditorState.push(editorState, newContentState);
  const newSelection = SelectionState.createEmpty(onSelectBlockKey);
  const updatedSelection = newSelection.merge({
    focusKey: onSelectBlockKey,
    focusOffset: oldContentState.getBlockForKey(onSelectBlockKey).getLength(),
    hasFocus: true,
  });

  dispatch(updateSingleEditorState({
    editorState: EditorState.forceSelection(newEditorState, updatedSelection),
  }));
}
