import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { DisappearedLoading } from 'react-loadingg'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'redux/reducers_registration'
import { getBrowserToken } from 'helpers/fcm'
import firebase from 'firebase/app'
import 'firebase/messaging'
import { pushNewNotifications } from 'redux/common/notifications/reducer'
import axios from 'axios'
import { config } from 'helpers/get_config'
import { getNotificationFCM } from 'pages/users/logic/users_actions'
import { GetUserDataThunkAction } from 'pages/login/logic/login_reducer'

type Token = string | null

const Auth = ({ children, publicPages }) => {
  const path = window.location.pathname
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const access = useSelector((state: RootState) => state?.userInfo?.access)
  const dispatch = useDispatch()

  useEffect(() => {
    void checkLogin()
  }, [])

  useEffect(() => {
    const hasPermission = hasAccessPermission()
    if (hasPermission || access?.length <= 0) {
      return
    }

    checkAccessUser()
  }, [access])

  const getFCMToken = async () => {
    const fcmToken = await getBrowserToken()
    const token: Token =  localStorage.getItem('access_token')
    if (!fcmToken || !token) {
      return
    }

    const subscribe = await axios.post(`${config.BASE_URL}/users/me/fcm/subscribe`,
      {
        token: fcmToken,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (subscribe.data) {
      const messaging = firebase.messaging()
      messaging.onMessage((payload) => {
        const noti = payload.notification

        dispatch(getNotificationFCM(noti))
        dispatch(pushNewNotifications({ variant: 'info' , message: `${noti.title}: ${noti.body.substring(0, 30)}...` }))
      })
    }

    return
  }

  const hasAccessPermission = () => {
    const filteredAccess = access?.filter((item) => {
      const isAdmin = item?.role === 'ADMIN'
      const hasPermission = item?.companyID !== null && item?.status === 'ACCEPTED'
      if (hasPermission || isAdmin) {

        return true
      }

      return false
    })

    if (filteredAccess?.length <= 0) {
      return false
    }

    return true
  }

  const checkAccessUser = () => {
    if (publicPages.includes(path)) {

      return
    }

    void router.replace('/access_denied', '/access_denied.html')
  }

  const checkLogin = async () => {
    const token: Token =  localStorage.getItem('access_token')

    if (!token && path !== '/login') {
      void router.push('/login', '/login.html')
      setLoading(false)

      return
    }

    await Promise.resolve(dispatch(GetUserDataThunkAction(token)))

    await getFCMToken()

    setLoading(false)

    return
  }

  if (loading) {
    return <DisappearedLoading color={'#67cb48'} />
  }

  return (
    <>
      {children}
    </>
  )
}

export default Auth
