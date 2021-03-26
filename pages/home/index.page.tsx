import React, { } from 'react';
import DrawerUi from '@components/drawer/drawer';
import Header from '@components/header/header';
import { CssBaseline } from '@material-ui/core';
import InviteMembersPage from 'pages/invite_members/index.page';

const Home = () => {

  return (
    <>
      <div className='home-page'>
          <CssBaseline />
          <Header />
          <DrawerUi />
          <InviteMembersPage />
      </div>
    </>
  );
};

export default Home;
