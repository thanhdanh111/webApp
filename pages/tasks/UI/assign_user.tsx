import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import { Menu } from '@material-ui/core';
import { RootStateOrAny, useSelector } from 'react-redux';
import GroupUserAssigned from './group_user_assigned';
import UsersPopupUI from 'components/users_popup/users_popup';
import { User } from 'helpers/type';
import { checkHasObjectByKey } from 'helpers/check_in_array';

interface InitialProps {
  usersAssigned?: User[];
  handleAssign: (users) => void;
  sizes: string;
}

const AssignUser: React.FC<InitialProps> = (props) => {
  const userInfo = useSelector((state: RootStateOrAny) => state.userInfo);
  const { usersAssigned, handleAssign, sizes }: InitialProps = props;

  const handleUsersAssign = (user) => {
    let tempAssign = usersAssigned || [];
    const checkAssignedOfUser = checkHasObjectByKey(usersAssigned, user?.userID?._id, '_id');

    if (checkAssignedOfUser && usersAssigned?.length){

      tempAssign = usersAssigned?.filter((each) => user?.userID?._id !== each._id);

      return handleAssign(tempAssign);
    }

    tempAssign = [...tempAssign, user?.userID];

    return handleAssign(tempAssign);
  };

  return (
    <PopupState variant='popover'>
      {(popupState) => (
        <div>
          <div {...bindTrigger(popupState)} className='choose-assign-user'>
            <GroupUserAssigned currentUser={userInfo} usersAssigned={usersAssigned} sizes={sizes} />
          </div>
          <Menu
            {...bindMenu(popupState)}
            autoFocus={false}
            className='user-popup'
          >
            <UsersPopupUI chooseUser={handleUsersAssign} usersAssigned={usersAssigned}/>
          </Menu>
        </div>
      )}
    </PopupState>
  );
};

export default AssignUser;
