import React from 'react';
import { AppBar, Toolbar, Hidden, IconButton }from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import MenuIcon from '@material-ui/icons/Menu';
import NightsStayIcon from '@material-ui/icons/NightsStay';
import DropDown from './popup_avatar';
import NotificationsUI from './notifications';

interface Header {
  changeDrawerOpen: () => void;
}

const Header: React.FunctionComponent<Header> = ({ changeDrawerOpen }) => {
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
              <NotificationsUI />
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
