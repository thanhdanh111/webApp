import { Avatar, Box, MenuItem } from '@material-ui/core';
import { UserAccess } from 'helpers/type';

interface InitProps {
  userAccess: UserAccess;
  handleAssign?: () => void;
  isAssigned?: boolean;
}
const UserItem: React.FC<InitProps> = (props) => {
  const { userAccess, handleAssign, isAssigned }: InitProps = props;

  return (
    <MenuItem onClick={handleAssign}>
      <Box
        display='flex'
        alignItems='center'
        className={isAssigned ? 'user-accept' : ''}
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
