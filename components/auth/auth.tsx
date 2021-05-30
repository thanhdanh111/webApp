import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DisappearedLoading } from 'react-loadingg';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/reducers_registration';
import { getUserAccessAction } from 'pages/access_denied/logic/access_reducer';
import { getBrowserToken } from 'helpers/fcm';
import firebase from 'firebase/app';
import 'firebase/messaging';
import { useSnackbar, WithSnackbarProps } from 'notistack';
import axios from 'axios';
import { config } from 'helpers/get_config';
import { getNotificationFCM } from 'pages/users/logic/users_actions';
import { checkOnlyTrueInArray } from 'helpers/check_only_true';
import { Roles } from 'constants/roles';

type Token = string | null;
const Auth = ({ children, publicPages, managerPages }) => {
  const path = window.location.pathname;
  const auth = useSelector((state: RootState) => state.auth);
  let isManager = false;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const access = useSelector((state: RootState) => state.access);
  const dispatch = useDispatch();
  const { enqueueSnackbar }: WithSnackbarProps = useSnackbar();

  useEffect(() => {
    void checkLogin();
  }, []);

  useEffect(() => {
    dispatch(getUserAccessAction());
  }, [path]);

  useEffect(() => {
    const hasPermission = hasAccessPermission();
    if (hasPermission || access?.access.length <= 0) {
      return;
    }
    checkAccessUser();
    checkManagerAccess();
  }, [access?.access]);

  const getFCMToken = async () => {
    const fcmToken = await getBrowserToken();
    const token: Token =  localStorage.getItem('access_token');
    if (!fcmToken || !token) {
      return;
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
    );

    if (subscribe.data) {
      const messaging = firebase.messaging();
      messaging.onMessage((payload) => {
        // tslint:disable-next-line:no-console
        console.log('payload', payload);
        const noti = payload.notification;

        dispatch(getNotificationFCM(noti));
        enqueueSnackbar(`${noti.title}: ${noti.body.substring(0, 30)}...`, { variant: 'info' });
      });
    }

    return;
  };

  const hasAccessPermission = () => {
    const filteredAccess = access?.access?.filter((item) => {
      const isAdmin = item?.role === 'ADMIN';
      const hasPermission = item?.companyID !== null && item?.status === 'ACCEPTED';
      if (!hasPermission && !isAdmin) {

        return false;
      }

      isManager = checkOnlyTrueInArray({
        conditionsArray: [
          item?.companyID === auth?.extendedCompany?.companyID?._id,
          item?.role ===  Roles.COMPANY_MANAGER ||
          item?.role === Roles.DEPARTMENT_MANAGER,
        ],
      });

      return true;
    });

    if (filteredAccess.length <= 0) {
      return false;
    }

    return true;
  };

  const checkAccessUser = () => {
    if (publicPages.includes(path)) {
      return;
    }

    void router.replace('/access_denied', '/access_denied.html');
  };

  const checkManagerAccess = () => {
    if (!managerPages.includes(path) || isManager) {
      return;
    }

    void router.replace('/access_denied', '/access_denied.html');
  };

  const checkLogin = async () => {
    const token: Token =  localStorage.getItem('access_token');

    if (!token && path !== '/login') {
      await router.push('/login', '/login.html');
      setLoading(false);

      return;
    }

    setLoading(false);
    await getFCMToken();

    return;
  };

  if (loading) {
    return <DisappearedLoading color={'#67cb48'} />;
  }

  return (
    <>
        {children}
    </>
  );
};

export default Auth;
