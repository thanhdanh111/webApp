import { Typography } from '@material-ui/core';
import { renameTaskStatusThunkAction,  TaskBoardsType } from 'pages/task_boards/logic/task_boards_reducer';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { TaskStatus } from 'helpers/type';
import { setTemplateTitleStatus } from 'pages/task_boards/logic/task_boards_action';
import { RootState } from 'redux/reducers_registration';

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
  const { templateTitleStatus }: TaskBoardsType = useSelector((state: RootState) => state.taskBoards);
  const newTaskRef = useRef<HTMLTitleElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTemplateTitleStatus(taskStatusID?.title));
  }, [taskStatusID]);

  if (!renaming) {
    return (
      <>
        <Typography className='name-status' ref={newTaskRef}>{taskStatusID?.title}</Typography>
        <Typography className='quality-task'>{taskStatusID?.taskIDs?.length}</Typography>
      </>
    );
  }

  const submitReTitleTaskStatus = () => {
    dispatch(renameTaskStatusThunkAction(taskStatusID?._id));
  };

  const handleChangeTitle = (event) => {
    if (templateTitleStatus === event?.target?.value) {
      return;
    }

    dispatch(setTemplateTitleStatus(event.target.value));
  };

  const handleCloseChange = () => {
    setRetitleStatus();
    dispatch(setTemplateTitleStatus(taskStatusID?.title));
  };

  return (
    <div className='rename-status'>
      <input
        type='text'
        value={templateTitleStatus}
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
