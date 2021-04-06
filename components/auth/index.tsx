import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DisappearedLoading } from 'react-loadingg';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/reducers_registration';
import { getUserAccessAction } from 'pages/access_denied/logic/access_reducer';

type Token = string | null;
const Auth = ({ children, publicPages }) => {
  const path = window.location.pathname;

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const access = useSelector((state: RootState) => state.access);
  const dispatch = useDispatch();

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
  }, [access?.access]);

  const hasAccessPermission = () => {
    const filteredAccess = access?.access?.filter((item) => {
      const isAdmin = item?.role === 'ADMIN';
      const hasPermission = item?.companyID !== null && item?.status === 'ACCEPTED';
      if (hasPermission || isAdmin) {
        // tslint:disable-next-line:no-console
        console.log('hasPermission || isAdmin');

        return true;
      }

      return false;
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

  const checkLogin = async () => {
    const token: Token =  localStorage.getItem('access_token');

    if (!token && path !== '/login') {
      await router.push('/login', '/login.html');
      setLoading(false);

      return;
    }

    setLoading(false);

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
