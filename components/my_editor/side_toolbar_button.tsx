import React from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Button, ClickAwayListener, Paper,
  Popper, MenuList, MenuItem, ListItemIcon, Typography,
} from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ParagraphStyleSideToolbarBtn from 'pages/docs/UI/paragraph_style_toolbar_btn';

const SideToolbarButton = ({ handleOnChangeLineStyle, contentBlock, onClickSideToolbar, onMoveBlockAction }) => {
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
              <MenuItem
                className='side-toolbar--menu-item'
                component='div'
                onClick={() => onMoveBlockAction('UP')}
              >
                <ListItemIcon className='side-toolbar--menu-icon'>
                  <ArrowUpwardIcon />
                </ListItemIcon>
                <Typography variant='inherit'>
                  Move Up
                </Typography>
              </MenuItem>

              <MenuItem
                className='side-toolbar--menu-item'
                component='div'
                onClick={() => onMoveBlockAction('DOWN')}
              >
                <ListItemIcon className='side-toolbar--menu-icon'>
                  <ArrowDownwardIcon />
                </ListItemIcon>
                <Typography variant='inherit'>
                  Move Down
                </Typography>
              </MenuItem>

              </MenuList>
            </ClickAwayListener>
          </Paper>
      </Popper>

    </div>
  </>;
};

export default SideToolbarButton;
