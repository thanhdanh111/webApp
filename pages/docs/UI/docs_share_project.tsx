import React, { useState } from 'react';
import {
  Dialog, Typography, Select,
  DialogContent, DialogTitle, IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { DocProject, PageContent, UsersInCompanyMap } from '../logic/docs_reducer';
import { RootState } from 'redux/reducers_registration';
import { updateDocs } from '../logic/docs_actions';
import PrimaryButtonUI from '@components/primary_button/primary_button';
import UserAvatar from '../../../components/user_avatar/info_user';
import { shareDocument } from '../logic/docs_apis';
import { DocsRole, ProjectAccessMapOfUsers } from '../logic/get_folder_access';

interface ShareComponentData {
  loading: boolean;
  selectedPage: PageContent;
  selectedProject: DocProject;
  openShare: boolean;
  usersInCompanyMap: UsersInCompanyMap;
  projectAccessOfUsers: ProjectAccessMapOfUsers;
  accountUserID: string;
}

type ShareComponentDataType = ShareComponentData;

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

export const ShareComponent = () => {
  const dispatch = useDispatch();
  const [selectedShare, setSelectedShare] = useState({
    role: '',
    userID: '',
  });
  const {
    selectedProject,
    openShare,
    usersInCompanyMap,
    loading,
    projectAccessOfUsers,
    accountUserID,
    selectedPage,
  }: ShareComponentDataType = useSelector((state: RootState) => {

    return {
      usersInCompanyMap: state?.docs?.usersInCompanyMap,
      loading: state?.docs?.loading,
      selectedPage: state?.docs?.selectedPage,
      selectedProject: state?.docs?.selectedDocProject,
      openShare: state?.docs?.openShare,
      projectAccessOfUsers: state?.docs?.projectAccessOfUsers,
      accountUserID: state?.userInfo?.userID,
    };
  }, shallowEqual);

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
        <option value={userID}>
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
        <option value={defaultRoles[role].role}>
          {defaultRoles[role].name}
        </option>,
      );
    }

    return rolesToSelect;
  }

  function onClickShare() {
    const role = selectedShare?.role;
    const userID = selectedShare?.userID;

    if (!role?.length || !userID?.length) {
      return;
    }

    dispatch(shareDocument({ role, userID }));
  }

  function renderRolesOfUser(isOwner, rolesOfUser) {
    if (isOwner) {
      return <div className='users-shared-with--owner'>Owner</div>;
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

      let isOwner = (selectedProject?.createdBy?.['_id'] ?? selectedProject?.createdBy)  === userID;
      const userProfile = projectAccessOfUsers?.[userID]?.[selectedProjectID]?.ownerInfo;

      if (!userProfile) {

        continue;
      }

      let rolesOfUser = projectAccessOfUsers?.[userID]?.[selectedProjectID]?.roles;
      const haveNoWritePermissionInFolder = !rolesOfUser?.includes(DocsRole.WRITE);

      if (selectedPageID && haveNoWritePermissionInFolder) {
        rolesOfUser = projectAccessOfUsers?.[userID]?.[selectedProjectID]?.accessInPages?.[selectedPageID] ?? ['READ'];
      }

      if (selectedPageID) {
        isOwner = selectedPage?.createdBy?._id === userID;
      }

      usersRender.push(
        <div key={userID} className='users-shared-with'>
          <UserAvatar user={userProfile}  style='notification-img'/>
          <Typography className='users-shared-with--name' style={{ marginLeft: '20px' }}>
            {`${userProfile?.lastName} ${userProfile.firstName}`}
          </Typography>
          {renderRolesOfUser(isOwner, rolesOfUser)}
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
              handleClick={() => onClickShare()}
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
