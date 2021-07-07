import React from 'react';
import {
  ListItem, ListItemIcon, ListItemText,
} from '@material-ui/core';
import DescriptionIcon from '@material-ui/icons/Description';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import SideToolbarButton from '@components/my_editor/side_toolbar_button';
import DeleteIcon from '@material-ui/icons/Delete';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { deletePage } from '../logic/docs_apis';
import { RootState } from 'redux/reducers_registration';
import { PageContent } from '../logic/docs_reducer';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import { updateDocs } from '../logic/docs_actions';
import { DocsRole, ProjectAccessMapOfUsers } from '../logic/get_folder_access';

interface DocsDrawerPageData {
  selectedPage: PageContent;
  projectAccessOfUsers: ProjectAccessMapOfUsers;
  accountUserID: string;
}

type DocsDrawerPageDataType = DocsDrawerPageData;

const DocsDrawerPageUI = ({ project, page, onClickPage }) => {
  const dispatch = useDispatch();
  const {
    selectedPage,
    projectAccessOfUsers,
    accountUserID,
  }: DocsDrawerPageDataType = useSelector((state: RootState) => {

    return {
      selectedPage: state?.docs?.selectedPage,
      projectAccessOfUsers: state?.docs?.projectAccessOfUsers,
      accountUserID: state?.userInfo?.userID,
    };
  }, shallowEqual);

  function sildePageDrawerToolbarActions() {
    const projectID = project?._id ?? '';
    const pageID = page?._id ?? '';
    let rolesInPage = projectAccessOfUsers?.[accountUserID]?.[projectID]?.accessInPages?.[pageID] ?? [];
    const isOwner = (page?.createdBy?._id ?? page?.createdBy) === accountUserID;

    if (isOwner) {
      rolesInPage = [DocsRole.WRITE, DocsRole.READ];
    }

    const sideToolbarActions = [
      {
        type: 'normal',
        label: 'Delete',
        startIcon: <DeleteIcon />,
        disabled: !rolesInPage.includes(DocsRole.WRITE),
        function: () => dispatch(deletePage()),
      },
      {
        type: 'normal',
        label: 'Share',
        startIcon: <PeopleOutlineIcon />,
        function: () => dispatch(updateDocs({ openShare: true })),
      },
    ];

    return sideToolbarActions;
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
  </ListItem>;
};

export default DocsDrawerPageUI;
