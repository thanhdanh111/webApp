import { Avatar, Box, MenuItem } from '@material-ui/core';
import { UserAccess } from 'helpers/type';
// import { assignUser, unassignUser } from 'pages/task_boards/logic/task_boards_action';
// import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';

interface InitProps {
  userAccess: UserAccess;
  handleAssign: () => void;
  isAssign?: boolean;
}
const UserItem: React.FC<InitProps> = (props) => {
  const { userAccess, handleAssign, isAssign }: InitProps = props;

  return (
    <MenuItem onClick={handleAssign}>
    <Box
      display='flex'
      alignItems='center'
      className={isAssign ? 'user-accept' : ''}
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
