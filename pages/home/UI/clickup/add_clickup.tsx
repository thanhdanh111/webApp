import {
  Box,
  Button,
  InputBase,
  Link,
} from '@material-ui/core';
import React, { useState } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import Tooltip from '@material-ui/core/Tooltip';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { addTaskThunkAction } from 'pages/home/logic/home_reducer';
import { setTypeCreateTask } from 'pages/home/logic/home_actions';
import Panel from './panel_task_clickup';
import { Task } from 'helpers/type';
import AssignUser from './assign_user_clickup';

interface InitProps {
  taskStatusID: string;
  companyID: string;
}

const AddTask: React.FC<InitProps> = (props) => {
  const [task, setTask] = useState<Task>({ title: '' });
  const dispatch = useDispatch();
  const authState = useSelector((state: RootStateOrAny) => state.auth);
  const [userAssign, setUserAssign] = useState([
    {
      _id: authState.userID,
      profilePhoto: authState.userProfile.profilePhoto,
      fullName: `
        ${authState.userProfile.firstName} ${authState.userProfile.lastName}`,
    },
  ]);

  const onChangeTitle = (event) => {
    setTask({ ...task, [event.target.name]: event.target.value });

    if (event.keyCode !== 13) {
      return;
    }

    addNewTask();
  };

  const addNewTask = () => {
    if (!task.title) {
      return;
    }

    const newTask = {
      ...task,
      taskStatusID: props.taskStatusID,
      userIDs: userAssign.map((user) => user?._id),
    };
    dispatch(addTaskThunkAction(newTask, props.companyID));
    dispatch(setTypeCreateTask(''));
  };

  return (
    <Box className='task-add' position='relative' mx={3}>
      <Box display='flex' flexDirection='row' alignItems='center'>
        <Box
          className='icon-add'
          onClick={() => dispatch(setTypeCreateTask(''))}
        >
          <CloseIcon />
        </Box>
        <Box mx={1}>
          <InputBase
            placeholder="Task name or type '/' for commands"
            name='title'
            onKeyUp={onChangeTitle}
          />
        </Box>
        <AssignUser userAssign={userAssign} setUserAssign={setUserAssign} />
      </Box>
      <Box height='25px' />
      <Box display='flex' px={2} pb={'10px'} fontWeight={100}>
        <Panel setTask={setTask} task={task} />
      </Box>
      <Box position='absolute' bottom={10} right={10}>
        <Tooltip
          title={
            task.title
              ? 'Press enter to save (ctrl+enter to open)'
              : 'Please type a task name'
          }
          arrow={true}
          placement='top'
        >
          <Button
            className='save-add'
            variant='contained'
            size='small'
            color='primary'
            onClick={() => addNewTask()}
          >
            Save
          </Button>
        </Tooltip>
      </Box>
      <Box
        position='absolute'
        bottom={0}
        top={0}
        right={-10}
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        fontSize={3}
        className='direct-add'
      >
        <Box className='box-direct'>
          <Box>
            <Link className='actions-status'>
              <ArrowUpwardIcon className='icon-direct' fontSize='small' />
            </Link>
          </Box>
          <Box>
            <Link className='actions-status'>
              <ArrowDownwardIcon className='icon-direct' fontSize='small' />
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddTask;
