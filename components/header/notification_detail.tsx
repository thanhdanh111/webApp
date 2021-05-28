import React, { FunctionComponent, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import {  Button, Container, MenuItem, Typography } from '@material-ui/core';
import moment from 'moment';
import { NotificationTypeState } from 'helpers/type';
import UserAvatar from '@components/user_avatar/info_user';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { updateUnreadNotificationMiddleware } from 'pages/users/logic/users_reducer';

import { isAdminOrManagerUser } from 'helpers/check_role_user';
import { getEntityName } from 'helpers/check_type_entity_name';

const NotificationItemUI: FunctionComponent<NotificationTypeState> = (props: NotificationTypeState) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const name = props.createdBy && `${props?.createdBy.firstName} ${props?.createdBy.lastName}`;
  const time = moment(props.createdAt).format('DD/MM/YYYY HH:mm');
  const notificationID = props._id;

  const read = props.isRead ? 'read' : 'unread';
  const authState = useSelector((state: RootStateOrAny) => state.auth);
  const companyID = authState.extendedCompany?.companyID?._id;
  const departmentID = authState.department?._id;
  const checkRole = isAdminOrManagerUser(authState.access, companyID, departmentID);
  const handleClickOpen = () => {
    dispatch(updateUnreadNotificationMiddleware(notificationID, true));
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return(
    <div>
      <MenuItem
        className={`${read} item-drop action-drop item-switch`}
        color='primary'
        onClick={handleClickOpen}
      >
        <div className='notification-info'>
          <Container className='notification-info-img'>
            {props.createdBy ? <UserAvatar style='notification-img' alt='notification user' user={props.createdBy} /> : ''}
          </Container>
          <Container className='notification-content'>
            <Typography className='text-notification' component='div'>
              <span className='user-create-notification'>{name}</span> created {props.title} {time}
            </Typography>
            {/* day off role */}
            { checkRole ?
              <div className='notification-detail-btn'>
                <Button className='notification-btn' variant='contained' color='secondary'>Accept</Button>
                <Button className='notification-btn-reject' variant='contained' >Reject</Button>
              </div>
              : null
            }
          </Container>
        </div>
      </MenuItem>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        {getEntityName(props)}
      </Dialog>
    </div>
  );
};

export default NotificationItemUI;
