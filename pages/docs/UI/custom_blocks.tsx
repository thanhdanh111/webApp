import React from 'react';
import SideToolbarButton from '../../../components/my_editor/side_toolbar_button';
import { EditorBlock, DefaultDraftBlockRenderMap } from 'draft-js';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import Immutable from 'immutable';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ParagraphStyleSideToolbarBtn from './paragraph_style_toolbar_btn';

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

function sildeTextToolbarActions({ onMoveBlockAction, handleOnChangeLineStyle }) {
  const sideToolbarActions = [
    {
      type: 'component',
      component: <ParagraphStyleSideToolbarBtn handleOnChangeLineStyle={handleOnChangeLineStyle} />,
    },
    {
      type: 'normal',
      label: 'Move Up',
      startIcon: <ArrowUpwardIcon />,
      function: () => onMoveBlockAction('UP'),
    },
    {
      type: 'normal',
      label: 'Move Down',
      startIcon: <ArrowDownwardIcon />,
      function: () => onMoveBlockAction('DOWN'),
    },
  ];

  return sideToolbarActions;
}

export const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);

export const UnstyledBlockCustom = (props) => {

  return React.createElement(
    React.Fragment,
    { key: `block-${props?.block?.getKey()}` },
    <SideToolbarButton
      key={props?.block?.getKey()}
      contentBlock={props?.block}
      onClickSideToolbar={props?.blockProps?.onClickSideToolbar}
      actionsNeedToRender={
        sildeTextToolbarActions({
          onMoveBlockAction: props?.blockProps?.onMoveBlockAction,
          handleOnChangeLineStyle: props?.blockProps?.handleOnChangeLineStyle,
        })
      }
      disableProtal={false}
    >
      {undefined}
    </SideToolbarButton>,
    <EditorBlock {...props} />,
  );
};

export const CodeBlockCustom = (props) => React.createElement(
  React.Fragment,
  { key: `block-${props?.block?.getKey()}` },
  <SideToolbarButton
    contentBlock={props?.block}
    key={props?.block?.getKey()}
    onClickSideToolbar={props?.blockProps?.onClickSideToolbar}
    disableProtal={false}
    actionsNeedToRender={
      sildeTextToolbarActions({
        onMoveBlockAction: props?.blockProps?.onMoveBlockAction,
        handleOnChangeLineStyle: props?.blockProps?.handleOnChangeLineStyle,
      })
    }
  >
    {undefined}
  </SideToolbarButton>,
  <EditorBlock {...props} />,
);

export const UnorderedListItemCustom = (props) => React.createElement(
  React.Fragment,
  { key: `block-${props?.block?.getKey()}` },
  <SideToolbarButton
    contentBlock={props?.block}
    key={props?.block?.getKey()}
    onClickSideToolbar={props?.blockProps?.onClickSideToolbar}
    disableProtal={false}
    actionsNeedToRender={
      sildeTextToolbarActions({
        onMoveBlockAction: props?.blockProps?.onMoveBlockAction,
        handleOnChangeLineStyle: props?.blockProps?.handleOnChangeLineStyle,
      })
    }
  >
    <FiberManualRecordIcon style={{ width: '10px', height: '20px', marginLeft: '10px', marginRight: '7px' }} />
  </SideToolbarButton>,
  <EditorBlock {...props} />,
);

export const OrderedListItemCustom = (props) => React.createElement(
  React.Fragment,
  { key: `block-${props?.block?.getKey()}` },
  <SideToolbarButton
    contentBlock={props?.block}
    key={props?.block?.getKey()}
    disableProtal={false}
    onClickSideToolbar={props?.blockProps?.onClickSideToolbar}
    actionsNeedToRender={
      sildeTextToolbarActions({
        onMoveBlockAction: props?.blockProps?.onMoveBlockAction,
        handleOnChangeLineStyle: props?.blockProps?.handleOnChangeLineStyle,
      })
    }
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
