import React, { useState } from 'react';
import {
  Dialog, Typography, Select,
  DialogContent, DialogTitle, IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useDispatch } from 'react-redux';
import { DocProject, PageContent, UsersInCompanyMap } from '../../pages/docs/logic/docs_reducer';
import { updateDocs } from '../../pages/docs/logic/docs_actions';
import PrimaryButtonUI from '@components/primary_button/primary_button';
import UserAvatar from '../user_avatar/info_user';
import { DocsRole, ProjectAccessMapOfUsers } from '../../pages/docs/logic/get_folder_access';
import { checkOnlyTrueInArray } from 'helpers/check_only_true';
import { checkTrueInArray } from 'helpers/check_true_in_array';
import { getItemSelectedRolesOfUser } from 'pages/docs/logic/get_item_selected_roles_of_user';
import CancelIcon from '@material-ui/icons/Cancel';

interface ShareComponentData {
  loading: boolean;
  selectedPage: PageContent;
  selectedProject: DocProject;
  openShare: boolean;
  usersInCompanyMap: UsersInCompanyMap;
  projectAccessOfUsers: ProjectAccessMapOfUsers;
  accountUserID: string;
  handleShare: (role, userID) => void;
  handleRemoveRole: ({ role, userID }) => void;
}

const defaultRoles = {
  NONE: {
    role: '',
    name: 'None',
  },
  WRITE: {
    role: 'WRITE',
    name: 'Write',
  },
  READ: {
    role: 'READ',
    name: 'Read',
  },
};

