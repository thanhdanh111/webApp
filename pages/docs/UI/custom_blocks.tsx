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
      component: <ParagraphStyleSideToolbarBtn
        key='menu-item-index-0'
        handleOnChangeLineStyle={handleOnChangeLineStyle}
      />,
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
      disableProtal={false}
      children={undefined}
      actionsNeedToRender={
        sildeTextToolbarActions({
          onMoveBlockAction: props?.blockProps?.onMoveBlockAction,
          handleOnChangeLineStyle: props?.blockProps?.handleOnChangeLineStyle,
        })
      }
    />,
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
    children={undefined}
    actionsNeedToRender={
      sildeTextToolbarActions({
        onMoveBlockAction: props?.blockProps?.onMoveBlockAction,
        handleOnChangeLineStyle: props?.blockProps?.handleOnChangeLineStyle,
      })
    }
  />,
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
    children={
      <FiberManualRecordIcon
        style={{
          width: '10px',
          height: '20px',
          marginLeft: '10px',
          marginRight: '7px',
        }}
      />
    }
    actionsNeedToRender={
      sildeTextToolbarActions({
        onMoveBlockAction: props?.blockProps?.onMoveBlockAction,
        handleOnChangeLineStyle: props?.blockProps?.handleOnChangeLineStyle,
      })
    }
  />,
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
    children={<IndexElement {...props}  />}
    actionsNeedToRender={
      sildeTextToolbarActions({
        onMoveBlockAction: props?.blockProps?.onMoveBlockAction,
        handleOnChangeLineStyle: props?.blockProps?.handleOnChangeLineStyle,
      })
    }
  />,
  <EditorBlock {...props} />,
);

export const MediaBlockComponent = (props) =>  {
  const entityKey = props?.block?.getEntityAt(0);
  if (!entityKey) {

    return <div />;
  }

  const entity = props?.contentState?.getEntity(entityKey);

  return React.createElement(
    React.Fragment,
    { key: `block-${props?.block?.getKey()}` },
    <SideToolbarButton
      key={props?.block?.getKey()}
      contentBlock={props?.block}
      onClickSideToolbar={props?.blockProps?.onClickSideToolbar}
      disableProtal={false}
      children={undefined}
      actionsNeedToRender={
        sildeTextToolbarActions({
          onMoveBlockAction: props?.blockProps?.onMoveBlockAction,
          handleOnChangeLineStyle: props?.blockProps?.handleOnChangeLineStyle,
        })
      }
    />,
    <Image
      src={entity?.getData()?.url}
    />,
  );
};

const Image = ({ src }) => {
  const defaultHeight = 480;
  const defaultWidth = 600;

  return <img
    src={src ?? ''}
    style={{
      width: `${defaultWidth}px`,
      height: `${defaultHeight}`,
      marginLeft: '18px',
    }}
  />;
};

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
