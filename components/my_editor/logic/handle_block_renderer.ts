import {
  CodeBlockCustom,
  OrderedListItemCustom,
  UnorderedListItemCustom,
  UnstyledBlockCustom,
} from '../UI/custom_blocks';

export default function editorBlockRenderer(contentState, handleOnChangeLineStyle) {
  const type = contentState.getType();

  if (type === 'unordered-list-item') {
    return {
      component: UnorderedListItemCustom,
      props: {
        handleOnChangeLineStyle,
      },
    };
  }

  if (type === 'code-block') {
    return {
      component: CodeBlockCustom,
      props: {
        handleOnChangeLineStyle,
      },
    };
  }

  if (type === 'ordered-list-item') {
    return {
      component: OrderedListItemCustom,
      props: {
        handleOnChangeLineStyle,
      },
    };
  }

  return {
    component: UnstyledBlockCustom,
    props: {
      handleOnChangeLineStyle,
    },
  };
}
