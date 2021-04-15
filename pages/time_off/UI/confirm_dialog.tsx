import React, { FunctionComponent } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { IconButton, Button, Typography, DialogContent } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';

interface ConfirmDialog {
  handleClose: () => void;
  handleYes?: () => void;
  handleNo?: () => void;
  status: string;
  onOpen: boolean;
}

enum Action {
  ACCEPTED = 'ACCEPT',
  REJECTED = 'REJECT',
  CONTINUE = 'CONTINUE',
  CANCEL = 'CANCEL',
}

type ConfirmDialogType = ConfirmDialog;

export const ConfirmDialog: FunctionComponent<ConfirmDialogType> = ({ onOpen, status, handleClose, handleYes }) => {

  return (
      <Dialog
        open={onOpen}
        onClose={handleClose}
        fullWidth
        maxWidth='sm'
      >
        <DialogTitle>
          <div>
            <Typography style={{ fontWeight: 600 }} variant='subtitle1' color='primary' >
              Confirm
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
          <Typography variant='h6' gutterBottom>
              {`Are you sure you want to ${Action[status]}?`}
          </Typography>
        </DialogContent>
        <DialogActions className='confirm-dialog-actions'>
          <Button className='confirm-dialog--yes-btn' onClick={handleYes} autoFocus>
            <DoneIcon />
          </Button>
          <Button onClick={handleClose} className='confirm-dialog--no-btn'>
            <CloseIcon />
          </Button>
        </DialogActions>
      </Dialog>
  );
};
