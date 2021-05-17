import {
  CodeBlockCustom,
  OrderedListItemCustom,
  UnorderedListItemCustom,
  UnstyledBlockCustom,
} from '../UI/custom_blocks';

export default function editorBlockRenderer(contentState, handleOnChangeLineStyle, onClickSideToolbar) {
  const type = contentState.getType();

  if (type === 'unordered-list-item') {
    return {
      component: UnorderedListItemCustom,
      props: {
        handleOnChangeLineStyle,
        onClickSideToolbar,
      },
    };
  }

  if (type === 'code-block') {
    return {
      component: CodeBlockCustom,
      props: {
        handleOnChangeLineStyle,
        onClickSideToolbar,
      },
    };
  }

  if (type === 'ordered-list-item') {
    return {
      component: OrderedListItemCustom,
      props: {
        handleOnChangeLineStyle,
        onClickSideToolbar,
      },
    };
  }

  return {
    component: UnstyledBlockCustom,
    props: {
      handleOnChangeLineStyle,
      onClickSideToolbar,
    },
  };
}
