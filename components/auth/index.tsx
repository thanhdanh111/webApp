import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DisappearedLoading } from 'react-loadingg';

type Token = string | null;
const Auth = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    void checkLogin();
  }, []);

  async function checkLogin() {
    const path = window.location.pathname;
    const token: Token =  localStorage.getItem('access_token');

    if (!token && path !== '/login') {
      await router.push('/login');
      setLoading(false);

      return;
    }

    setLoading(false);

    return;
  }

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
