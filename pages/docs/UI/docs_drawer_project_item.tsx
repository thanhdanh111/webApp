import React from 'react';
import {
  ListItem, ListItemIcon, ListItemText, Collapse,
} from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import FolderIcon from '@material-ui/icons/Folder';
import DocsDrawerPageUI from './docs_drawer_page_item';

const DocsDrawerProjectUI = ({
  project,
  pages,
  onClickPage,
  onClickProject,
  selected,
}) => {
  const [open, setOpen] = React.useState(true);
  let renderPages = null;

  const handleClick = () => {
    setOpen(!open);
    onClickProject(project);
  };

  if (typeof pages !== 'string' && pages?.length) {
    renderPages = pages?.map((page) =>
      <DocsDrawerPageUI
        key={page?._id}
        onClickPage={onClickPage}
        project={project}
        page={page}
      />,
    );
  }

  return <>
    <ListItem
      className='doc-project-item'
      onClick={handleClick}
      classes={{ selected: 'docs-project-selected' }}
      selected={selected}
    >
      <ListItemIcon>
        <FolderIcon/>
      </ListItemIcon>
      <ListItemText primary={project?.title} />
      {renderPages !== null && (open ? <ExpandLess /> : <ExpandMore />)}
    </ListItem>
    <Collapse in={open} timeout='auto' unmountOnExit>
      {renderPages}
    </Collapse>
  </>;
};

export default DocsDrawerProjectUI;
