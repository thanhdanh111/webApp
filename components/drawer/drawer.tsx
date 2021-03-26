import React, { FunctionComponent } from 'react';
import {
  Drawer, ListItemIcon, List, ListItem, Hidden, ListItemText, ListSubheader, Typography,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { openDrawer } from '@components/header/logic/header_actions';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PersonIcon from '@material-ui/icons/Person';
import PublicIcon from '@material-ui/icons/Public';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import ChatIcon from '@material-ui/icons/Chat';
import TodayIcon from '@material-ui/icons/Today';
import SecurityIcon from '@material-ui/icons/Security';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';

const elementIcons = {
  'general.dashboard': <DashboardIcon />,
  'management.user': <PersonIcon />,
  'management.blog': <PublicIcon />,
  'app.mail': <MailOutlineIcon />,
  'app.chat': <ChatIcon />,
  'app.calendar': <TodayIcon />,
  'pages.auth': <SecurityIcon />,
  'management.invite members': <img alt='logo' width='24px' src='../send_mail.svg'/>,
};

const drawerElements = {
  general: '',
  'general.dashboard': ['app', 'E-Commerce', 'Analytics'],
  management: '',
  'management.user': ['profile', 'cards', 'list', 'account'],
  'management.invite members': ['shop', 'product', 'list', 'checkout', 'invoice'],
  'management.blog': ['posts', 'post', 'new post'],
  app: '',
  'app.mail': [],
  'app.chat': [],
  'app.calendar': [],
  pages: '',
  'pages.auth': [],
  'pages.landing page': [],
  'pages.pricing': [],
  'pages.payment': [],
  kit: '',
  'kit.foundation': [],
  'kit.components': [],
  'kit.charts': [],
  'kit.map': [],
};

const DrawerUi: FunctionComponent = ({ }) => {
  const headerState = useSelector((state) => state.headers);
  const dispatch = useDispatch();

  function listItems() {
    const items: JSX.Element[] = [];

    for (const name in drawerElements) {
      if (!name) {
        continue;
      }

      const splitedName = name.split('.');

      if (splitedName.length === 1) {
        items.push(
          <ListSubheader disableSticky className='drawer-subheader' key={name} component='div' id={`subheader-${name}`}>
            <Typography className='drawer-subheader-text'>
              {name}
            </Typography>
          </ListSubheader>,
        );
        continue;
      }

      items.push(
        <ListItem key={name} className='drawer-btn' button>
          <ListItemIcon>
            {elementIcons[name] ?? <InsertDriveFileIcon />}
          </ListItemIcon>
          <ListItemText primary={splitedName[1]} className='drawer-btn-text' />
        </ListItem>,
      );
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
