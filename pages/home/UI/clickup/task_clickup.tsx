import { Typography } from '@material-ui/core';
import { Task } from 'helpers/type';
import React, { FunctionComponent } from 'react';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import { checkArray } from 'helpers/check_array';

interface InitialProp {
  task: Task;
}

const TaskItem: FunctionComponent<InitialProp> = (props: InitialProp) => {

  const { task }: InitialProp = props;

  const taskName = task?.title?.split('_').join(' ');
  const taskID = task?._id?.slice(0, 6);

  return (
        <div className='task-item'>
            <Typography className='text-board' component='span'>Team</Typography>
            <div className='task-title'>
                <Typography component='span' className='task-name'>{taskName}</Typography>
                <AvatarGroup max={2}>
                    {checkArray(task?.userIDs) ?
                    task.userIDs.map((user) => {
                      return (
                        <Avatar key={user.email} alt={user.firstName} src={user.profilePicture} />
                      );
                    }) : null}
                </AvatarGroup>
            </div>
            <div className='footer-task'>
              <Typography className='task-id'>{`#${taskID}`}</Typography>
            </div>
        </div>
  );
};

export default (TaskItem);
