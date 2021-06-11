import React from 'react';
import {
  ListItem, ListItemIcon, ListItemText, Collapse,
} from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import FolderIcon from '@material-ui/icons/Folder';
import DescriptionIcon from '@material-ui/icons/Description';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import SideToolbarButton from '@components/my_editor/side_toolbar_button';
import DeleteIcon from '@material-ui/icons/Delete';
import { useDispatch } from 'react-redux';
import { deletePage } from '../logic/docs_apis';

const DocsProjectUI = ({ project, pages, onClickPage, onClickProject }) => {
  const [open, setOpen] = React.useState(true);
  let renderPages = null;
  const dispatch = useDispatch();

  const handleClick = () => {
    setOpen(!open);
    onClickProject(project);
  };

  function sildePageDrawerToolbarActions({ onDeletePage }) {

    const sideToolbarActions = [
      {
        type: 'normal',
        label: 'Delete',
        startIcon: <DeleteIcon />,
        function: () => 'handled',
      },
    ];

    return sideToolbarActions;
  }

  if (typeof pages !== 'string' && pages?.length) {
    renderPages = pages?.map((page) =>
      <ListItem
        key={page?._id}
        onClick={() => onClickPage({ page, project })}
        className='doc-page-item'
        style={{ paddingLeft: '30px' }}
        disableGutters
      >
        <ListItemIcon>
          <DescriptionIcon />
        </ListItemIcon>
        <ListItemText primary={page?.title} />
        {/* <SideToolbarButton
          key={page?._id}
          contentBlock={{}}
          onClickSideToolbar={() => 'handled'}
          actionsNeedToRender={sildePageDrawerToolbarActions({
            onDeletePage: dispatch(deletePage()),
          })}
          buttonIcon={<MoreHorizIcon />}
          disableProtal={true}
        /> */}
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
