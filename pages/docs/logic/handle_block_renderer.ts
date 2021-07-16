import {
  CheckedListBlockCustom,
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
  readOnly,
}) {
  const type = contentBlock.getType();

  if (type === 'unordered-list-item') {
    return {
      component: UnorderedListItemCustom,
      props: {
        handleOnChangeLineStyle,
        onClickSideToolbar,
        onMoveBlockAction,
        readOnly,
      },
    };
  }

  if (type === 'checkable-list-item') {
    return {
      component: CheckedListBlockCustom,
      props: {
        handleOnChangeLineStyle,
        onClickSideToolbar,
        onMoveBlockAction,
        readOnly,
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
        readOnly,
      },
    };
  }

  if (type === 'ordered-list-item') {
    return {
      component: OrderedListItemCustom,
      props: {
        handleOnChangeLineStyle,
        onClickSideToolbar,
        readOnly,
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
        readOnly,
      },
    };
  }

  return {
    component: UnstyledBlockCustom,
    props: {
      handleOnChangeLineStyle,
      onClickSideToolbar,
      onMoveBlockAction,
      readOnly,
    },
  };
}
