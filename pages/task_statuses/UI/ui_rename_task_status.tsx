import { Typography } from '@material-ui/core';
import { renameTaskStatusThunkAction } from 'pages/task_boards/logic/task_boards_reducer';
import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { TaskStatus } from 'helpers/type';

interface InitialProps {
  taskStatusID: TaskStatus;
  renaming?: boolean;
  setRetitleStatus: () => void;
}

const RenameStatusUI = (props: InitialProps) => {
  const {
    taskStatusID,
    renaming,
    setRetitleStatus,
  }: InitialProps = props;

  const newTaskRef = useRef<HTMLTitleElement>(null);
  const dispatch = useDispatch();

  const [retitle, setRetitle] = useState('');
  const [isChange, setIsChange] = useState(false);

  if (!renaming) {
    return (
      <>
        <Typography className='name-status' ref={newTaskRef}>{taskStatusID?.title}</Typography>
        <Typography className='quality-task'>{taskStatusID?.taskIDs?.length}</Typography>
      </>
    );
  }

  const submitReTitleTaskStatus = () => {
    if (retitle === taskStatusID?.title) {
      return;
    }

    dispatch(renameTaskStatusThunkAction(retitle, taskStatusID?._id));
  };

  const getDefaultValue = () => {
    if (isChange) {
      return retitle;
    }

    return taskStatusID?.title;
  };

  const handleChangeTitle = (event) => {
    setRetitle(event.target.value);

    setIsChange(true);
  };

  const handleCloseChange = () => {
    setRetitleStatus();

    setIsChange(false);
  };

  return (
    <div className='rename-status'>
      <input
        type='text'
        value={getDefaultValue()}
        className='add-status-input'
        onChange={handleChangeTitle}
      />
      <div className='close-create-status' onClick={handleCloseChange}>
        <CloseIcon className='close-create-status-icon' />
      </div>
      <div className='submit-create-status' onClick={submitReTitleTaskStatus} >
        <CheckIcon className='submit-create-status-icon' />
      </div>
    </div>

  );
};

export default (RenameStatusUI);
