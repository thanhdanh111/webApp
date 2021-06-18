import {
  EditorState, convertFromHTML, ContentState,
  Modifier, SelectionState, convertToRaw,
  convertFromRaw,
} from 'draft-js';
import { urlRegex } from 'constants/docs_regex';

export default function handlePastedText({ html, state, handleOnChange, text }) {
  if (!state || !handleOnChange) {

    return true;
  }

  let contentState;

  if (html) {
    const converted = convertFromHTML(html);
    const rawContentState = convertToRaw(ContentState.createFromBlockArray(converted.contentBlocks));
    contentState = turnMutableToImmutableLinkEntity({ rawContentState });
  }

  if (!html && text) {
    const onlyTextContentState = ContentState.createFromText(text);
    contentState = handleUrlForText({
      contentBlocks: onlyTextContentState.getBlocksAsArray(),
      contentState: onlyTextContentState,
    });
  }

  if (!contentState) {

    return;
  }

  const oldSelection = state?.getSelection();

  const newContentState = Modifier.replaceWithFragment(
    state?.getCurrentContent(),
    oldSelection,
    contentState.getBlockMap(),
  );

  handleOnChange(EditorState.push(state, newContentState));

  return true;
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
  const urlRegexFunc = new RegExp(urlRegex);

  contentBlocks.forEach((contentBlock) => {
    const textOfBlock = contentBlock?.getText();
    const blockKey = contentBlock?.getKey();

    const splitedSpaces = textOfBlock?.split(' ');

    let filteredTextLength = -1;

    splitedSpaces.forEach((word) => {
      const spaceLength = 1;
      const isUrl = urlRegexFunc.test(word);

      if (isUrl) {
        const contentStateWithEntity = newContentState.createEntity(
          'LINK',
          'IMMUTABLE',
          { url: word, href: word },
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newSelection = SelectionState.createEmpty(blockKey);
        const updatedSelection = newSelection.merge({
          anchorOffset: filteredTextLength + 1,
          focusOffset: filteredTextLength + 1 + word.length,
          hasFocus: true,
        });

        newContentState = Modifier.applyEntity(
          newContentState,
          updatedSelection,
          entityKey,
        );

        return;
      }

      filteredTextLength = filteredTextLength + word.length + spaceLength;
    });
  });

  if (!newContentState) {

    return contentState;
  }

  return newContentState;
}
