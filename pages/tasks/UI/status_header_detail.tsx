import { Box, Button } from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import AssignUser from './assign_user';
import OutlinedFlagIcon from '@material-ui/icons/OutlinedFlag';
import DoneIcon from '@material-ui/icons/Done';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { updateAssignUserThunkAction } from 'pages/task_boards/logic/task_boards_reducer';
import { checkAssignedUserID } from 'helpers/check_assigned';

const StatusDetail = () => {
  const task = useSelector((state: RootStateOrAny) => state.taskBoards.taskDetail);
  const dispatch = useDispatch();

  const getAssignUser = (user) => {
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
    <Box display='flex' alignItems='center' alignContent='center' py='15px' pl={4} className='status-modal'>
      <Box display='flex' height='30px' className='status-detail'>
        <button className='btn-status'>STATUS</button>
        <button className='btn-status'><ArrowRightIcon/></button>
      </Box>
      <Button variant='outlined' color='primary' className='btn-detail done-detail'>
         <DoneIcon className='icon-detail done-icon'/>
      </Button>
      <AssignUser usersAssigned={task.userIDs} handleAssign={getAssignUser} sizes='assigned-user-avatar'/>
      <Box className='priority-detail' display='flex' alignItems='center'>
        <OutlinedFlagIcon className='border-dashed-icon priority-icon'/>
      </Box>
    </Box>
  );
};

export default StatusDetail;
