import { ClickAwayListener, Grow, IconButton, Paper, Popper, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import FilterNoneIcon from '@material-ui/icons/FilterNone';
import FilterTaskContentUI from './filter_task_popup_content';

const FilterTaskPopupUI: React.FC = () => {
  const [open, setOpen] = useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <IconButton
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup='true'
        onClick={handleToggle}
        className='action-status-btn'
      >
        <div className='action action-filter'>
          <FilterNoneIcon className='action-icon filter-icon' />
          <Typography className='action-text text-filter'>
            Filter
          </Typography>
        </div>
      </IconButton>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition className='popper-action-status' >
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            style={{  transformOrigin: 'top bottom' }}
          >
            <Paper style={{ zIndex: 300 }}>
              <ClickAwayListener onClickAway={handleClose}>
                <FilterTaskContentUI />
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};

export default FilterTaskPopupUI;
