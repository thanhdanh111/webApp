import { Typography, Backdrop, Modal } from '@material-ui/core';
import { Task } from 'helpers/type';
import React, { FunctionComponent } from 'react';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import { checkArray } from 'helpers/check_array';
import TaskDetail from './task_detail';
import { getTaskByIdThunkAction } from 'pages/task_boards/logic/task_boards_reducer';
import { useDispatch } from 'react-redux';
import { getTaskDetail } from 'pages/task_boards/logic/task_boards_action';

interface InitialProp {
  task: Task;
}

const TasksUI: FunctionComponent<InitialProp> = (props: InitialProp) => {
  const dispatch = useDispatch();
  const { task }: InitialProp = props;

  const taskName = task?.title?.split('_').join(' ');
  const taskID = task?._id?.slice(0, 6);

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
    dispatch(getTaskDetail({ title: '', _id: '' }));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getTask = () => {
    dispatch(getTaskByIdThunkAction(task?._id));
  };

  return (
    <>
        <div className='task-item' onClick={() => { getTask(); handleOpen(); }}>
            <Typography className='text-board' component='span'>Team</Typography>
            <div className='task-title'>
                <Typography component='span' className='task-name'>{taskName}</Typography>
                <AvatarGroup max={2}>
                    {checkArray(task?.userIDs) ?
                    task?.userIDs?.map((user) => {
                      return (
                        <Avatar key={user.email} alt={user.firstName} src={user.profilePhoto} />
                      );
                    }) : null}
                </AvatarGroup>
            </div>
            <div className='footer-task'>
              <Typography className='task-id'>{`#${taskID}`}</Typography>
            </div>
        </div>
        <Modal
          open={open}
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
