import React from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Button } from '@material-ui/core';

const SideToolBarButton = () => {

  return  <div className='block-wrapper--btns'>
    <Button
      component='div'
      className='block-wrapper--btn'
    >
      <MoreVertIcon className='block-wrapper--icon' />
    </Button>
  </div>;
};

export default SideToolBarButton;
