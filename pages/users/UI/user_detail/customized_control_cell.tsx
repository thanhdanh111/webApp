import { IconButton, ClickAwayListener, Popper, MenuItem, Grow,
  Paper, MenuList, ListItemIcon, ListItemText,
} from '@material-ui/core';
import React, { useState } from 'react';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { updateUsersReducer } from 'pages/users/logic/users_actions';
import { useDispatch } from 'react-redux';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

const actions = {
  delete: {
    label: 'Remove from department',
    icon: <RemoveCircleIcon fontSize='small' />,
  },
};

const CustomizedControlCell = (departmentProps) => {
  let actionList: string[] = [];
  const currentDepartmentIndex = departmentProps?.itemIndex;
  const [open, setOpen] = useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const dispatch = useDispatch();

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };

  if (
    departmentProps?.status === 'ACCEPTED' &&
    departmentProps?.userData?.departmentRoles?.[currentDepartmentIndex]?.canRemoveFromDepartment
    ) {
    actionList = ['delete'];
  }

  if (!actionList?.length) {
    return <div />;
  }

  const actionFunc = {
    delete: removeUserFromDepartment,
  };

  function handleReturnActionsList(action, index) {

    return <MenuItem
      onClick={() => actionFunc?.[action]?.(departmentProps?.itemIndex)}
      component='div'
      key={`action-in-users-page-${index}`}
    >
      <ListItemIcon style={{ minWidth: '30px' }}>
        {actions[action].icon}
      </ListItemIcon>
      <ListItemText primary={actions[action].label} />
    </MenuItem>;
  }

  function removeUserFromDepartment(departmentIndex) {

    dispatch(updateUsersReducer({
      onRemovingUser: true,
      editingUserInfo: {
        editingDepartment: departmentProps?.userData?.departmentRoles?.[departmentIndex],
        userData: departmentProps?.userData?.user,
        userIndex: departmentProps?.userIndex,
        removeUserFrom: 'department',
        userName: departmentProps?.userData?.userName,
      },
    }));
  }

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

export default CustomizedControlCell;
