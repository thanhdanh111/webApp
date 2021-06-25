import {
  CodeBlockCustom,
  MediaBlockComponent,
  OrderedListItemCustom,
  UnorderedListItemCustom,
  UnstyledBlockCustom,
} from '../UI/custom_blocks';

export default function editorBlockRenderer({
  contentBlock,
  handleOnChangeLineStyle,
  onClickSideToolbar,
  onMoveBlockAction,
}) {
  const type = contentBlock.getType();

  if (type === 'unordered-list-item') {
    return {
      component: UnorderedListItemCustom,
      props: {
        handleOnChangeLineStyle,
        onClickSideToolbar,
        onMoveBlockAction,
      },
    };
  }

  if (type === 'code-block') {
    return {
      component: CodeBlockCustom,
      props: {
        handleOnChangeLineStyle,
        onClickSideToolbar,
        onMoveBlockAction,
      },
    };
  }

  if (type === 'ordered-list-item') {
    return {
      component: OrderedListItemCustom,
      props: {
        handleOnChangeLineStyle,
        onClickSideToolbar,
        onMoveBlockAction,
      },
    };
  }

  if (type === 'atomic') {
    return {
      editable: false,
      component: MediaBlockComponent,
      props: {
        handleOnChangeLineStyle,
        onClickSideToolbar,
        onMoveBlockAction,
      },
    };
  }

  return {
    component: UnstyledBlockCustom,
    props: {
      handleOnChangeLineStyle,
      onClickSideToolbar,
      onMoveBlockAction,
    },
  };
}
