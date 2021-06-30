import React from 'react';
import {
  ListItem, ListItemText, Collapse, ListItemIcon,
} from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import FolderIcon from '@material-ui/icons/Folder';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import DeleteIcon from '@material-ui/icons/Delete';
import { useDispatch } from 'react-redux';
import DocsDrawerPageUI from './docs_drawer_page_item';
import SideToolbarButton from '@components/my_editor/side_toolbar_button';
import { deleteDocProject } from '../logic/docs_apis';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';

const DocsDrawerProjectUI = ({
  project,
  pages,
  onClickPage,
  onClickProject,
  selected,
}) => {
  const [open, setOpen] = React.useState(true);
  let renderPages = null;
  const dispatch = useDispatch();

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

  function renderEndIcons() {
    const expandedIcon = renderPages !== null ?
      (open ?
        <ExpandLess className='doc-project-expanded-icon' /> :
        <ExpandMore className='doc-project-expanded-icon' />
      ) : <div />;

    const sideToolbarActions = [
      {
        type: 'normal',
        label: 'Delete Project',
        startIcon: <DeleteIcon />,
        function: () => dispatch(deleteDocProject({ projectID: project?._id })),
      },
      {
        type: 'normal',
        label: 'Share Project',
        startIcon: <PeopleOutlineIcon />,
        function: () => { },
      },
    ];

    return <SideToolbarButton
      contentBlock={{}}
      onClickSideToolbar={() => 'handed'}
      disableProtal={true}
      children={undefined}
      buttonIcon={<div className='doc-project-start-icons'>
        {expandedIcon}
        <MoreHoriz className='doc-project-hover-icon-options' />
      </div>}
      actionsNeedToRender={sideToolbarActions}
    />;
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
  </>;
};

export default DocsDrawerProjectUI;
