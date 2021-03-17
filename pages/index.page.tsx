import React, { useEffect } from 'react';
import Login from './login/index.page';
import { useRouter } from 'next/router';

type Token = string | null;
const App = () => {
  const router = useRouter();

  useEffect(() => {
    void checkLogin();
  }, []);

  async function checkLogin() {
    const token: Token =  localStorage.getItem('access_token');
    if (token) {
      await router.push('/home');
    }

    return;
  }

  return (
    <>
      <main className='root'>
         <Login />
      </main>
    </>
  );
};

export default App;
