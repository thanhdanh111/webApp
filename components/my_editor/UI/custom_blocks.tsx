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
});

export const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);

export const UnstyledBlockCustom = (props) => React.createElement(
  React.Fragment,
  { key: 'unstyled-block-custom' },
  <SideToolBarButton />,
  <EditorBlock {...props} />,
);

export const CodeBlockCustom = (props) => React.createElement(
  React.Fragment,
  { key: 'code-block-custom' },
  <SideToolBarButton />,
  <EditorBlock {...props} />,
);

export const UnorderedListItemCustom = (props) => React.createElement(
  React.Fragment,
  { key: 'unordered-list-item' },
  <SideToolBarButton />,
  <FiberManualRecordIcon style={{ width: '10px', height: '10px', marginRight: '10px' }} />,
  <EditorBlock {...props} />,
);