export const SharePermission = ({
  selectedProject,
  openShare,
  usersInCompanyMap,
  loading,
  projectAccessOfUsers,
  accountUserID,
  selectedPage,
  handleShare,
  handleRemoveRole,
}: ShareComponentData) => {
  const dispatch = useDispatch();
  const [selectedShare, setSelectedShare] = useState({});
  const selectedProjectID = selectedProject?._id ?? '';
  const selectedPageID = selectedPage?._id ?? '';
  const userIDCreatedPage = selectedPage?.createdBy?._id ?? selectedPage?.createdBy;
  const userIDCreatedProject = selectedProject?.createdBy?.['_id'] ?? selectedProject?.createdBy;
  const haveWritePermission = checkHaveWriteToRemoveShare();

  function handleClose() {
    dispatch(updateDocs({ openShare: false }));
  }

  function renderUsersToShare() {
    const usersToShare: JSX.Element[] = [
      <option key='default' value=''>
        None
      </option>,
    ];

    for (const userID in usersInCompanyMap) {
      if (!userID || userID === accountUserID) {
        continue;
      }

      const firstName = usersInCompanyMap?.[userID]?.firstName;
      const lastName = usersInCompanyMap?.[userID]?.lastName;
      const unknownName = (lastName?.length ?? 0) < 2 && (firstName?.length ?? 0) < 2;

      if (unknownName) {

        continue;
      }

      usersToShare.push(
        <option key={userID} value={userID}>
          {`${lastName} ${firstName}`}
        </option>,
      );
    }

    return usersToShare;
  }

  function renderRolesToShare() {
    const rolesToSelect: JSX.Element[] = [];

    for (const role in defaultRoles) {
      if (!role) {
        continue;
      }

      rolesToSelect.push(
        <option key={defaultRoles[role].role} value={defaultRoles[role].role}>
          {defaultRoles[role].name}
        </option>,
      );
    }

    return rolesToSelect;
  }

  function renderRolesOfUser({ rolesOfUser, isOwner, userID, couldRemove }) {
    if (isOwner) {
      return <div className='users-shared-with--owner'>Owner</div>;
    }

    return  <div className='users-shared-with--roles-render'>
      {
        rolesOfUser.map((role) =>
          <div key={role} className='users-shared-with--role-render'>
            <span
              className='users-shared-with--role-render-text'
              style={{ width: couldRemove ? '50px' : '' }}
            >
              {defaultRoles[role].name}
            </span>
            {
              couldRemove &&
                <CancelIcon
                  onClick={() => handleRemoveRole({ role, userID })}
                  className='users-shared-with--role-render-icon'
                />
            }
          </div>)
      }
    </div>;
  }

  function checkHaveWriteToRemoveShare() {
    const projectRolesOfAccount = projectAccessOfUsers?.[accountUserID]?.[selectedProjectID]?.roles ?? [];
    const pageRolesOfAccount = projectAccessOfUsers?.[accountUserID]?.[selectedProjectID]?.accessInPages?.[selectedPageID] ?? [];
    const isOwner =  (userIDCreatedPage ?? userIDCreatedProject) === accountUserID;

    const haveRoleToRemove = projectRolesOfAccount.includes(DocsRole.WRITE) ||
      pageRolesOfAccount.includes(DocsRole.WRITE);
    const roleCouldRemove = checkTrueInArray({
      conditionsArray: [
        isOwner,
        haveRoleToRemove,
      ],
    });

    return roleCouldRemove;
  }

  function canRemoveSharedUser({ userID }) {
    const isNotOwnerOfProject = userID !== userIDCreatedProject;
    const isNotOnwerOfPage = userID !== userIDCreatedPage;
    const notMe = accountUserID !== userID;
    const accountIsOwnerOfProject = accountUserID === userIDCreatedProject;

    return notMe && isNotOwnerOfProject && (isNotOnwerOfPage || accountIsOwnerOfProject);
  }

  function renderUsersSharedWith() {
    const usersRender: JSX.Element[] = [];

    for (const userID in projectAccessOfUsers) {
      if (!userID) {
        continue;
      }

      const userProfile = projectAccessOfUsers?.[userID]?.[selectedProjectID]?.ownerInfo;

      if (!userProfile) {

        continue;
      }

      const rolesOfUser = getItemSelectedRolesOfUser({ userID, selectedPageID, selectedProjectID, projectAccessOfUsers });
      const isOwner = userID === (userIDCreatedPage ?? userIDCreatedProject);

      const userHaveNoRoles = checkOnlyTrueInArray({ conditionsArray: [
        !rolesOfUser?.length,
        !isOwner,
      ]});

      if (userHaveNoRoles) {

        continue;
      }

      selectedShare[userID] = {
        isOwner,
        removeRole: rolesOfUser[0],
      };

      const canRemoveCurrentUser = canRemoveSharedUser({ userID });
      const couldRemove = checkOnlyTrueInArray({
        conditionsArray: [
          haveWritePermission,
          canRemoveCurrentUser,
        ],
      });

      usersRender.push(
        <div key={userID} className='users-shared-with'>
          <UserAvatar user={userProfile}  style='notification-img'/>
          <Typography className='users-shared-with--name' style={{ marginLeft: '20px' }}>
            {`${userProfile?.lastName} ${userProfile.firstName}`}
          </Typography>
          {renderRolesOfUser({ rolesOfUser, isOwner, userID, couldRemove })}
        </div>,
      );
    }

    return usersRender;
  }

  return (
    <div>
      <Dialog
        open={openShare}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth='sm'
        fullWidth
        onClose={handleClose}
      >
        <DialogTitle>
          <div>
            <Typography style={{ fontWeight: 600 }} variant='subtitle1' color='primary' >
              {`Share ${selectedPage?.title ?? selectedProject?.title}`}
            </Typography>
            <IconButton
              onClick={() => handleClose()}
              className='confirm-dialog--close-btn'
              color='primary'
            >
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent style={{ padding: '8px 28px' }}>
          <Typography variant='body2' style={{ fontWeight: 600 }}>
            Invite
          </Typography>
          <div className='share-project'>
            <Select
              style={{ width: '200px' }}
              native
              disableUnderline
              onChange={(event) => setSelectedShare({
                ...selectedShare,
                userID: event?.target?.value,
              })}
            >
              {renderUsersToShare()}
            </Select>
            <Select
              style={{ width: '100px' }}
              native
              disableUnderline
              onChange={(event) => setSelectedShare({
                ...selectedShare,
                role: event?.target?.value,
              })}
            >
              {renderRolesToShare()}
            </Select>
            <PrimaryButtonUI
              title='Share'
              handleClick={() => handleShare(selectedShare?.['role'], selectedShare?.['userID'])}
              disabled={loading || !haveWritePermission}
            />
          </div>
            <Typography variant='body2' style={{ fontWeight: 600, margin: '10px 0' }}>
              SHARED WITH
            </Typography>
          {renderUsersSharedWith()}
        </DialogContent>
      </Dialog>
    </div>
  );
};
