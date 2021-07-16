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

function sildeTextToolbarActions({ onMoveBlockAction, handleOnChangeLineStyle, readOnly, contentBlock }) {
  const sideToolbarActions = [
    {
      type: 'component',
      disabled: readOnly,
      component: <ParagraphStyleSideToolbarBtn
        contentBlock={contentBlock}
        readOnly={readOnly}
        key='menu-item-index-0'
        handleOnChangeLineStyle={handleOnChangeLineStyle}
      />,
    },
    {
      type: 'normal',
      label: 'Move Up',
      disabled: readOnly,
      startIcon: <ArrowUpwardIcon />,
      function: () => onMoveBlockAction('UP', contentBlock),
    },
    {
      type: 'normal',
      label: 'Move Down',
      disabled: readOnly,
      startIcon: <ArrowDownwardIcon />,
      function: () => onMoveBlockAction('DOWN', contentBlock),
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
          readOnly: props?.blockProps?.readOnly,
          contentBlock: props?.block,
        })
      }
    />,
    <EditorBlock {...props} />,
  );
};

export const CheckedListBlockCustom = (props) => {

  return React.createElement(
    React.Fragment,
    { key: `block-${props?.block?.getKey()}` },
    <SideToolbarButton
      key={props?.block?.getKey()}
      contentBlock={props?.block}
      onClickSideToolbar={props?.blockProps?.onClickSideToolbar}
      disableProtal={false}
      children={<CheckListItem {...props} />}
      actionsNeedToRender={
        sildeTextToolbarActions({
          onMoveBlockAction: props?.blockProps?.onMoveBlockAction,
          handleOnChangeLineStyle: props?.blockProps?.handleOnChangeLineStyle,
          readOnly: props?.blockProps?.readOnly,
          contentBlock: props?.block,
        })
      }
    />,
    <div>
      <EditorBlock {...props} />
    </div>,
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
        readOnly: props?.blockProps?.readOnly,
        contentBlock: props?.block,
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
        readOnly: props?.blockProps?.readOnly,
        contentBlock: props?.block,
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
        readOnly: props?.blockProps?.readOnly,
        contentBlock: props?.block,
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
          readOnly: props?.blockProps?.readOnly,
          contentBlock: props?.block,
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
    contentEditable={false}
    style={{
      width: `${defaultWidth}px`,
      height: `${defaultHeight}`,
      marginLeft: '18px',
    }}
  />;
};

const IndexElement = (props) => {
  const currentContentBlock = props.block;
  let currentKey = currentContentBlock.getKey();
  const contentState = props.contentState;
  let orderNumber = 1;

  if (!currentContentBlock || !contentState) {
    return <div
      contentEditable={false}
      className='custom-block--index-element'
    >
      {orderNumber}.
    </div>;
  }

  while (true) {
    const contentBlockBefore = contentState?.getBlockBefore(currentKey);
    const blockTypeOfBefore = contentBlockBefore?.getType();

    if (blockTypeOfBefore !== 'ordered-list-item') {
      break;
    }

    currentKey = contentBlockBefore.getKey();
    orderNumber = orderNumber + 1;
  }

  return <div
    contentEditable={false}
    className='custom-block--index-element'
  >
    {orderNumber}.
  </div>;
};

const CheckListItem = (props) => {

  return (
    <input
      type='checkbox'
      key={`checkable-list-item-${props?.block?.getKey()}`}
      contentEditable={false}
      id={props.offsetKey}
      data-offset-key={props.offsetKey}
    />
  );
};
