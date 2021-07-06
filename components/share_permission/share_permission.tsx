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

interface ShareComponentData {
  loading: boolean;
  selectedPage: PageContent;
  selectedProject: DocProject;
  openShare: boolean;
  usersInCompanyMap: UsersInCompanyMap;
  projectAccessOfUsers: ProjectAccessMapOfUsers;
  accountUserID: string;
  handleShare: (role, userID) => void;
}

const defaultRoles = {
  NONE: {
    role: '',
    name: 'None',
  },
  WRITE: {
    role: 'WRITE',
    name: 'Can write',
  },
  READ: {
    role: 'READ',
    name: 'Can read',
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
}: ShareComponentData) => {
  const dispatch = useDispatch();
  const [selectedShare, setSelectedShare] = useState({
    role: '',
    userID: '',
  });

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

  function renderRolesOfUser(currentUserID, rolesOfUser) {
    let isOwner = (selectedProject?.createdBy?.['_id'] ?? selectedProject?.createdBy)  === currentUserID;
    const selectedPageID = selectedPage?._id;

    if (isOwner) {
      return <div className='users-shared-with--owner'>Owner</div>;
    }

    if (selectedPageID) {
      isOwner = selectedPage?.createdBy?._id === currentUserID;
    }

    return rolesOfUser?.length ?  <Select
      style={{ width: '100px' }}
      native
      disableUnderline
      className='users-shared-with--select'
    >
      {
        rolesOfUser.map((role) => <option key={role}>
          {defaultRoles[role].name}
        </option>)
      }
    </Select> : <div />;
  }

  function renderUsersSharedWith() {
    const usersRender: JSX.Element[] = [];
    const selectedProjectID = selectedProject?._id ?? '';
    const selectedPageID = selectedPage?._id;

    for (const userID in projectAccessOfUsers) {
      if (!userID) {
        continue;
      }

      const userProfile = projectAccessOfUsers?.[userID]?.[selectedProjectID]?.ownerInfo;

      if (!userProfile) {

        continue;
      }

      let rolesOfUser = projectAccessOfUsers?.[userID]?.[selectedProjectID]?.roles;
      const haveNoWritePermissionInFolder = !rolesOfUser?.includes(DocsRole.WRITE);

      if (selectedPageID && haveNoWritePermissionInFolder) {
        rolesOfUser = projectAccessOfUsers?.[userID]?.[selectedProjectID]?.accessInPages?.[selectedPageID] ?? ['READ'];
      }

      usersRender.push(
        <div key={userID} className='users-shared-with'>
          <UserAvatar user={userProfile}  style='notification-img'/>
          <Typography className='users-shared-with--name' style={{ marginLeft: '20px' }}>
            {`${userProfile?.lastName} ${userProfile.firstName}`}
          </Typography>
          {renderRolesOfUser(userID, rolesOfUser)}
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
        maxWidth='xs'
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
        <DialogContent>
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
                userID: event?.target?.value as string,
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
                role: event?.target?.value as string,
              })}
            >
              {renderRolesToShare()}
            </Select>
            <PrimaryButtonUI
              title='Share'
              handleClick={() => handleShare(selectedShare?.role, selectedShare?.userID)}
              disabled={loading}
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
