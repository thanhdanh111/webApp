import {
  Box,
  Button,
  InputBase,
  Link,
} from '@material-ui/core';
import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import Tooltip from '@material-ui/core/Tooltip';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { addTaskThunkAction } from '../../home/logic/home_reducer';
import { setTypeCreateTask, updateNewTask } from '../../home/logic/home_actions';
import Panel from './panel_task_clickup';
import AssignUser from './assign_user_clickup';

interface InitProps {
  taskStatusID: string;
  companyID: string;
}

const TaskNew: React.FC<InitProps> = (props) => {
  const dispatch = useDispatch();
  const newTask = useSelector((state: RootStateOrAny) => state.taskStatuses.newTask);
  const usersAssigned = useSelector((state: RootStateOrAny) => state.taskStatuses.usersAssigned);

  const onChangeTitle = (event) => {
    dispatch(updateNewTask({ ...newTask, title: event.target.value }));

    if (event.keyCode !== 13) {
      return;
    }

    addNewTask();
  };

  const addNewTask = () => {
    if (!newTask.title) {
      return;
    }

    dispatch(updateNewTask({
      ...newTask,
      taskStatusID: props.taskStatusID,
      userIDs: usersAssigned.map((user) => user?._id),
    }));

    dispatch(addTaskThunkAction(props.companyID));
  };

  return (
    <Box className='task-add' position='relative'>
      <Box display='flex' flexDirection='row' alignItems='center'>
          <CloseIcon onClick={() => dispatch(setTypeCreateTask(''))} className='icon-add close-icon'/>
          <InputBase
            placeholder="Task name or type '/' for commands"
            name='title'
            onKeyUp={onChangeTitle}
          />
        <AssignUser/>
      </Box>
      <Box display='flex' px={2} pb={'10px'} mt={'25px'} fontWeight={100}>
        <Panel/>
      </Box>
      <Box position='absolute' bottom={10} right={10}>
        <Tooltip
          title={
            newTask.title
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
          <div>
            <Link className='actions-status'>
              <ArrowUpwardIcon className='icon-direct' fontSize='small' />
            </Link>
          </div>
          <div>
            <Link className='actions-status'>
              <ArrowDownwardIcon className='icon-direct' fontSize='small' />
            </Link>
          </div>
        </Box>
      </Box>
    </Box>
  );
};

export default TaskNew;
