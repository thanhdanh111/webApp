import React, { FunctionComponent, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TaskStatusNotificationUI from 'pages/home/UI/notification_content/clickup';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, Container, MenuItem, Typography } from '@material-ui/core';
import moment from 'moment';
import { NotificationTypeState } from 'helpers/type';
import UserAvatar from '@components/user_avatar/info_user';

const NotificationItemUI: FunctionComponent<NotificationTypeState> = (props: NotificationTypeState) => {
  const [open, setOpen] = useState(false);
  const name = props.createdBy && `${props?.createdBy.firstName} ${props?.createdBy.lastName}`;
  const time = moment(props.createdAt).format('DD/MM/YYYY HH:mm');
  const read = props.isRead ? 'read' : 'unread';

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <MenuItem className={`${read} item-drop action-drop item-switch`} color='primary' onClick={handleClickOpen}>
        <div className='notification-info'>
          <Container className='notification-info-img'>
              {props.createdBy ? <UserAvatar style='notification-img' alt='notification user' user={props.createdBy} /> : ''}
          </Container>
          <Container className='notification-content'>
              <Typography className='text-notification' component='div'>
              <span className='user-create-notification'>{name}</span> created {props.title}
              </Typography>
              <Typography >{time}</Typography>
          </Container>
        </div>
      </MenuItem>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Notification {props.event} detail ({props.body})</DialogTitle>
        <DialogContent>
          <TaskStatusNotificationUI taskStatusID={props.targetID} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NotificationItemUI;
