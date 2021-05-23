import { EditorState, convertFromHTML, ContentState, Modifier } from 'draft-js';

export default function handlePastedText({ styles, state, handleOnChange }) {

  const converted = convertFromHTML(styles);
  const convertedContentState = ContentState.createFromBlockArray(
    converted.contentBlocks,
  );
  const oldSelection = state?.getSelection();

  const newContentState = Modifier.replaceWithFragment(
    state?.getCurrentContent(),
    oldSelection,
    convertedContentState.getBlockMap(),
  );

  handleOnChange(EditorState.push(state, newContentState));

  return true;
}
