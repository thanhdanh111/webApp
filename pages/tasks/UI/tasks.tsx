import { Typography } from '@material-ui/core';
import { Task } from 'helpers/type';
import { updateAssignUserThunkAction } from 'pages/task_boards/logic/task_boards_reducer';
import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import AssignUser from './assign_user';
import { checkAssignedUserID } from 'helpers/check_assigned';

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
    const checkAssignedOfUser = checkAssignedUserID(userAssigns, user?.userID?._id);

    if (checkAssignedOfUser) {
      const removedUsers = userAssigns.filter((assignedUser) => user.userID._id !== assignedUser);

      return dispatch(updateAssignUserThunkAction(task._id, removedUsers));
    }

    userAssigns = [...userAssigns, user?.userID?._id];

    dispatch(updateAssignUserThunkAction(task._id, userAssigns));
  };

  return (
        <div className='task-item'>
            <Typography className='text-board' component='span'>Team</Typography>
            <div className='task-title'>
                <Typography component='span' className='task-name'>{taskName}</Typography>
                <AssignUser usersAssigned={task?.userIDs} handleAssign={handleAssign} sizes='assigned-user-avatar'/>
            </div>
            <div className='footer-task'>
              <Typography className='task-id'>{`#${taskID}`}</Typography>
            </div>
        </div>
  );
};

export default (TasksUI);
