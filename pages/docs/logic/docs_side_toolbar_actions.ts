import { RichUtils, EditorState, ContentState, SelectionState } from 'draft-js';
import { checkOnlyTrueInArray } from 'helpers/check_only_true';
import { updateSingleEditorState } from './docs_actions';

export function handleSideToolbarActions(editorState, action) {
  if (!editorState) {
    return;
  }

  const oldSelection = editorState.getSelection();
  let newEditorState;

  switch (action) {
    case 'unstyled':
    case 'header-one':
    case 'header-two':
    case 'header-three':
    case 'code-block':
    case 'ordered-list-item':
    case 'unordered-list-item':

      newEditorState = RichUtils.toggleBlockType(
        editorState,
        action,
      );
      break;
    default:
      newEditorState = RichUtils.toggleInlineStyle(
        editorState,
        action,
      );

      break;
  }

  return EditorState.forceSelection(
    newEditorState,
    oldSelection,
  );
}

function afterMovePosition(shifttingIndex, onSelectBlockKey , blocks) {
  const newBlocks = [];
  let shiftedIndex;

  for (const [index, block] of blocks.entries()) {
    const blockKey = block[0];
    const contentBlock = block[1];
    let switchBlock;

    if (typeof shiftedIndex === 'number' && shiftedIndex === index) continue;

    newBlocks.push(contentBlock as never);

    if (blockKey !== onSelectBlockKey) continue;

    switchBlock = blocks?.[index + shifttingIndex]?.[1];

    if (!switchBlock) break;

    shiftedIndex = index + shifttingIndex;
    newBlocks[shiftedIndex] = contentBlock as never;
    newBlocks[index] = switchBlock as never;
  }

  if (!newBlocks?.length || newBlocks.length !== blocks.length) return;

  return ContentState.createFromBlockArray(newBlocks);
}

export function onMoveBlockAction({ action, editorState, dispatch }) {
  const oldSelection = editorState?.getSelection();
  const oldContentState = editorState?.getCurrentContent();
  const onSelectBlockKey = oldSelection?.getAnchorKey();
  const blockList = oldContentState?.getBlockMap()?._list;

  if (blockList?.size < 2 || !editorState) {

    return;
  }

  const blocks = blockList?._tail?.array;
  let newContentState;

  switch (action) {
    case 'UP':
      newContentState = afterMovePosition(-1, onSelectBlockKey, blocks);

      break;
    case 'DOWN':
      newContentState = afterMovePosition(+1, onSelectBlockKey, blocks);

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
