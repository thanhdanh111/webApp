import React from 'react'
import {
  ListItem, ListItemIcon, ListItemText,
} from '@material-ui/core'
import DescriptionIcon from '@material-ui/icons/Description'

const DocsDrawerPageUI = ({ project, page, onClickPage, selected }) => {

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
  </ListItem>
}

function areEqual(prevProps, nextProps) {
  const sameID = prevProps?.page?._id === nextProps?.page?._id
  const sameTitle = prevProps?.page?.title === nextProps?.page?.title
  const sameSelected = prevProps?.selected === nextProps?.selected

  return sameID && sameTitle && sameSelected
}

export default React.memo(DocsDrawerPageUI, areEqual)
