import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Tooltip from '@material-ui/core/Tooltip';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { Avatar, Badge } from '@material-ui/core';
import { UserInfo } from 'helpers/type';
import { RootStateOrAny, useSelector } from 'react-redux';

interface InitProps {
  userInfo: UserInfo;
}

const GroupUserAssigned: React.FC<InitProps> = (props) => {
  const usersAssigned = useSelector((state: RootStateOrAny) => state.taskBoards?.usersAssigned);

  return (
    <AvatarGroup
      max={3}
      spacing='medium'
      className='group-avatar-task'
    >
      {usersAssigned?.length > 0 ? (
        usersAssigned?.map((user) => (
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
                user._id === props.userInfo?.userID ? "I'm online" : user.fullName
              }
              arrow={true}
              placement='top'
            >
              <Avatar
                className='avata-task'
                src={user.profilePhoto}
                sizes='20px'
              />
            </Tooltip>
          </Badge>
        ))
      ) : (
        <Tooltip title='Assign' arrow={true} placement='top'>
          <PersonAddIcon className='no-user-assign' />
        </Tooltip>
      )}
    </AvatarGroup>
  );
};

export default GroupUserAssigned;