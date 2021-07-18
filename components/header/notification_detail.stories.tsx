import { storiesOf } from '@storybook/react'
import React from 'react'
import NotificationItemUI from './notification_detail'

storiesOf('Header', module).add('Header', () => {
  return(
  <NotificationItemUI
    _id=''
    body=''
    isRead={false}
    title=''
    clickAction=''
    targetEntityName=''
    targetID=''
    companyID=''
    createdAt=''
    event=''
    receiverUID=''
  />)
})
