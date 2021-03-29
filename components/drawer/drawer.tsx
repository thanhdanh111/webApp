import React, { FunctionComponent } from 'react';
import {
  Drawer, ListItemIcon, List, ListItem, Hidden, ListItemText, ListSubheader, Typography,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { openDrawer } from '@components/header/logic/header_actions';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import PeopleIcon from '@material-ui/icons/People';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import HomeIcon from '@material-ui/icons/Home';
import { RootState } from 'redux/reducers_registration';

const elementIcons = {
  account: <AccountCircleIcon />,
  users: <PeopleIcon />,
  home: <HomeIcon />,
  invite_members: <img alt='logo' width='24px' src='../send_mail.svg'/>,
};

const drawerElements = {
  general: ['home', 'users'],
  management: ['account', 'invite_members'],
};

const DrawerUi: FunctionComponent = ({ }) => {
  const headerState = useSelector((state: RootState) => state.headers);
  const dispatch = useDispatch();
  const router = useRouter();

  function listItems() {
    const items: JSX.Element[] = [];

    for (const subheaderName in drawerElements) {
      if (!subheaderName || !drawerElements[subheaderName]?.length) {
        continue;
      }

      items.push(
        <ListSubheader disableSticky className='drawer-subheader' key={subheaderName} component='div' id={`subheader-${subheaderName}`}>
          <Typography className='drawer-subheader-text'>
            {subheaderName}
          </Typography>
        </ListSubheader>,
      );

      drawerElements[subheaderName].forEach((elementName) => {
        const name = elementName;
        const withoutDashName = name.replace('_', ' ');

        return items.push(
          <ListItem key={name} className='drawer-btn' button onClick={() => handleChangeRoute(name)}>
            <ListItemIcon>
              {elementIcons[name] ?? <InsertDriveFileIcon />}
            </ListItemIcon>
            <ListItemText primary={withoutDashName} className='drawer-btn-text' />
          </ListItem>,
        );
      });
    }

    return items;
  }

  const drawer = (
    <div>
      <List component='nav' aria-label='main mailbox folders'>
        <ListItem>
          <ListItemIcon>
            <img alt='logo' className='drawer-logo' src='../logo_single.svg'/>
          </ListItemIcon>
        </ListItem>
        {listItems()}
      </List>
    </div>
  );

  async function handleChangeRoute(pathName) {
    if (typeof pathName !== 'string' || !pathName.length) {
      return;
    }

    await router.push(`/${pathName}`);
  }

  return (
    <nav className='drawer-nav' aria-label='mailbox folders'>
      <Hidden mdUp implementation='css'>
        <Drawer
          className='temporary-drawer'
          onClose={() => dispatch(openDrawer())}
          variant='temporary'
          anchor='left'
          open={headerState.isOpenDrawer}
          classes={{
            paper: 'drawer-paper',
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
        <Drawer
          className='permanent-drawer'
          classes={{
            paper: 'drawer-paper',
          }}
          variant='permanent'
          open
        >
          {drawer}
        </Drawer>
    </nav>
  );
};

export default DrawerUi;
