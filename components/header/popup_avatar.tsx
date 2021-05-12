import { Button, Menu, MenuItem, Typography, Avatar, Grid, Divider } from '@material-ui/core';
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
import BusinessIcon from '@material-ui/icons/Business';

type Token = string | null;

const DropDown = () => {
  const auth = useSelector((state: RootState) => state.auth);
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

    const userName = ` ${auth?.userProfile?.lastName} ${auth?.userProfile?.firstName}`;

    return (
      <Grid className='sublist-item' container wrap='nowrap' spacing={2}>
        <Grid item>
          <UserAvatar style='info-avatar' user={auth?.userProfile}/>
        </Grid>
        <Grid item xs justify='center'>
          <Typography >{userName}</Typography>
          <Typography >{auth?.userProfile?.email}</Typography>
        </Grid>
      </Grid>
    );
  };

  const InfoCompany = () => {
    if (!auth?.company?.name || !auth?.company?.emails?.length) {
      return <div />;
    }

    return (
      <Grid className='sublist-item' container wrap='nowrap' spacing={2}>
        <Grid item>
          <Avatar variant='rounded' src={auth?.company.photos?.[0]} style={{ backgroundColor: '#00AB55' }}>
            <BusinessIcon />
          </Avatar>
        </Grid>
        <Grid item xs justify='center'>
          <Typography >{auth?.company?.name}</Typography>
          <Typography >{auth?.company?.emails?.[0]}</Typography>
        </Grid>
      </Grid>
    );
  };

  return (
    <PopupState variant='popover' popupId='demo-popup-menu'>
      {(popupState) => (
        <React.Fragment>

          <Button variant='contained' color='primary' {...bindTrigger(popupState)} className='drop-avt'>
          <UserAvatar alt='user icon' style='info-avatar' user={auth?.userProfile}/>
          </Button>
          <Menu {...bindMenu(popupState)} className='menu-drop'>
            <InfoUser />
            <Divider />
            <MenuItem disableGutters className='info-company' onClick={() => onPushToPage('company')}>
              <InfoCompany />
            </MenuItem>
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
