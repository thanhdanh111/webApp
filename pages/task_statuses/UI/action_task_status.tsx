import { ClickAwayListener, Grow, IconButton, ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Popper } from '@material-ui/core'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'
import CreateIcon from '@material-ui/icons/Create'
import { deletedStatusThunkAction } from '../logic/task_statuses_reducer'

const actions = {
  delete: {
    label: 'Remove status',
    icon: <RemoveCircleIcon fontSize='small' className='remove-status-icon'/>,
  },
  rename: {
    label: 'Rename status',
    icon: <CreateIcon  fontSize='small' className='rename-status-icon'/>,
  },
}

interface InitialProps {
  taskStatusID: string
  setRenameStatus: () => void
}

const ActionTaskStatusUI = (props: InitialProps) => {
  const { taskStatusID, setRenameStatus }: InitialProps = props
  const [open, setOpen] = useState(false)
  const anchorRef = React.useRef<HTMLButtonElement>(null)
  const dispatch = useDispatch()
  const actionList = ['delete', 'rename']

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleRemoveStatus = () => {
    dispatch(deletedStatusThunkAction(taskStatusID))
  }

  const actionFunc = {
    delete: handleRemoveStatus,
    rename: (event) => {
      setRenameStatus()
      handleClose(event)
    },
  }

  function handleReturnActionsList(action, index) {
    return <MenuItem
      onClick={(event) => actionFunc?.[action]?.(event)}
      component='div'
      key={`action-in-users-page-${index}`}
      className={`${action}-status-menu-item`}
    >
      <ListItemIcon style={{ minWidth: '30px' }}>
        {actions[action]?.icon}
      </ListItemIcon>
      <ListItemText primary={actions[action]?.label} />
    </MenuItem>
  }

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  return (
    <div>
      <IconButton
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup='true'
        onClick={handleToggle}
        className='action-status-btn'
      >
        <MoreHorizIcon />
      </IconButton>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition className='popper-action-status' >
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
  )
}

export default (ActionTaskStatusUI)
