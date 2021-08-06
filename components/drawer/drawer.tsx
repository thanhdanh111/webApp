import React, { FunctionComponent } from 'react'
import {
  Drawer, ListItemIcon, List, ListItem,
  Hidden, ListItemText, ListSubheader, Typography,
} from '@material-ui/core'
import { useRouter } from 'next/router'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile'
import PeopleIcon from '@material-ui/icons/People'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import HomeIcon from '@material-ui/icons/Home'
import { EqualizerOutlined } from '@material-ui/icons'
import EventNoteIcon from '@material-ui/icons/EventNote'
import BusinessIcon from '@material-ui/icons/Business'
import DashboardIcon from '@material-ui/icons/Dashboard'
import EditIcon from '@material-ui/icons/Edit'
import DocsDrawer from 'pages/docs/UI/docs_drawer'

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
  board: <DashboardIcon />,
}

const drawerElements = {
  general: ['home', 'users', 'statistics', 'docs'],
  management: ['account', 'company', 'invite_members', 'time_off', 'event_logs', 'projects', 'board'],
}

interface DrawerUi {
  isDrawerOpen: boolean
  onChangeDrawerOpen: () => void
}

const DrawerUi: FunctionComponent<DrawerUi> = ({ isDrawerOpen, onChangeDrawerOpen }) => {
  const router = useRouter()

  function listItems() {
    const items: JSX.Element[] = []

    for (const subheaderName in drawerElements) {
      if (!subheaderName || !drawerElements[subheaderName]?.length) {
        continue
      }

      items.push(
        <ListSubheader disableSticky className='drawer-subheader' key={subheaderName} component='div' id={`subheader-${subheaderName}`}>
          <Typography className='drawer-subheader-text'>
            {subheaderName}
          </Typography>
        </ListSubheader>,
      )

      drawerElements[subheaderName].forEach((elementName) => {
        const name = elementName
        const withoutDashName = name.replace('_', ' ')

        return items.push(
          <ListItem key={name} className='drawer-btn' button onClick={() => handleChangeRoute(name)}>
            <ListItemIcon style={{ minWidth: '35px' }}>
              {elementIcons[name] ?? <InsertDriveFileIcon />}
            </ListItemIcon>
            <ListItemText primary={withoutDashName} className='drawer-btn-text' />
          </ListItem>,
        )
      })
    }

    return items
  }

  async function handleChangeRoute(pathName) {
    if (typeof pathName !== 'string' || !pathName.length) {
      return
    }

    await router.push(`/${pathName}`)
  }

  function handleDrawer() {
    const currentPath = window?.location?.pathname
    if (currentPath === '/docs') {
      return  <DocsDrawer />
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
    </div>
  }

  const drawer = handleDrawer()
  const container = window !== undefined ? () => window.document.body : undefined

  return (
    <nav className='drawer-nav' aria-label='mailbox folders'>
      <Hidden mdUp implementation='js'>
        <Drawer
          className='temporary-drawer'
          onClose={() => onChangeDrawerOpen()}
          variant='temporary'
          container={container}
          anchor='left'
          open={isDrawerOpen}
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
  )
}

export default DrawerUi
