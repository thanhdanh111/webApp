import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import FolderSharedIcon from '@material-ui/icons/FolderShared'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Grid, IconButton, Typography, Input, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder'

const CreateNewProjectDialog = ({ handleCreate })  => {
  const [state, setState] = React.useState({
    openDialog: false,
    name: '',
  })

  const handleClickOpen = () => {
    setState({ ...state, openDialog: true })
  }

  const handleClose = () => {
    setState({ ...state, openDialog: false })
  }

  return (
    <>
    <ListItem
      className='docs-drawer--add-new-project'
      button
      onClick={handleClickOpen}
      disableGutters
    >
      <ListItemIcon>
        <CreateNewFolderIcon />
      </ListItemIcon>
      <ListItemText primary='New Project' />
    </ListItem>
      <Dialog
        open={state.openDialog}
        onClose={handleClose}
        className='docs-drawer--new-project-dialog'
        aria-labelledby='form-dialog-title'
        maxWidth='xs'
        fullWidth
      >
          <DialogTitle>
            <div>
              <Typography style={{ fontWeight: 600 }} variant='subtitle1' color='primary' >
                New Project
              </Typography>
              <IconButton
                onClick={handleClose}
                className='confirm-dialog--close-btn'
                color='primary'
              >
                <CloseIcon />
              </IconButton>
            </div>
          </DialogTitle>
        <DialogContent>
          <Grid container spacing={1} alignItems='flex-end' >
            <Grid item>
              <FolderSharedIcon />
            </Grid>
            <Grid item>
              <Input
                disableUnderline
                autoFocus
                fullWidth
                placeholder='Name'
                onChange={(event) => state.name = event?.target?.value}
              />
            </Grid>
          </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              style={{ color: '#f44336' }}
              onClick={handleClose}
              className='primary-red-btn'
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleCreate(state.name, handleClose)}
              color='secondary'
            >
              Create
            </Button>
          </DialogActions>
      </Dialog>
    </>
  )
}

export default CreateNewProjectDialog
