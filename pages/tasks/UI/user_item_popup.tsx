import { Avatar, Box, MenuItem } from '@material-ui/core';
import { UserAccess } from 'helpers/type';
import { assignUser, unassignUser } from 'pages/task_boards/logic/task_boards_action';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';

interface InitProps {
  userAccess: UserAccess;
}
const UserItem: React.FC<InitProps> = (props) => {
  const { userAccess }: InitProps = props;
  const dispatch = useDispatch();
  const usersAssigned = useSelector((state: RootStateOrAny) => state.taskBoards?.usersAssigned);

  const updateUsersAssigned = (user) => {
    if (isAssignUser(user)){
      dispatch(unassignUser(user.userID?._id));

      return;
    }
    dispatch(assignUser({
      _id: user.userID?._id,
      profilePhoto: user.userID?.profilePhoto,
      fullName: `${user.userID?.firstName} ${user.userID?.lastName}`,
    }));
  };

  const isAssignUser = (user) => {
    return (
      usersAssigned.filter((assign) => assign?._id === user.userID?._id)
        .length !== 0
    );
  };

  return (
    <MenuItem onClick={() => updateUsersAssigned(userAccess)}>
    <Box
      display='flex'
      alignItems='center'
      className={isAssignUser(userAccess) ? 'user-accept' : ''}
    >
        <Avatar
          src={userAccess.userID?.profilePhoto}
          className='avata-popup'
        />
      <span className='name-popup'>
        {`${userAccess.userID?.firstName} ${userAccess.userID?.lastName}`}
      </span>
    </Box>
  </MenuItem>
  );
};
export default UserItem;
