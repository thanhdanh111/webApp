import { Typography } from '@material-ui/core';
import { Task } from 'helpers/type';
import { updateAssignUserThunkAction } from 'pages/task_boards/logic/task_boards_reducer';
import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import AssignUser from './assign_user';

interface InitialProp {
  task: Task;
}

const TasksUI: FunctionComponent<InitialProp> = (props: InitialProp) => {
  const dispatch = useDispatch();
  const { task }: InitialProp = props;

  const taskName = task?.title?.split('_').join(' ');
  const taskID = task?._id?.slice(0, 6);

  const handleAssign = (user) => {
    let userAssigns = task?.userIDs?.map((each) => each._id) as string[];
    const isAssignUser = task?.userIDs?.filter((assigned) => assigned?._id === user?.userID?._id)
    .length !== 0;

    if (isAssignUser) {
      userAssigns = userAssigns?.filter((assigned) => assigned !== user?.userID?._id);

      return dispatch(updateAssignUserThunkAction(task._id, userAssigns));
    }

    userAssigns = [...userAssigns, user?.userID?._id];

    dispatch(updateAssignUserThunkAction(task._id, userAssigns));
  };

  return (
        <div className='task-item'>
            <Typography className='text-board' component='span'>Team</Typography>
            <div className='task-title'>
                <Typography component='span' className='task-name'>{taskName}</Typography>
                {task?.userIDs?.length &&
                  <AssignUser usersAssigned={task?.userIDs} handleAssign={handleAssign}/>}
            </div>
            <div className='footer-task'>
              <Typography className='task-id'>{`#${taskID}`}</Typography>
            </div>
        </div>
  );
};

export default (TasksUI);
