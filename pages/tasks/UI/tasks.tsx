import { Typography, Backdrop, Modal, IconButton } from '@material-ui/core';
import { Task } from 'helpers/type';
import { updateAssignUserThunkAction, deletedTaskThunkAction, getTaskByIdThunkAction } from 'pages/task_boards/logic/task_boards_reducer';
import { useDispatch } from 'react-redux';
import AssignUser from './assign_user';
import { checkInArrayString } from 'helpers/check_in_array';
import React, { FunctionComponent, useState } from 'react';
import TaskDetail from './task_detail';
import { getTaskDetail } from 'pages/task_boards/logic/task_boards_action';
import { ConfirmDialog } from '@components/confirm_dialog/confirm_dialog';
import DeleteIcon from '@material-ui/icons/Delete';

interface InitialProp {
  task: Task;
}

const TasksUI: FunctionComponent<InitialProp> = (props: InitialProp) => {
  const dispatch = useDispatch();
  const { task }: InitialProp = props;
  const [open, setOpen] = useState(false);
  const taskName = task?.title?.split('_').join(' ');
  const taskID = task?._id?.slice(0, 6);

  const [openDetail, setOpenDetail] = React.useState(false);

  const handleOpen = () => {
    setOpenDetail(true);
    dispatch(getTaskDetail({ title: '', _id: '' }));
  };

  const handleClose = () => {
    setOpenDetail(false);
  };

  const getTask = () => {
    dispatch(getTaskByIdThunkAction(task?._id));
  };

  const handleAssign = (user) => {

    let userAssigns = task?.userIDs?.map((each) => each._id) as string[];
    const checkAssignedOfUser = checkInArrayString(userAssigns, user?.userID?._id);

    if (checkAssignedOfUser) {
      const removedUsers = userAssigns.filter((assignedUser) => user.userID._id !== assignedUser);

      return dispatch(updateAssignUserThunkAction(task._id, removedUsers));
    }

    userAssigns = [...userAssigns, user?.userID?._id];

    dispatch(updateAssignUserThunkAction(task._id, userAssigns));
  };

  const cancelDelete = () => {
    setOpen(false);
  };

  const agreeToRemoveTask = () => {
    dispatch(deletedTaskThunkAction(task));
  };

  return (
    <>
        <div className='task-item'>
            <Typography className='text-board' component='span'>Team</Typography>
            <div className='task-title'>
                <Typography
                  component='span'
                  className='task-name'
                  onClick={() => { getTask(); handleOpen(); }}
                >{taskName}
                </Typography>
                <AssignUser usersAssigned={task?.userIDs} handleAssign={handleAssign} sizes='assigned-user-avatar'/>
            </div>
            <div className='footer-task'>
              <Typography className='task-id'>{`#${taskID}`}</Typography>
              <IconButton className='delete-task' onClick={() => setOpen(true)}>
                <DeleteIcon className='delete-task-icon' />
              </IconButton>
              <ConfirmDialog
                warning='Are you sure you want to CONTINUE?'
                onOpen={open}
                handleClose={cancelDelete}
                handleNo={cancelDelete}
                handleYes={agreeToRemoveTask}
                status='REMOVE'
              />
            </div>
        </div>
        <Modal
          open={openDetail}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500 }}
          className='detail-modal'
        >
            <TaskDetail close={handleClose}/>
        </Modal>
    </>
  );
};

export default (TasksUI);
