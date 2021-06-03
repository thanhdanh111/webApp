import React from 'react';
import SideToolbarButton from '../../../components/my_editor/side_toolbar_button';
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
    <SideToolbarButton
      contentBlock={props?.block}
      handleOnChangeLineStyle={props?.blockProps?.handleOnChangeLineStyle}
      onClickSideToolbar={props?.blockProps?.onClickSideToolbar}
      onMoveBlockAction={props?.blockProps?.onMoveBlockAction}
    >
      {null}
    </SideToolbarButton>,
    <EditorBlock {...props} />,
  );
};

export const CodeBlockCustom = (props) => React.createElement(
  React.Fragment,
  { key: 'code-block-custom' },
  <SideToolbarButton
    contentBlock={props?.block}
    handleOnChangeLineStyle={props?.blockProps?.handleOnChangeLineStyle}
    onClickSideToolbar={props?.blockProps?.onClickSideToolbar}
    onMoveBlockAction={props?.blockProps?.onMoveBlockAction}
  >
    {null}
  </SideToolbarButton>,
  <EditorBlock {...props} />,
);

export const UnorderedListItemCustom = (props) => React.createElement(
  React.Fragment,
  { key: 'unordered-list-item' },
  <SideToolbarButton
    contentBlock={props?.block}
    handleOnChangeLineStyle={props?.blockProps?.handleOnChangeLineStyle}
    onClickSideToolbar={props?.blockProps?.onClickSideToolbar}
    onMoveBlockAction={props?.blockProps?.onMoveBlockAction}
  >
    <FiberManualRecordIcon style={{ width: '10px', height: '20px', marginLeft: '10px', marginRight: '7px' }} />
  </SideToolbarButton>,
  <EditorBlock {...props} />,
);

export const OrderedListItemCustom = (props) => React.createElement(
  React.Fragment,
  { key: 'ordered-list-item' },
  <SideToolbarButton
    contentBlock={props?.block}
    handleOnChangeLineStyle={props?.blockProps?.handleOnChangeLineStyle}
    onClickSideToolbar={props?.blockProps?.onClickSideToolbar}
    onMoveBlockAction={props?.blockProps?.onMoveBlockAction}
  >
    <IndexElement {...props}  />
  </SideToolbarButton>,
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

  return <div
    style={{
      fontSize: '0.875rem',
      lineHeight: '1.43',
      fontWeight: 400,
      marginLeft: '10px',
      marginRight: '5px',
    }}
  >
    {orderNumber}.
  </div>;
};
