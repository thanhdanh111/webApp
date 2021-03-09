import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { Avatar, Badge, Hidden } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NightsStayIcon from '@material-ui/icons/NightsStay';
import { useDispatch } from 'react-redux';
import { openDrawer } from './logic/header_actions';

const Header: React.FunctionComponent = () => {
  const notifications = 10;
  const dispatch = useDispatch();

  return (
      <AppBar position='fixed' elevation={0} className='app-bar'>
        <Toolbar className='toolbar'>
          <Hidden mdUp implementation='css'>
            <IconButton
              edge='start'
              aria-label='menu'
              color='inherit'
              onClick={() => dispatch(openDrawer())}
            >
              <MenuIcon className='btn-appbar menu' />
            </IconButton>
          </Hidden>

            <IconButton aria-label='search' color='inherit' >
              <SearchIcon className='btn-appbar'/>
            </IconButton>

            <div className='grow' />

            <div className='user-section'>
              <IconButton aria-label='language' color='inherit'>
                <img alt='language' className='language-img' src='../united-kingdom.svg'/>
              </IconButton>

              <IconButton aria-label='notification'>
                <Badge badgeContent={notifications} color='error'>
                  <NotificationsIcon className='btn-appbar'/>
                </Badge>
              </IconButton>

              <IconButton aria-label='light mode' color='inherit'>
                <NightsStayIcon className='btn-appbar' />
              </IconButton>

              <Avatar alt='user icon' src='../test.png'/>

          </div>
        </Toolbar>
      </AppBar>
  );
};

export default Header;
