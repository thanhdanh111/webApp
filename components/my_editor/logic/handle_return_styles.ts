import handleStyleForCodeBlock from './handle_blocks_style';

export default function myBlockStyleFn(contentBlock, editorState) {
  const type = contentBlock.getType();

  if (type === 'code-block') {
    return handleStyleForCodeBlock(contentBlock, editorState);
  }

  if (type === 'header-one') {
    return 'block-wrapper header-one';
  }

  if (type === 'header-two') {
    return 'block-wrapper header-two';
  }

  if (type === 'header-three') {
    return 'block-wrapper header-three';
  }

  return 'block-wrapper';
}
