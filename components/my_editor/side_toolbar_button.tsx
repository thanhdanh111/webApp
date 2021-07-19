import React, { FunctionComponent } from 'react'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import {
  ClickAwayListener, Paper,
  Popper, MenuList, MenuItem, ListItemIcon,
  Typography, IconButton,
} from '@material-ui/core'

interface RenderAction {
  type?: string
  label?: string
  startIcont?: JSX.Element
  component?: JSX.Element
  disabled?: boolean
}

interface SideToolbarButton {
  contentBlock: object
  onClickSideToolbar: (props) => void
  actionsNeedToRender: RenderAction[]
  children?: JSX.Element
  buttonIcon?: JSX.Element
  disableProtal: boolean
}

const SideToolbarButton: FunctionComponent<SideToolbarButton> = ({
  contentBlock,
  onClickSideToolbar,
  children,
  actionsNeedToRender,
  buttonIcon,
  disableProtal = false,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handlePopperOpen = (event: React.MouseEvent<HTMLElement>) => {
    onClickSideToolbar({ contentBlock, event })

    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  function renderAction(action, index) {
    if (action?.type === 'component') {
      return action?.component ?? <div />
    }

    return <MenuItem
      className='side-toolbar--menu-item'
      component='div'
      key={`menu-item-index-${index}`}
      onClick={action?.function}
      disabled={action?.disabled ?? false}
    >
      <ListItemIcon className='side-toolbar--menu-icon'>
        {action?.startIcon}
      </ListItemIcon>
      <Typography variant='inherit'>{action?.label}</Typography>
    </MenuItem>
  }

  return <>
    <div
      className='block-wrapper--btns'
      contentEditable={false}
      onFocus={(event) => event.stopPropagation()}
    >
      <IconButton
        component='div'
        className='block-wrapper--btn'
        aria-describedby={open ? 'sideToolbar' : undefined}
        onClick={handlePopperOpen}
      >
        {buttonIcon ?? <MoreVertIcon className='block-wrapper--icon'/>}
      </IconButton>
      {children}

      <Popper
        id='sideToolbar'
        className='side-toolbar-wrapper'
        open={open}
        anchorEl={anchorEl}
        role={undefined}
        disablePortal={disableProtal}
        onFocus={(event) => event.stopPropagation()}
      >
          <ClickAwayListener onClickAway={handleClose} disableReactTree>
            <Paper>
              <MenuList>
                {actionsNeedToRender.map(renderAction)}
              </MenuList>
            </Paper>
          </ClickAwayListener>
      </Popper>
    </div>
  </>
}

export default SideToolbarButton
