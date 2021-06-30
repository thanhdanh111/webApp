import React from 'react';
import {
  Dialog, Typography,
  DialogContent, DialogContentText, DialogTitle, IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { DocProject, PageContent } from '../logic/docs_reducer';
import { RootState } from 'redux/reducers_registration';

interface ShareComponentData {
  loading: boolean;
  selectedPage: PageContent;
  selectedProject: DocProject;
  openShare: boolean;
}

type ShareComponentDataType = ShareComponentData;

export const ShareComponent = ({ open }) => {
  const dispatch = useDispatch();
  const {
    loading,
    selectedPage,
    selectedProject,
    openShare,
  }: ShareComponentDataType = useSelector((state: RootState) => {

    return {
      loading: state?.docs?.loading,
      selectedPage: state?.docs?.selectedPage,
      selectedProject: state?.docs?.selectedDocProject,
      openShare: state?.docs?.openShare,
    };
  }, shallowEqual);

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle>
          <div>
            <Typography style={{ fontWeight: 600 }} variant='subtitle1' color='primary' >
              {`Share ${selectedProject?.title}`}
            </Typography>
            <IconButton
              className='confirm-dialog--close-btn'
              color='primary'
            >
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Let Google help apps determine location. This means sending anonymous location data to
            Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};
