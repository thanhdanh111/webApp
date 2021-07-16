import React from 'react';
import { ListItemIcon, MenuItem, Popper, Typography } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { changeLineStyleButons } from 'constants/toolbar_docs';
import TextFieldsIcon from '@material-ui/icons/TextFields';

const ParagraphStyleSideToolbarBtn = ({ handleOnChangeLineStyle, readOnly, contentBlock }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const lists = () => {
    return changeLineStyleButons.map((button, index) =>
      <div
        key={`list-item-${index}`}
        className='paragraph-style-toolbar--list-item'
        onClick={() => handleOnChangeLineStyle(button.functionality, contentBlock)}
      >
        <div className='paragraph-style-toolbar--list-icon'>
          {button.icon}
        </div>
          {button.name}
      </div>,
    );
  };

  return (
    <div>
      <MenuItem
        aria-describedby={Boolean(anchorEl) ? 'paragraphStyleToolbarPopper' : undefined}
        onMouseEnter={handlePopoverOpen}
        aria-owns='paragraphStyleToolbarPopper'
        className='side-toolbar--menu-item'
        component='div'
        disabled={readOnly}
      >
        <ListItemIcon className='side-toolbar--menu-icon'>
          <TextFieldsIcon />
        </ListItemIcon>
        <Typography variant='inherit'>
          Paragraph style
        </Typography>
        <NavigateNextIcon className='side-toolbar--menu-right-icon' />
      </MenuItem>

      <Popper
        className='paragraph-style-popover'
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        role={undefined}
        placement='right-start'
        id='paragraphStyleToolbarPopper'
      >
        <div className='paragraph-style-popover--paper'>
          <div className='paragraph-style-toolbar'>
            {lists()}
          </div>
        </div>
      </Popper>

    </div>
  );
};

export default ParagraphStyleSideToolbarBtn;
