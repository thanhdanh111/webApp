import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import { Menu } from '@material-ui/core';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
// import { useEffect } from 'react';
import { getPaginationThunkAction } from 'pages/users/logic/users_reducer';
import GroupUserAssigned from './group_user_assigned';
import AssignUserPopup from './assign_user_popup';
import { User } from 'helpers/type';

interface InitialProps {
  usersAssigned: User[];
  handleAssign: (user) => void;
}

const AssignUser: React.FC<InitialProps> = (props) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootStateOrAny) => state.userInfo);
  const { usersAssigned, handleAssign }: InitialProps = props;

  // useEffect(() => {
  //   getUser();
  // }, []);

  const getUser = () => {
    dispatch(getPaginationThunkAction());
  };

  return (
    <PopupState variant='popover'>
      {(popupState) => (
        <div>
          <div {...bindTrigger(popupState)}>
          <GroupUserAssigned currentUser={userInfo} usersAssigned={usersAssigned}/>
          </div>
          <Menu
            {...bindMenu(popupState)}
            autoFocus={false}
            className='user-popup'
          >
            <AssignUserPopup handleAssign={handleAssign} getUser={getUser} usersAssigned={usersAssigned}/>
          </Menu>
        </div>
      )}
    </PopupState>
  );
};

export default AssignUser;
