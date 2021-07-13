import {
  EditorState, convertFromHTML, ContentState,
  Modifier, SelectionState, convertToRaw,
  convertFromRaw,
} from 'draft-js';
import { urlRegex } from 'constants/docs_regex';
import { checkTrueInArray } from 'helpers/check_true_in_array';

export default function handlePastedText({ html, state, handleOnChange, text }) {
  const invalidData = checkTrueInArray({
    conditionsArray: [
      !state,
      !handleOnChange,
    ],
  });

  if (invalidData) {

    return true;
  }

  const selectedBlockType = getTypeOfBlock(state);
  const oldSelection = state?.getSelection();

  if (selectedBlockType?.length) {

    return;
  }

  const contentState = handlePasteCases({ html, text });

  if (!contentState) {

    return;
  }

  const newContentState = Modifier.replaceWithFragment(
    state?.getCurrentContent(),
    oldSelection,
    contentState?.getBlockMap(),
  );

  handleOnChange(EditorState.push(state, newContentState));

  return true;
}

function getTypeOfBlock(editorState) {
  const startKey = editorState.getSelection().getStartKey();
  const selectedBlockType = editorState
    .getCurrentContent()
    .getBlockForKey(startKey)
    .getType();

  return selectedBlockType;
}

function handlePasteCases({
  html,
  text,
}) {

  if (html) {
    const converted = convertFromHTML(html);
    const rawContentState = convertToRaw(ContentState.createFromBlockArray(converted.contentBlocks));

    return turnMutableToImmutableLinkEntity({ rawContentState });
  }

  if (!html && text) {
    const onlyTextContentState = ContentState.createFromText(text);

    return handleUrlForText({
      contentBlocks: onlyTextContentState.getBlocksAsArray(),
      contentState: onlyTextContentState,
    });
  }

  return null;
}

function turnMutableToImmutableLinkEntity({ rawContentState }) {
  const entityMap = rawContentState.entityMap;

  for (const entity in entityMap) {
    if (entityMap[entity].type !== 'LINK' || entityMap[entity].mutability !== 'MUTABLE') {
      continue;
    }

    entityMap[entity].mutability = 'IMMUTABLE';
  }

  return convertFromRaw({ entityMap, blocks: rawContentState.blocks });
}

export function handleUrlForText({ contentBlocks, contentState }) {
  let newContentState = contentState;

  contentBlocks.forEach((contentBlock) => {
    const urlRegexFunc = new RegExp(urlRegex);

    const textOfBlock = contentBlock?.getText();
    const blockKey = contentBlock?.getKey();

    const splitedSpaces = textOfBlock?.split(' ');

    let filteredIndex = 0;

    splitedSpaces.forEach((word) => {
      const spaceLength = 1;
      const isUrl = word.length > 5 && urlRegexFunc.test(word);

      if (isUrl) {
        const contentStateWithEntity = contentState.createEntity(
            'LINK',
            'IMMUTABLE',
            { url: word, href: word },
          );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newSelection = SelectionState.createEmpty(blockKey);
        const startOffset = filteredIndex;
        const endOffset = filteredIndex + word.length - 1;
        const updatedSelection = newSelection.merge({
          anchorOffset: startOffset,
          focusOffset: endOffset + 1,
          hasFocus: true,
        });

        newContentState = Modifier.applyEntity(
          newContentState,
          updatedSelection,
          entityKey,
        );
      }

      filteredIndex = filteredIndex + word.length + spaceLength;
    });
  });

  if (!newContentState) {

    return contentState;
  }

  return newContentState;
}
