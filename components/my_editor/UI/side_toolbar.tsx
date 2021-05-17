import React from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Button, ClickAwayListener, Paper,
  Popper, MenuList,
} from '@material-ui/core';
import ParagraphStyleSideToolbarBtn from './paragraph_style_toolbar_btn';

const SideToolBarButton = ({ handleOnChangeLineStyle, contentBlock, onClickSideToolbar }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handlePopperOpen = (event: React.MouseEvent<HTMLElement>) => {
    onClickSideToolbar(contentBlock);

    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return <>
    <div
      className='block-wrapper--btns'
    >
      <Button
        component='div'
        className='block-wrapper--btn'
        aria-describedby={open ? 'sideToolbar' : undefined}
        onClick={handlePopperOpen}
      >
        <MoreVertIcon className='block-wrapper--icon' />
      </Button>

      <Popper
        id='sideToolbar'
        className='side-toolbar-wrapper'
        open={open}
        anchorEl={anchorEl}
        role={undefined}
      >
        <Paper>
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList>
                <ParagraphStyleSideToolbarBtn
                  handleOnChangeLineStyle={handleOnChangeLineStyle}
                />
              </MenuList>
            </ClickAwayListener>
          </Paper>
      </Popper>

    </div>
  </>;
};

export default SideToolBarButton;
