import React from 'react'
import {
  ListItem, ListItemIcon, ListItemText,
} from '@material-ui/core'
import DescriptionIcon from '@material-ui/icons/Description'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import SideToolbarButton from '@components/my_editor/side_toolbar_button'
import DeleteIcon from '@material-ui/icons/Delete'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { deletePage } from '../logic/docs_apis'
import { RootState } from 'redux/reducers_registration'
import { PageContent } from '../logic/docs_reducer'

interface DocsDrawerPageData {
  selectedPage: PageContent
}

type DocsDrawerPageDataType = DocsDrawerPageData

const DocsDrawerPageUI = ({ project, page, onClickPage }) => {
  const dispatch = useDispatch()
  const { selectedPage }: DocsDrawerPageDataType = useSelector((state: RootState) => {

    return {
      selectedPage: state?.docs?.selectedPage,
    }
  }, shallowEqual)

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
    selected={selectedPage?._id === page?._id}
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

  return sameID && sameTitle
}

export default React.memo(DocsDrawerPageUI, areEqual)
