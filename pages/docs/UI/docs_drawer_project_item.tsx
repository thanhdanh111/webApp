import React, { FunctionComponent } from 'react'
import {
  ListItem, ListItemText, Collapse, ListItemIcon,
} from '@material-ui/core'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import FolderIcon from '@material-ui/icons/Folder'
import DocsDrawerPageUI from './docs_drawer_page_item'
import { DocProject, PageContent } from '../logic/docs_reducer'

interface DocsDrawerProject {
  project: DocProject
  selectedPage: PageContent
  pages: PageContent[]
  onClickPage: (props) => void
  onClickProject: (project) => void
  selected: boolean
  pagesLength?: number
  selectedPageInProject?: boolean
}

const DocsDrawerProjectUI: FunctionComponent<DocsDrawerProject> = ({
  project,
  pages,
  onClickPage,
  onClickProject,
  selected,
  selectedPage,
}) => {
  const [open, setOpen] = React.useState(true)
  let renderPages: null | JSX.Element[] = null

  const handleClick = () => {
    if (!selected) {
      onClickProject(project)
    }

    setOpen(!open)
  }

  if (pages?.length) {
    renderPages = pages?.map((page: PageContent) => {
      const pageSelected = selectedPage?._id === page?._id

      return <DocsDrawerPageUI
        key={page?._id}
        onClickPage={onClickPage}
        project={project}
        page={page}
        selected={pageSelected}
      />
    })
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
  const samePagesLength = prevProps?.pagesLength === nextProps?.pagesLength
  const sameSelectedPageInProject = prevProps?.selectedPageInProject === nextProps?.selectedPageInProject
    && prevProps?.selectedPage?._id === nextProps?.selectedPage?._id

  return sameID && sameSelected && samePagesLength && sameSelectedPageInProject
}

export default React.memo(DocsDrawerProjectUI, areEqual)
