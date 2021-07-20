import React, { FunctionComponent } from 'react'
import {
  ListItem, ListItemText, Collapse, ListItemIcon,
} from '@material-ui/core'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import FolderIcon from '@material-ui/icons/Folder'
import DocsDrawerPageUI from './docs_drawer_page_item'
import { checkEmptyObject } from 'helpers/check_empty_object'
import { DocProject, PageContent, PagesMap } from '../logic/docs_reducer'

interface DocsDrawerProject {
  project: DocProject
  pages: PagesMap
  onClickPage: (props) => void
  onClickProject: (project) => void
  selected: boolean
}

const DocsDrawerProjectUI: FunctionComponent<DocsDrawerProject> = ({
  project,
  pages,
  onClickPage,
  onClickProject,
  selected,
}) => {
  const [open, setOpen] = React.useState(true)
  let renderPages: null | JSX.Element[] = null

  const handleClick = () => {
    setOpen(!open)
    onClickProject(project)
  }

  if (!checkEmptyObject(pages)) {
    renderPages = Object.values(pages)?.map((page: PageContent) =>
      <DocsDrawerPageUI
        key={page?._id}
        onClickPage={onClickPage}
        project={project}
        page={page}
      />,
    )
  }

  function renderEndIcons() {

    const expandedIcon = renderPages !== null ?
      (open ?
        <ExpandLess className='doc-project-expanded-icon' /> :
        <ExpandMore className='doc-project-expanded-icon' />
      ) : <div />

    return expandedIcon
  }

  return <>
    <ListItem
      className='doc-project-item'
      onClick={handleClick}
      classes={{ selected: 'docs-project-selected' }}
      selected={selected}
    >
      <ListItemIcon>
        <FolderIcon />
      </ListItemIcon>
        <ListItemText title={project?.title} primary={project?.title} />
      {renderEndIcons()}
    </ListItem>
    <Collapse in={open} timeout='auto' unmountOnExit>
      {renderPages}
    </Collapse>
  </>
}

function areEqual(prevProps, nextProps) {
  const sameID = prevProps?.project?._id === nextProps?.project?._id
  const sameSelected = prevProps?.selected === nextProps?.selected
  const samePagesLength = Object.keys(prevProps?.project?.pages) === Object.keys(nextProps?.project?.pages)

  return sameID && sameSelected && samePagesLength
}

export default React.memo(DocsDrawerProjectUI, areEqual)
