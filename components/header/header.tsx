import React, { useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { Avatar, Badge, Button, Hidden } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NightsStayIcon from '@material-ui/icons/NightsStay';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { openDrawer } from './logic/header_actions';
import { Logout, Login } from 'pages/login/logic/login_actions';
import { GetUserDataThunkAction } from 'pages/login/logic/login_reducer';

type Token = string | null;

const Header: React.FunctionComponent = () => {
  const notifications = 10;
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    let token: Token = window.location.search;
    if (!token && typeof localStorage !== 'undefined') {
      token = localStorage.getItem('access_token');
    }
    if (!token) {
      void router.push('/login');

      return;
    }
    const accessToken = token.replace('?token=', '');
    localStorage.setItem('access_token', accessToken);
    void logUserIn(accessToken);
  }, []);

  async function logUserIn(token: string) {
    await Promise.all([
      dispatch(GetUserDataThunkAction(token)),
      dispatch(Login(token)),
    ]);
  }

  function logUserOut() {
    dispatch(Logout());
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.removeItem('access_token');
    void router.push('/login');
  }

  const ActionUser = () => {
    const tokenAuth = typeof localStorage !== 'undefined' && localStorage.getItem('access_token');
    if (tokenAuth) {
      return (
        <Button
          variant='contained'
          className='logout__btn MuiFormControlLabel-labelPlacementStart'
          onClick={logUserOut}
        >
          Logout
        </Button>
      );
    }
    if (!tokenAuth) {
      return (
        <Button
          variant='contained'
          className='logout__btn MuiFormControlLabel-labelPlacementStart'
          onClick={logUserOut}
        >
          Logout
        </Button>
      );
    }

    return (
      <Button variant='contained' className='logout__btn' color='primary' onClick={() => router.push('/login')}>
         Login
      </Button>
    );
  };

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

              <ActionUser />
          </div>
        </Toolbar>
      </AppBar>
  );
};

export default Header;
