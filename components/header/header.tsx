import React from 'react';
import { AppBar, Toolbar,  Badge, Hidden, IconButton }from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MenuIcon from '@material-ui/icons/Menu';
import NightsStayIcon from '@material-ui/icons/NightsStay';
import DropDown from './popup_avatar';

interface Header {
  changeDrawerOpen: () => void;
}

const Header: React.FunctionComponent<Header> = ({ changeDrawerOpen }) => {
  const notifications = 10;

  return (
      <AppBar position='fixed' elevation={0} className='app-bar'>
        <Toolbar className='toolbar'>
          <Hidden mdUp implementation='css'>
            <IconButton
              edge='start'
              aria-label='menu'
              color='inherit'
              onClick={() => changeDrawerOpen()}
            >
              <MenuIcon className='btn-appbar menu' />
            </IconButton>
          </Hidden>

            <IconButton aria-label='search' color='inherit' >
              <SearchIcon className='btn-appbar'/>
            </IconButton>

            <div className='grow' />

            <div className='user-section'>

              <IconButton aria-label='notification'>
                <Badge badgeContent={notifications} color='error'>
                  <NotificationsIcon className='btn-appbar'/>
                </Badge>
              </IconButton>

              <IconButton aria-label='light mode' color='inherit'>
                <NightsStayIcon className='btn-appbar' />
              </IconButton>
              <DropDown />
          </div>
        </Toolbar>
      </AppBar>
  );
};

export default Header;
