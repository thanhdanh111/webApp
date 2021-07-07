import { Box, Button, InputBase } from '@material-ui/core';
import React, { useEffect } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import Tooltip from '@material-ui/core/Tooltip';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import Panel from './panel_task';
import AssignUser from './assign_user';
import { assignUser, setTypeCreateTask, unassignUser, updateNewTask } from 'pages/task_boards/logic/task_boards_action';
import { addTaskThunkAction } from 'pages/task_boards/logic/task_boards_reducer';
import DirectNewTask from './direct_new_task';
import { checkAssigned } from 'helpers/check_assigned';

interface InitProps {
  taskStatusID: string;
  companyID: string;
}

const TaskNew: React.FC<InitProps> = (props) => {
  const dispatch = useDispatch();
  const newTask = useSelector((state: RootStateOrAny) => state.taskBoards?.newTask);
  const usersAssigned = useSelector((state: RootStateOrAny) => state.taskBoards?.usersAssigned);
  const userInfo = useSelector((state: RootStateOrAny) => state.userInfo);

  useEffect(() => {
    dispatch(assignUser({
      _id: userInfo?.userID,
      profilePhoto: userInfo?.profile?.profilePhoto,
      fullName: `
        ${userInfo?.profile?.firstName} ${userInfo?.profile?.lastName}`,
    }));
  }, []);

  const handleAssign = (user) => {
    const checkAssignedOfUser = checkAssigned(usersAssigned, user?.userID?._id);

    if (checkAssignedOfUser){
      dispatch(unassignUser(user?.userID?._id));

      return;
    }
    dispatch(assignUser({
      _id: user?.userID?._id,
      profilePhoto: user.userID?.profilePhoto,
      fullName: `${user.userID?.firstName} ${user.userID?.lastName}`,
    }));
  };

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
        <AssignUser usersAssigned={usersAssigned} handleAssign={handleAssign} sizes='assigned-user-avatar'/>
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
