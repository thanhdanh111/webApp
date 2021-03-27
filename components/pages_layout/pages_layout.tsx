
import React, { } from 'react';
import DrawerUi from '@components/drawer/drawer';
import Header from '@components/header/header';
import { CssBaseline } from '@material-ui/core';

const Layout = ({ children, withoutPaths }) => {
  const path = window.location.pathname;

  if (withoutPaths.includes(path)) {
    return <>{children}</>;
  }

  return (
    <div className='main-layout'>
      <CssBaseline />
      <Header />
      <DrawerUi />
      <div className='main-layout--children'>
        <div className='main-layout--children-toolbar'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
