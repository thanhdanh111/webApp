import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Tooltip from '@material-ui/core/Tooltip';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { Avatar, Badge } from '@material-ui/core';
import { User, UserInfo } from 'helpers/type';

interface InitProps {
  currentUser: UserInfo;
  usersAssigned: User[];
  sizes: string;
}

const GroupUserAssigned: React.FC<InitProps> = (props) => {
  const { usersAssigned, currentUser, sizes }: InitProps = props;

  return (
    <AvatarGroup
      max={3}
      spacing='medium'
      className='group-avatar-task'
    >
      {usersAssigned?.length > 0 ? (
        usersAssigned?.map((user) => {
          const fullName = `${user?.firstName} ${user?.lastName}`;

          return (
            <Badge
              key={user._id}
              overlap='circle'
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              variant='dot'
              className='badge-task'
            >
              <Tooltip
                title={
                  user?._id === currentUser?.userID ? "I'm online" : fullName
                }
                arrow={true}
                placement='top'
              >
                <Avatar
                  className={`avata-task ${sizes}`}
                  src={user.profilePhoto}
                />
              </Tooltip>
            </Badge>

          );
        })) : (
        <Tooltip title='Assign' arrow={true} placement='top'>
          <PersonAddIcon className='no-user-assign' />
        </Tooltip>
      )}
    </AvatarGroup>
  );
};

export default GroupUserAssigned;
