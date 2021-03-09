import React, { } from 'react';
import { CssBaseline } from '@material-ui/core';
import Header from '@components/header/header';
import DrawerUi from '@components/drawer/drawer';
import AccountPage from './account/index.page';

const App = () => {
  return (
    <>
      <main className='root'>
          <CssBaseline />
          <Header />
          <DrawerUi />
          <AccountPage />
      </main>
    </>
  );
};

export default App;
