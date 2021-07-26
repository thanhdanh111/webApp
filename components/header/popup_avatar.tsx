import { Button, Menu, MenuItem, Typography, Avatar, Grid, Divider } from '@material-ui/core'
import React from 'react'
import { Logout } from 'pages/login/logic/login_actions'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import HomeIcon from '@material-ui/icons/Home'
import PersonIcon from '@material-ui/icons/Person'
import SettingsIcon from '@material-ui/icons/Settings'
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state'
import { RootState } from 'redux/reducers_registration'
import UserAvatar from '@components/user_avatar/info_user'
import { deleteBrowserToken } from 'helpers/fcm'
import BusinessIcon from '@material-ui/icons/Business'

const DropDown = () => {
  const userInfo = useSelector((state: RootState) => state?.userInfo)
  const dispatch = useDispatch()
  const router = useRouter()

  async function logUserOut() {
    dispatch(Logout())
    await deleteBrowserToken()
    if (typeof localStorage === 'undefined') {
      return
    }
    localStorage.removeItem('access_token')
    onPushToPage('login')
  }

  const onPushToPage = (url: string) => {

    void router.push(`/${url}`, `/${url}.html`)
  }

  const ActionUser = () => {
    const tokenAuth = typeof localStorage !== 'undefined' && localStorage.getItem('access_token')
    if (tokenAuth) {
      return (
        <Button
          variant='contained'
          className='logout_btn MuiFormControlLabel-labelPlacementStart'
          onClick={logUserOut}
        >
          Logout
        </Button>
      )
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
      )
    }

    return (
      <Button variant='contained' className='logout_btn' color='primary' onClick={() => onPushToPage('login')}>
        Login
      </Button>
    )
  }

  const InfoUser = () => {

    const userName = ` ${userInfo?.profile?.lastName} ${userInfo?.profile?.firstName}`

    return (
      <Grid className='sublist-item' container wrap='nowrap' spacing={2}>
        <Grid item>
          <UserAvatar style='info-avatar' user={userInfo?.profile}/>
        </Grid>
        <Grid item xs justify='center'>
          <Typography >{userName}</Typography>
          <Typography >{userInfo?.profile?.email}</Typography>
        </Grid>
      </Grid>
    )
  }

  const InfoCompany = () => {
    const currentCompany = userInfo?.currentCompany
    if (!currentCompany?.name) {
      return <div />
    }

    return (
      <Grid className='sublist-item' container wrap='nowrap' spacing={2}>
        <Grid item>
          <Avatar variant='rounded' src={currentCompany.photos?.[0]} style={{ backgroundColor: '#00AB55' }}>
            <BusinessIcon />
          </Avatar>
        </Grid>
        <Grid item xs justify='center'>
          <Typography >{currentCompany.name}</Typography>
          {!currentCompany?.emails?.length ? <div /> : <Typography >{currentCompany.emails?.[0]}</Typography>}
        </Grid>
      </Grid>
    )
  }

  return (
    <PopupState variant='popover' popupId='demo-popup-menu'>
      {(popupState) => (
        <React.Fragment>

          <Button variant='contained' color='primary' {...bindTrigger(popupState)} className='drop-avt'>
          <UserAvatar alt='user icon' style='info-avatar' user={userInfo?.profile}/>
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
  )
}

export default (DropDown)
