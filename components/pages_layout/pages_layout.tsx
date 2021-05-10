
import React, { useState } from 'react';
import DrawerUi from '@components/drawer/drawer';
import Header from '@components/header/header';
import { CssBaseline } from '@material-ui/core';

const Layout = ({ children, withoutPaths }) => {
  const path = window.location.pathname;
  const [isDrawerOpen, setOpenDrawer] = useState(false);

  if (withoutPaths.includes(path)) {
    return <>{children}</>;
  }

  function changeDrawerOpen() {
    setOpenDrawer(!isDrawerOpen);
  }

  return (
    <div className='main-layout'>
      <CssBaseline />
      <Header changeDrawerOpen={changeDrawerOpen} />
      <DrawerUi isDrawerOpen={isDrawerOpen} onChangeDrawerOpen={changeDrawerOpen}/>
      <div className='main-layout--children'>
        <div className='main-layout--children-toolbar'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
