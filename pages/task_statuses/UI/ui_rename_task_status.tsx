import { Typography } from '@material-ui/core';
import { renameTaskStatusThunkAction } from 'pages/task_boards/logic/task_boards_reducer';
import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { setRenamingStatus } from 'pages/task_boards/logic/task_boards_action';
import { TaskStatus } from 'helpers/type';

interface InitialProps {
  taskStatusID: TaskStatus;
  renaming?: boolean;
}

const RenameStatusUI = (props: InitialProps) => {
  const {
    taskStatusID,
    renaming,
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
    dispatch(renameTaskStatusThunkAction(retitle, taskStatusID));
  };

  return (
    <div className='rename-status'>
      <input className='add-status-input' value={taskStatusID?.title} onChange={(event) => setRetitle(event.target.value)} />
        <div className='close-create-status' onClick={() => dispatch(setRenamingStatus(false))}>
          <CloseIcon className='close-create-status-icon' />
        </div>
        <div className='submit-create-status' onClick={submitReTitleTaskStatus} >
          <CheckIcon className='submit-create-status-icon' />
        </div>
    </div>

  );
};

export default (RenameStatusUI);
