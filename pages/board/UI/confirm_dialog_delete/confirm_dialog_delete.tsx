import Dialog from '@material-ui/core/Dialog';
import React, { FC } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, DialogActions, DialogContent, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

interface InitialProps {
  open: boolean;
  onClose: () => void;
  handleDelete?: () => void;
}

const ConfirmDialogDelete: FC<InitialProps> = (props: InitialProps) => {

  const { onClose, open, handleDelete }: InitialProps = props;

  return (
    <Dialog
      fullWidth
      maxWidth='sm'
      open={open}
      onClose={onClose}
    >
      <DialogTitle>
        <div>
          <Typography style={{ fontWeight: 600 }} variant='subtitle1' color='primary' >
            Confirm
          </Typography>
          <IconButton
            onClick={onClose}
            className='confirm-delete--close-btn'
            color='primary'
          >
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent>
        <Typography variant='h6' gutterBottom>
          Are you sure you want to delete this board?
        </Typography>
      </DialogContent>

      <DialogActions className='confirm-delete-actions'>
        <Button className='confirm-delete--yes-btn' onClick={handleDelete} >
          DELETE
        </Button>
        <Button onClick={onClose} className='confirm-delete--no-btn'>
          CANCEL
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialogDelete;
