import { ClickAwayListener, Grow, IconButton, ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Popper } from '@material-ui/core';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import CreateIcon from '@material-ui/icons/Create';
import { deletedTaskStatusThunkAction } from 'pages/task_boards/logic/task_boards_reducer';

const actions = {
  delete: {
    label: 'Remove status',
    icon: <RemoveCircleIcon fontSize='small' className='remove-status-icon'/>,
  },
  rename: {
    label: 'Rename status',
    icon: <CreateIcon  fontSize='small' className='rename-status-icon'/>,
  },
};

interface InitialProps {
  taskStatusID: string;
}

const ActionTaskStatusUI = (props: InitialProps) => {
  const { taskStatusID }: InitialProps = props;
  const [open, setOpen] = useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const dispatch = useDispatch();
  const actionList = ['delete', 'rename'];

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleRemoveStatus = () => {
    dispatch(deletedTaskStatusThunkAction(taskStatusID));
  };

  const actionFunc = {
    delete: handleRemoveStatus,
    rename: () => {
      //
    },
  };

  function handleReturnActionsList(action, index) {
    return <MenuItem
      onClick={() => actionFunc?.[action]?.()}
      component='div'
      key={`action-in-users-page-${index}`}
    >
      <ListItemIcon style={{ minWidth: '30px' }}>
        {actions[action]?.icon}
      </ListItemIcon>
      <ListItemText primary={actions[action]?.label} />
    </MenuItem>;
  }

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
      >
        <MoreHorizIcon />
      </IconButton>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition >
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            style={{  transformOrigin: 'top bottom' }}
          >
            <Paper style={{ zIndex: 300 }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} id='menu-list-grow' >
                  {actionList.map(handleReturnActionsList)}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};

export default (ActionTaskStatusUI);
