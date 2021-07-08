import React, { FunctionComponent } from 'react';
import {
  ListItem, ListItemText, Collapse, ListItemIcon,
} from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import FolderIcon from '@material-ui/icons/Folder';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import DeleteIcon from '@material-ui/icons/Delete';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import DocsDrawerPageUI from './docs_drawer_page_item';
import SideToolbarButton from '@components/my_editor/side_toolbar_button';
import { deleteDocProject } from '../logic/docs_apis';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import { updateDocs } from '../logic/docs_actions';
import { checkEmptyObject } from 'helpers/check_empty_object';
import { DocProject, PageContent, PagesMap } from '../logic/docs_reducer';
import { RootState } from 'redux/reducers_registration';

interface DocsDrawerProject {
  project: DocProject;
  pages: PagesMap;
  onClickPage: (props) => void;
  onClickProject: (project) => void;
  selected: boolean;
}

interface DocsDrawerData {
  accountUserID: string;
}

type DocsDrawerDataType = DocsDrawerData;

const DocsDrawerProjectUI: FunctionComponent<DocsDrawerProject> = ({
  project,
  pages,
  onClickPage,
  onClickProject,
  selected,
}) => {
  const [open, setOpen] = React.useState(true);
  const { accountUserID }: DocsDrawerDataType = useSelector((state: RootState) => {

    return {
      accountUserID: state?.userInfo?.userID,
    };
  }, shallowEqual);
  let renderPages: null | JSX.Element[] = null;
  const dispatch = useDispatch();

  const handleClick = () => {
    setOpen(!open);
    onClickProject(project);
  };

  if (!checkEmptyObject(pages)) {
    renderPages = Object.values(pages)?.map((page: PageContent) =>
      <DocsDrawerPageUI
        key={page?._id}
        onClickPage={onClickPage}
        project={project}
        page={page}
      />,
    );
  }

  function renderEndIcons() {
    const canDeleteProject = (project?.createdBy?.['_id'] ?? project?.createdBy) === accountUserID;

    const expandedIcon = renderPages !== null ?
      (open ?
        <ExpandLess className='doc-project-expanded-icon' /> :
        <ExpandMore className='doc-project-expanded-icon' />
      ) : <div />;

    const sideToolbarActions = [
      {
        type: 'normal',
        label: 'Share Project',
        startIcon: <PeopleOutlineIcon />,
        function: () => dispatch(updateDocs({ openShare: true })),
      },
      {
        type: 'normal',
        label: 'Delete Project',
        startIcon: <DeleteIcon />,
        disabled: !canDeleteProject,
        function: () => dispatch(deleteDocProject({ projectID: project?._id })),
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

function areEqual(prevProps, nextProps) {
  const sameID = prevProps?.project?._id === nextProps?.project?._id;
  const sameSelected = prevProps?.selected === nextProps?.selected;
  const samePagesLength = Object.keys(prevProps?.project?.pages) === Object.keys(nextProps?.project?.pages);

  return sameID && sameSelected && samePagesLength;
}

export default React.memo(DocsDrawerProjectUI, areEqual);
