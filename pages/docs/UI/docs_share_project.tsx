import React, { useEffect } from 'react';
import {
  Dialog, Typography, TextField,
  DialogContent, DialogTitle, IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { DocProject, PageContent } from '../logic/docs_reducer';
import { RootState } from 'redux/reducers_registration';
import { updateDocs } from '../logic/docs_actions';
import PrimaryButtonUI from '@components/primary_button/primary_button';
import { ProjectAccessMapOfUsers } from '../logic/get_folder_access';
import UserAvatar from '../../../components/user_avatar/info_user';
import { getFolderAccessOfCurrentProjectID } from '../logic/docs_apis';

interface ShareComponentData {
  loading: boolean;
  selectedPage: PageContent;
  selectedProject: DocProject;
  openShare: boolean;
  selectedProjectAccess: ProjectAccessMapOfUsers;
}

type ShareComponentDataType = ShareComponentData;

export const ShareComponent = () => {
  const dispatch = useDispatch();
  const {
    selectedProject,
    openShare,
    selectedProjectAccess,
  }: ShareComponentDataType = useSelector((state: RootState) => {

    return {
      loading: state?.docs?.loading,
      selectedPage: state?.docs?.selectedPage,
      selectedProject: state?.docs?.selectedDocProject,
      openShare: state?.docs?.openShare,
      selectedProjectAccess: state?.docs?.selectedProjectAccess,
    };
  }, shallowEqual);

  useEffect(() => {
    dispatch(getFolderAccessOfCurrentProjectID());
  }, []);

  function handleClose() {
    dispatch(updateDocs({ openShare: false }));
  }

  function renderUsersSharedWith() {
    const usersRender: JSX.Element[] = [];

    for (const userID in selectedProjectAccess) {
      if (!userID) {
        continue;
      }
      const userProfile = selectedProjectAccess[userID];

      usersRender.push(
        <div key={userID} className='users-shared-with'>
          <UserAvatar user={userProfile}  style='notification-img'/>
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
              {`Share ${selectedProject?.title}`}
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
        <DialogContent style={{ flexDirection: 'column' }}>
          <Typography variant='body1' style={{ fontWeight: 600 }}>
            Invite
          </Typography>
          <div className='share-project'>
            <TextField
              autoFocus
              margin='dense'
              id='name'
              type='email'
              placeholder='Type email'
              fullWidth
              style={{ marginRight: '20px' }}
            />
            <PrimaryButtonUI
              title='Share'
              handleClick={() => {}}
            />
            <Typography variant='body1' style={{ fontWeight: 600 }}>
              SHARED WITH
            </Typography>
            {renderUsersSharedWith()}

          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
