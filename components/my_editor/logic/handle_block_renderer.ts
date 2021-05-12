import {
  CodeBlockCustom,
  OrderedListItemCustom,
  UnorderedListItemCustom,
  UnstyledBlockCustom,
} from '../UI/custom_blocks';

export default function editorBlockRenderer(contentState) {
  const type = contentState.getType();

  if (type === 'unordered-list-item') {
    return {
      component: UnorderedListItemCustom,
    };
  }

  if (type === 'code-block') {
    return {
      component: CodeBlockCustom,
    };
  }

  if (type === 'ordered-list-item') {
    return {
      component: OrderedListItemCustom,
    };
  }

  return {
    component: UnstyledBlockCustom,
  };
}
