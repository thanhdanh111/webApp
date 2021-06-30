import React, { FunctionComponent } from 'react';
import {
  Drawer, ListItemIcon, List, ListItem, Hidden, ListItemText, ListSubheader, Typography,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import PeopleIcon from '@material-ui/icons/People';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import HomeIcon from '@material-ui/icons/Home';
import { EqualizerOutlined } from '@material-ui/icons';
import EventNoteIcon from '@material-ui/icons/EventNote';
import EditIcon from '@material-ui/icons/Edit';
import BusinessIcon from '@material-ui/icons/Business';
import DocsDrawer from 'pages/docs/UI/docs_drawer';

const elementIcons = {
  account: <AccountCircleIcon />,
  users: <PeopleIcon />,
  statistics: <EqualizerOutlined />,
  home: <HomeIcon />,
  invite_members: <img alt='logo' width='24px' src='../send_mail.svg' />,
  time_off: <EventNoteIcon />,
  docs: <EditIcon />,
  event_logs: <EventNoteIcon />,
  projects: <EventNoteIcon />,
  company: <BusinessIcon />,
};

const drawerElements = {
  general: ['home', 'users', 'statistics', 'docs'],
  management: ['account', 'company', 'invite_members', 'time_off', 'event_logs', 'projects'],
};

interface DrawerUi {
  isDrawerOpen: boolean;
  onChangeDrawerOpen: () => void;
}

const DrawerUi: FunctionComponent<DrawerUi> = ({ isDrawerOpen, onChangeDrawerOpen }) => {
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

  async function handleChangeRoute(pathName) {
    if (typeof pathName !== 'string' || !pathName.length) {
      return;
    }

    await router.push(`/${pathName}`);
  }

  function handleDrawer() {
    const currentPath = window?.location?.pathname;
    if (currentPath === '/docs') {
      return <DocsDrawer />;
    }

    return <div>
      <List component='nav' aria-label='main mailbox folders'>
        <ListItem>
          <ListItemIcon>
            <img alt='logo' className='drawer-logo' src='../logo_single.svg' />
          </ListItemIcon>
        </ListItem>
        {listItems()}
      </List>
    </div>;
  }

  return (
    <nav className='drawer-nav' aria-label='mailbox folders'>
      <Hidden mdUp implementation='css'>
        <Drawer
          className='temporary-drawer'
          onClose={() => onChangeDrawerOpen()}
          variant='temporary'
          anchor='left'
          open={isDrawerOpen}
          classes={{
            paper: 'drawer-paper',
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {handleDrawer()}
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
        {handleDrawer()}
      </Drawer>
    </nav>
  );
};

export default DrawerUi;
