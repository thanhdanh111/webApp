import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import { Menu } from '@material-ui/core';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { assignUser } from 'pages/task_boards/logic/task_boards_action';
import { getPaginationThunkAction } from 'pages/users/logic/users_reducer';
import GroupUserAssigned from './group_user_assigned';
import AssignUserPopup from './assign_user_popup';

const AssignUser: React.FC = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootStateOrAny) => state.userInfo);

  useEffect(() => {
    dispatch(assignUser({
      _id: userInfo?.userID,
      profilePhoto: userInfo?.profile?.profilePhoto,
      fullName: `
        ${userInfo?.profile?.firstName} ${userInfo?.profile?.lastName}`,
    }));
    getUser();
  }, []);

  const getUser = () => {
    dispatch(getPaginationThunkAction());
  };

  return (
    <PopupState variant='popover'>
      {(popupState) => (
        <div>
          <div {...bindTrigger(popupState)}>
          <GroupUserAssigned userInfo={userInfo}/>
          </div>
          <Menu
            {...bindMenu(popupState)}
            autoFocus={false}
            className='user-popup'
          >
            <AssignUserPopup getUser={getUser}/>
          </Menu>
        </div>
      )}
    </PopupState>
  );
};

export default AssignUser;
