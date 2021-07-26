import React from 'react'
import {
  ListItem, ListItemIcon, ListItemText,
} from '@material-ui/core'
import DescriptionIcon from '@material-ui/icons/Description'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import SideToolbarButton from '@components/my_editor/side_toolbar_button'
import DeleteIcon from '@material-ui/icons/Delete'
import { useDispatch } from 'react-redux'
import { deletePage } from '../logic/docs_apis'

const DocsDrawerPageUI = ({ project, page, onClickPage, selected }) => {
  const dispatch = useDispatch()

  function sildePageDrawerToolbarActions() {
    const sideToolbarActions = [
      {
        type: 'normal',
        label: 'Delete',
        startIcon: <DeleteIcon />,
        function: () => dispatch(deletePage()),
      },
    ]

    return sideToolbarActions
  }

  return <ListItem
    key={page?._id}
    onClick={() => onClickPage({ page, project })}
    className='doc-page-item'
    disableGutters
    ContainerComponent='div'
    classes={{ selected: 'docs-page-selected' }}
    selected={selected}
  >
    <ListItemIcon>
      <DescriptionIcon style={{ width: '20px', height: '20px' }} />
    </ListItemIcon>
    <ListItemText title={page?.title} primary={page?.title} />
    <SideToolbarButton
      contentBlock={{}}
      onClickSideToolbar={() => 'handed'}
      disableProtal={true}
      children={undefined}
      buttonIcon={<MoreHorizIcon />}
      actionsNeedToRender={
        sildePageDrawerToolbarActions()
      }
    />
  </ListItem>
}

function areEqual(prevProps, nextProps) {
  const sameID = prevProps?.page?._id === nextProps?.page?._id
  const sameTitle = prevProps?.page?.title === nextProps?.page?.title
  const sameSelected = prevProps?.selected === nextProps?.selected

  return sameID && sameTitle && sameSelected
}

export default React.memo(DocsDrawerPageUI, areEqual)
