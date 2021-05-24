
import React, { useState } from 'react';
import DrawerUi from '@components/drawer/drawer';
import Header from '@components/header/header';
import { DisappearedLoading } from 'react-loadingg';
import { CssBaseline } from '@material-ui/core';
import { RootStateOrAny, useSelector } from 'react-redux';

const Layout = ({ children, withoutPaths }) => {
  const path = window.location.pathname;
  const userID = useSelector((state: RootStateOrAny) => state.auth.userID);
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
        {!userID ? (
          <div className='main-layout-loading'>
            <DisappearedLoading color={'#67cb48'} style={{ height: '100px' }}/>
          </div>
        ) : (
          <div className='main-layout--children-toolbar'>
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;
