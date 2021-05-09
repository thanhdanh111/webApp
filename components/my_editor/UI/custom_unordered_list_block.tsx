import React from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Button } from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { EditorBlock } from 'draft-js';

const UnorderedListBlock = (props) => {

  return <div className='toolbar-wrapper-block'>
    <div className='toolbar-wrapper-block--btns'>
      <Button
        component='div'
        className='toolbar-wrapper-block--btn'
      >
        <MoreVertIcon className='toolbar-wrapper-block--icon' />
      </Button>
    </div>
    <FiberManualRecordIcon style={{ width: '10px', height: '10px', marginRight: '10px' }} />
    <EditorBlock {...props} />
  </div>;
};

export default UnorderedListBlock;
