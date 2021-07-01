import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Tooltip from '@material-ui/core/Tooltip';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import SearchIcon from '@material-ui/icons/Search';
import InfiniteScroll from 'react-infinite-scroll-component';
import { DisappearedLoading } from 'react-loadingg';
import { Badge, Box, Menu, MenuItem, Input, Avatar } from '@material-ui/core';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { assignUser, unassignUser } from 'pages/task_boards/logic/task_boards_action';
import { getPaginationThunkAction, getSearchAction, useDebounce } from 'pages/users/logic/users_reducer';

const AssignUser: React.FC = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootStateOrAny) => state.userInfo);
  const listUser = useSelector((state: RootStateOrAny) => state.users);
  const usersAssigned = useSelector((state: RootStateOrAny) => state.taskBoards?.usersAssigned);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 200);

  const isAssignUser = (user) => {
    return (
      usersAssigned.filter((assign) => assign?._id === user.userID?._id)
        .length !== 0
    );
  };

  useEffect(() => {
    if (!debouncedSearchTerm) {
      return;
    }
    dispatch(getSearchAction(debouncedSearchTerm));
  }, [debouncedSearchTerm]);

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

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const generateUser = () => {
    const user = debouncedSearchTerm ? listUser.listSearch : listUser.list;
    const renderUser = user?.map((userAccess) => {
      return (
        <MenuItem key={userAccess._id} onClick={() => updateUsersAssigned(userAccess)}>
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
    });

    return renderUser;
  };

  return (
    <PopupState variant='popover'>
      {(popupState) => (
        <div>
          <AvatarGroup
            max={3}
            spacing='medium'
            className='group-avatar-task'
            {...bindTrigger(popupState)}
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
                      user._id === userInfo?.userID
                        ? "I'm online"
                        : user.fullName
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
          <Menu
            {...bindMenu(popupState)}
            autoFocus={false}
            className='user-popup'
          >
              <Box display='flex' alignItems='center' px={'16px'} py={'6px'}>
                <SearchIcon className='icon-search' />
                <Input
                  placeholder='Search'
                  className='nav-input-search'
                  value={searchTerm}
                  onChange={handleChange}
                />
              </Box>
              <InfiniteScroll
                dataLength={listUser?.list?.length}
                hasMore={listUser?.list?.length < listUser?.totalCount}
                next={getUser}
                loader={<DisappearedLoading color={'#67cb48'} />}
                scrollThreshold={0.8}
                height={200}
              >
                {generateUser()}
              </InfiniteScroll>
          </Menu>
        </div>
      )}
    </PopupState>
  );
};

export default AssignUser;
