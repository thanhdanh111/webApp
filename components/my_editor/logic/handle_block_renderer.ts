import { CodeBlockCustom, UnorderedListItemCustom, UnstyledBlockCustom } from '../UI/custom_blocks';

export default function editorBlockRenderer(contentState) {
  const type = contentState.getType();

  if (type === 'unordered-list-item') {
    return {
      component: UnorderedListItemCustom,
      editable: true,
    };
  }

  if (type === 'code-block') {
    return {
      component: CodeBlockCustom,
      editable: true,
    };
  }

  return {
    component: UnstyledBlockCustom,
    editable: true,
  };
}
