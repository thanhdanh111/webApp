import { Badge, IconButton, Menu, Typography } from '@material-ui/core'
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state'
import React, { useEffect } from 'react'
import NotificationsIcon from '@material-ui/icons/Notifications'
import { useDispatch, useSelector } from 'react-redux'
import { getNotificationMiddleware } from 'pages/users/logic/users_reducer'
import NotificationItemUI from './notification_detail'
import { RootState } from 'redux/reducers_registration'
import InfiniteScroll from 'react-infinite-scroll-component'
import { UsersData } from 'helpers/type'
import { DisappearedLoading } from 'react-loadingg'

const NotificationsUI = () => {
  const dispatch = useDispatch()
  const { notifications, hasNoData }: UsersData = useSelector((state: RootState) => state.users)
  const badgeContent = (notifications.totalUnread) ? notifications.totalUnread : 0

  useEffect(() => {
    void fetchData()
  }, [])

  const fetchData = () => {
    dispatch(getNotificationMiddleware())
  }
  const generatedData = () => {

    if (!notifications?.list?.length && hasNoData) {
      return (
        <div className='empty-state'>
            <img alt='logo' width='100px' src='../document.svg'/>
            <Typography color='textSecondary' className='empty-state--text'>Not found any notifications</Typography>
        </div>
      )
    }

    const generateNotification = notifications.list.map((item) => {
      return (
        <NotificationItemUI key={item?._id} {...item}/>
      )
    })

    return generateNotification
  }

  return (
    <PopupState variant='popover' popupId='demo-popup-menu'>
    {(popupState) => (
        <React.Fragment>
        <IconButton aria-label='notification' {...bindTrigger(popupState)}>
            <Badge badgeContent={badgeContent} color='error'>
                <NotificationsIcon className='btn-appbar'/>
            </Badge>
        </IconButton>
        <Menu variant='menu' {...bindMenu(popupState)} className='menu-drop-notification' autoFocus={false}>
          <Typography className='div-label-notification'>
            Notifications
          </Typography>
          <InfiniteScroll
            dataLength={notifications.list.length}
            hasMore={notifications.list.length < notifications.totalCount}
            next={fetchData}
            loader={<DisappearedLoading color={'#67cb48'}/>}
            scrollThreshold={0.8}
            height={500}
          >
            {generatedData()}
          </InfiniteScroll>
        </Menu>
        </React.Fragment>
    )}
    </PopupState>
  )
}

export default NotificationsUI
