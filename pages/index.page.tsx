import Header from '@components/header/header';
import React from 'react';
import AccountPage from './account/index.page';

const App = () => {

  return (
    <>
      <main className='root'>
          <Header/>
          <AccountPage />
      </main>
    </>
  );
};

export default App;
