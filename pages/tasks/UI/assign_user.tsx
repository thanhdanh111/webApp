import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import { Menu } from '@material-ui/core';
import { RootStateOrAny, useSelector } from 'react-redux';
import GroupUserAssigned from './group_user_assigned';
import UsersPopupUI from 'components/users_popup/users_popup';
import { User } from 'helpers/type';

interface InitialProps {
  usersAssigned?: User[];
  handleAssign: (user) => void;
  sizes: string;
}

const AssignUser: React.FC<InitialProps> = (props) => {
  const userInfo = useSelector((state: RootStateOrAny) => state.userInfo);
  const { usersAssigned, handleAssign, sizes }: InitialProps = props;

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
            <UsersPopupUI chooseUser={handleAssign} usersAssigned={usersAssigned}/>
          </Menu>
        </div>
      )}
    </PopupState>
  );
};

export default AssignUser;
