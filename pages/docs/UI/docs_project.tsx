import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import FolderIcon from '@material-ui/icons/Folder';
import DescriptionIcon from '@material-ui/icons/Description';

const DocsProjectUI = ({ project, pages, onClickPage, onClickProject }) => {
  const [open, setOpen] = React.useState(true);
  let renderPages = null;

  const handleClick = () => {
    setOpen(!open);
    onClickProject(project);
  };

  if (typeof pages !== 'string' && pages?.length) {
    renderPages = pages?.map((page) =>
      <ListItem
        button
        key={page?._id}
        onClick={() => onClickPage(page)}
        className='doc-page-item'
        style={{ paddingLeft: '30px' }}
        disableGutters
        component='div'
      >
        <ListItemIcon>
          <DescriptionIcon />
        </ListItemIcon>
        <ListItemText primary={page?.title} />
      </ListItem>,
    );
  }

  return <>
    <ListItem className='doc-project-item' button onClick={handleClick}>
      <ListItemIcon>
        <FolderIcon />
      </ListItemIcon>
      <ListItemText primary={project?.title} />
      {renderPages !== null && (open ? <ExpandLess /> : <ExpandMore />)}
    </ListItem>
    <Collapse in={open} timeout='auto' unmountOnExit>
      {renderPages}
    </Collapse>
  </>;
};

export default DocsProjectUI;
