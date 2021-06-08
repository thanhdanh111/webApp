import { IconButton, ClickAwayListener, Popper, MenuItem, Grow,
  Paper, MenuList, ListItemIcon, ListItemText,
} from '@material-ui/core';
import React, { useState } from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { updateUsersReducer } from 'pages/users/logic/users_actions';
import { useDispatch } from 'react-redux';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

const actionIcons = {
  delete: <RemoveCircleIcon fontSize='small' />,
};

const CustomizedReturnActionComponent = (departmentProps) => {
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
    departmentProps?.userData?.departmentRoles?.[currentDepartmentIndex]?.canDelete
    ) {
    actionList = ['delete'];
  }

  if (!actionList?.length) {
    return <div />;
  }

  const actionFunc = {
    delete: removeUserFromDepartment,
  };

  function handleReturnActionsList(action) {

    return <MenuItem
      onClick={() => actionFunc?.[action]?.(departmentProps?.itemIndex)}
      component='div'
    >
      <ListItemIcon style={{ minWidth: '30px' }}>
        {actionIcons[action]}
      </ListItemIcon>
      <ListItemText style={{ textTransform: 'capitalize' }} primary={action} />
    </MenuItem>;
  }

  function removeUserFromDepartment(departmentIndex) {

    dispatch(updateUsersReducer({
      onRemovingUser: true,
      editingUserInfo: {
        ...departmentProps?.userData,
        departmentName: departmentProps?.userData?.departmentRoles?.[departmentIndex]?.departmentName,
        departmentID: departmentProps?.userData?.departmentRoles?.[departmentIndex]?.departmentID,
        accessID: departmentProps?.userData?.departmentRoles?.[departmentIndex]?._id,
        userIndex: departmentProps?.userData?.index,
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
        <MoreVertIcon />
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

export default CustomizedReturnActionComponent;
