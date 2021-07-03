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
  status?: string;
  onOpen: boolean;
  title?: string;
  warning?: string;
  loading?: boolean;
}

enum Action {
  ACCEPTED = 'ACCEPT',
  REJECTED = 'REJECT',
  CONTINUE = 'CONTINUE',
  CANCEL = 'CANCEL',
  REMOVE = 'REMOVE',
}

type ConfirmDialogType = ConfirmDialog;

export const ConfirmDialog: FunctionComponent<ConfirmDialogType> = ({
  onOpen,
  status = 'CONTINUE',
  handleClose,
  handleYes,
  title,
  warning,
  loading = false,
}) => {

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
              {title ?? 'Confirm'}
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
              {warning ?? `Are you sure you want to ${Action[status]}?`}
          </Typography>
        </DialogContent>
        <DialogActions className='confirm-dialog-actions'>
          <Button
            disabled={loading}
            className={loading ? '' : 'confirm-dialog--yes-btn'}
            onClick={handleYes}
            autoFocus
          >
            <DoneIcon />
          </Button>
          <Button
            disabled={loading}
            onClick={handleClose}
            className={loading ? '' : 'confirm-dialog--no-btn'}
          >
            <CloseIcon />
          </Button>
        </DialogActions>
      </Dialog>
  );
};
