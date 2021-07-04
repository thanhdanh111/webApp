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
  setRetitleStatus?: () => void;
}

const RenameStatusUI = (props: InitialProps) => {
  const {
    taskStatusID,
    renaming,
    setRetitleStatus,
  }: InitialProps = props;
  const newTaskRef = useRef<HTMLTitleElement>(null);
  const [retitle, setRetitle] = useState(taskStatusID?.title);
  const dispatch = useDispatch();

  if (!renaming) {
    return (
      <>
        <Typography className='name-status' ref={newTaskRef}>{taskStatusID?.title}</Typography>
        <Typography className='quality-task'>{taskStatusID?.taskIDs?.length}</Typography>
      </>
    );
  }

  const submitReTitleTaskStatus = () => {
    dispatch(renameTaskStatusThunkAction(retitle, taskStatusID?._id));
  };

  return (
    <div className='rename-status'>
      <input
        className='add-status-input'
        placeholder={taskStatusID?.title}
        onChange={(event) => setRetitle(event.target.value)}
      />
      <div className='close-create-status' onClick={setRetitleStatus}>
        <CloseIcon className='close-create-status-icon' />
      </div>
      <div className='submit-create-status' onClick={submitReTitleTaskStatus} >
        <CheckIcon className='submit-create-status-icon' />
      </div>
    </div>

  );
};

export default (RenameStatusUI);
