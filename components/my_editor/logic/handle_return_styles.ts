import handleStyleForCodeBlock from './handle_blocks_style';

export default function myBlockStyleFn(contentBlock, editorState) {
  const type = contentBlock.getType();

  if (type === 'code-block') {
    return handleStyleForCodeBlock(contentBlock, editorState);
  }

  return 'block-wrapper';
}
