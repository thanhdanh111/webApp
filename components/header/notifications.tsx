import { Badge, Button, IconButton, Menu, MenuItem, Typography } from '@material-ui/core';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import React, { useEffect } from 'react';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { useDispatch, useSelector } from 'react-redux';
import { getNotificationMiddleware } from 'pages/users/logic/users_reducer';
import NotificationItemUI from './notification_detail';
import { RootState } from 'redux/reducers_registration';
import InfiniteScroll from 'react-infinite-scroll-component';
import { UsersData } from 'helpers/type';
import { DisappearedLoading } from 'react-loadingg';

const NotificationsUI = () => {
  const dispatch = useDispatch();
  const { notifications, loadingList, hasNoData  }: UsersData = useSelector((state: RootState) => state.users);
  const userID = useSelector((state: RootState) => state?.auth?.userID);
  const emptyState = !loadingList && !notifications?.list?.length && hasNoData;

  useEffect(() => {
    return void fetchData();
  }, [userID]);

  const fetchData = () => {
    dispatch(getNotificationMiddleware(userID));
  };

  const generatedData = () => {

    if (!notifications?.list?.length && hasNoData) {
      return (
        <div className='empty-state'>
            <img alt='logo' width='100px' src='../document.svg'/>
            <Typography color='textSecondary' className='empty-state--text'>Not found any notifications</Typography>
        </div>
      );
    }

    const generateNotification = notifications.list.map((item) => {
      return (
        <NotificationItemUI key={item._id} {...item}/>
      );
    });

    return generateNotification;
  };

  return (
    <PopupState variant='popover' popupId='demo-popup-menu'>
    {(popupState) => (
        <React.Fragment>
        <Button variant='contained' color='primary' {...bindTrigger(popupState)} className='drop-notification'>
            <IconButton aria-label='notification'>
                <Badge badgeContent={notifications.totalUnread ? notifications.totalUnread : 0} color='error'>
                    <NotificationsIcon className='btn-appbar'/>
                </Badge>
            </IconButton>
        </Button>
        <Menu {...bindMenu(popupState)} className='menu-drop-notification'>
            <MenuItem className='label-notification'>
                <Typography className='div-label-notification'>
                    Notifications
                </Typography>
            </MenuItem>
            <InfiniteScroll
              dataLength={notifications.list.length}
              hasMore={notifications.list.length < notifications.totalCount}
              next={fetchData}
              loader={<DisappearedLoading color={'#67cb48'}/>}
              scrollThreshold={0.7}
              height={(emptyState || loadingList) ? 0 : 500}
            >
            {generatedData()}
            </InfiniteScroll>
        </Menu>
        </React.Fragment>
    )}
    </PopupState>
  );
};

export default NotificationsUI;
