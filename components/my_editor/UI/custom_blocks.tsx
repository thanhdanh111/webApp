import React from 'react';
import SideToolBarButton from './side_toolbar';
import { EditorBlock, DefaultDraftBlockRenderMap } from 'draft-js';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import Immutable from 'immutable';

const blockRenderMap = Immutable.Map({
  'unordered-list-item': {
    element: 'div',
  },
  'code-block': {
    element: 'code',
  },
  unstyled: {
    element: 'div',
  },
  'ordered-list-item': {
    element: 'div',
  },
});

export const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);

export const UnstyledBlockCustom = (props) => {

  return React.createElement(
    React.Fragment,
    { key: 'unstyled-block-custom' },
    <SideToolBarButton
      contentBlock={props?.block}
      handleOnChangeLineStyle={props?.blockProps?.handleOnChangeLineStyle}
      onClickSideToolbar={props?.blockProps?.onClickSideToolbar}
      onMoveBlockAction={props?.blockProps?.onMoveBlockAction}
    />,
    <EditorBlock {...props} />,
  );
};

export const CodeBlockCustom = (props) => React.createElement(
  React.Fragment,
  { key: 'code-block-custom' },
  <SideToolBarButton
    contentBlock={props?.block}
    handleOnChangeLineStyle={props?.blockProps?.handleOnChangeLineStyle}
    onClickSideToolbar={props?.blockProps?.onClickSideToolbar}
    onMoveBlockAction={props?.blockProps?.onMoveBlockAction}
  />,
  <EditorBlock {...props} />,
);

export const UnorderedListItemCustom = (props) => React.createElement(
  React.Fragment,
  { key: 'unordered-list-item' },
  <SideToolBarButton
    contentBlock={props?.block}
    handleOnChangeLineStyle={props?.blockProps?.handleOnChangeLineStyle}
    onClickSideToolbar={props?.blockProps?.onClickSideToolbar}
    onMoveBlockAction={props?.blockProps?.onMoveBlockAction}
  />,
  <FiberManualRecordIcon style={{ width: '10px', height: '10px', marginRight: '10px' }} />,
  <EditorBlock {...props} />,
);

export const OrderedListItemCustom = (props) => React.createElement(
  React.Fragment,
  { key: 'ordered-list-item' },
  <SideToolBarButton
    contentBlock={props?.block}
    handleOnChangeLineStyle={props?.blockProps?.handleOnChangeLineStyle}
    onClickSideToolbar={props?.blockProps?.onClickSideToolbar}
    onMoveBlockAction={props?.blockProps?.onMoveBlockAction}
  />,
  <IndexElement {...props}  />,
  <EditorBlock {...props} />,
);

const IndexElement = (props) => {
  const currentContentBlock = props.block;
  const currentKey = currentContentBlock.getKey();
  const blocks = props.contentState.getBlockMap()._list._tail.array;
  let orderNumber = 1;

  if (!currentContentBlock || !blocks?.length) {
    return <div>{orderNumber}. </div>;
  }

  for (const block of blocks) {
    const contentBlock = block[1];
    const blockKey = block[0];

    const blockType = contentBlock.getType();

    if (blockKey !== currentKey && blockType === 'ordered-list-item') {
      orderNumber = orderNumber + 1;

      continue;
    }

    if (blockKey === currentKey) {

      break;
    }

    orderNumber = 1;
  }

  return <div>{orderNumber}. </div>;
};
