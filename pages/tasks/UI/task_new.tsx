import { Box, Button, InputBase } from '@material-ui/core';
import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import Tooltip from '@material-ui/core/Tooltip';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import Panel from './panel_task';
import AssignUser from './assign_user';
import { setTypeCreateTask, updateNewTask } from 'pages/task_boards/logic/task_boards_action';
import { addTaskThunkAction } from 'pages/task_boards/logic/task_boards_reducer';
import DirectNewTask from './direct_new_task';

interface InitProps {
  taskStatusID: string;
  companyID: string;
}

const TaskNew: React.FC<InitProps> = (props) => {
  const dispatch = useDispatch();
  const newTask = useSelector((state: RootStateOrAny) => state.taskBoards?.newTask);
  const usersAssigned = useSelector((state: RootStateOrAny) => state.taskBoards?.usersAssigned);

  const onChangeTitle = (event) => {
    dispatch(updateNewTask({ ...newTask, title: event.target.value }));

    if (event.keyCode !== 13) {
      return;
    }
    addNewTask();
  };

  const addNewTask = () => {
    if (!newTask?.title) {
      return;
    }
    dispatch(updateNewTask({
      ...newTask,
      taskStatusID: props.taskStatusID,
      userIDs: usersAssigned?.map((user) => user._id),
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
            newTask?.title
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
      <DirectNewTask/>
    </Box>
  );
};

export default TaskNew;
