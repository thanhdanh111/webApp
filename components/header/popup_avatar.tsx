import { Button, Menu, MenuItem, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import { Logout, Login } from 'pages/login/logic/login_actions';
import { GetUserDataThunkAction } from 'pages/login/logic/login_reducer';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import SettingsIcon from '@material-ui/icons/Settings';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { RootState } from 'redux/reducers_registration';
import UserAvatar from '@components/user_avatar/info_user';
import { deleteBrowserToken } from 'helpers/fcm';

type Token = string | null;

const DropDown = () => {
  const user = useSelector((state: RootState) => state.auth.userProfile);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    let token: Token = window.location.search;
    if (!token && typeof localStorage !== 'undefined') {
      token = localStorage.getItem('access_token');
    }
    if (!token) {
      onPushToPage('login');

      return;
    }
    const accessToken = token.replace('?token=', '');
    localStorage.setItem('access_token', accessToken);
    void logUserIn(accessToken);
  }, []);

  async function logUserIn(token: string) {

    if (!token) {
      return;
    }

    await Promise.all([
      dispatch(GetUserDataThunkAction(token)),
      dispatch(Login(token)),
    ]);
  }

  async function logUserOut() {
    dispatch(Logout());
    await deleteBrowserToken();
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.removeItem('access_token');
    onPushToPage('login');
  }

  const onPushToPage = (url: string) => {
    void router.push(`/${url}`, `/${url}.html`);
  };

  const ActionUser = () => {
    const tokenAuth = typeof localStorage !== 'undefined' && localStorage.getItem('access_token');
    if (tokenAuth) {
      return (
        <Button
          variant='contained'
          className='logout_btn MuiFormControlLabel-labelPlacementStart'
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
          className='logout_btn MuiFormControlLabel-labelPlacementStart'
          onClick={logUserOut}
        >
          Logout
        </Button>
      );
    }

    return (
      <Button variant='contained' className='logout_btn' color='primary' onClick={() => onPushToPage('login')}>
        Login
      </Button>
    );
  };

  const InfoUser = () => {

    const userName = `${user?.firstName} ${user?.lastName}`;

    return (
      <div className='drop-info'>
        <UserAvatar style='info-avatar' user={user}/>
        <Typography className='info-username' component='h5' variant='h6'>{userName}</Typography>
        <Typography className='info-email' component='p'>{user?.email}</Typography>
      </div>
    );
  };

  return (
    <PopupState variant='popover' popupId='demo-popup-menu'>
      {(popupState) => (
        <React.Fragment>

          <Button variant='contained' color='primary' {...bindTrigger(popupState)} className='drop-avt'>
          <UserAvatar alt='user icon' style='info-avatar' user={user}/>
          </Button>
          <Menu {...bindMenu(popupState)} className='menu-drop'>
            <MenuItem className='item-drop info-drop'><InfoUser /></MenuItem>
            <MenuItem className='item-drop action-drop item-switch' onClick={() => onPushToPage('home')}>
              <HomeIcon color='primary' className='icon-item' />
              <Typography className='text-item'>Home</Typography>
            </MenuItem>
            <MenuItem className='item-drop action-drop item-switch' onClick={() => onPushToPage('account')}>
              <PersonIcon color='primary' className='icon-item' />
              <Typography className='text-item'>Profile</Typography>
            </MenuItem>
            <MenuItem className='item-drop action-drop item-switch' onClick={() => onPushToPage('account')}>
              <SettingsIcon color='primary' className='icon-item' />
              <Typography className='text-item'>Setting</Typography>
            </MenuItem>
            <MenuItem className='item-drop logout-drop'><ActionUser /></MenuItem>
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
};

export default (DropDown);
