import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Tooltip from '@material-ui/core/Tooltip';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import SearchIcon from '@material-ui/icons/Search';
import InfiniteScroll from 'react-infinite-scroll-component';
import { DisappearedLoading } from 'react-loadingg';
import { Badge, Box, Menu, MenuItem, Input, Avatar } from '@material-ui/core';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import {
  getPaginationThunkAction,
  getSearchAction,
  useDebounce,
} from 'pages/users/logic/users_reducer';
import { useEffect, useState } from 'react';

interface UserAssign {
  _id: string;
  profilePhoto: string;
  fullName: string;
}
interface InitProps {
  setUserAssign: (e) => void;
  userAssign: UserAssign[];
}

const AssignUser: React.FC<InitProps> = (props) => {
  const dispatch = useDispatch();
  const authState = useSelector((state: RootStateOrAny) => state.auth);
  const listUser = useSelector((state: RootStateOrAny) => state.users);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 200);

  const isAssignUser = (user) => {
    return (
      props.userAssign.filter((assign) => assign._id === user.userID._id)
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
    getUser();
  }, []);

  const getUser = () => {
    dispatch(getPaginationThunkAction());
  };

  const assignUser = (user) => {
    isAssignUser(user)
      ? props.setUserAssign([
        ...props.userAssign.filter(
            (assign) => assign._id !== user.userID._id,
          ),
      ])
      : props.setUserAssign([
        ...props.userAssign,
        {
          _id: user.userID._id,
          profilePhoto: user.userID.profilePhoto,
          fullName: `${user.userID.firstName} ${user.userID.lastName}`,
        },
      ]);
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const generateUser = () => {
    const user = debouncedSearchTerm ? listUser.listSearch : listUser.list;
    const renderUser = user.map((userAccess) => {
      return (
        <MenuItem key={userAccess?._id} onClick={() => assignUser(userAccess)}>
          <Box
            display='flex'
            alignItems='center'
            className={isAssignUser(userAccess) ? 'user-accept' : ''}
          >
            <Box mr={2}>
              <Avatar
                src={userAccess.userID.profilePhoto}
                className='avata-popup'
              />
            </Box>
            <span className='name-popup'>
              {`${userAccess.userID.firstName} ${userAccess.userID.lastName}`}
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
            {props.userAssign.length > 0 ? (
              props.userAssign.map((user) => (
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
                      user._id === authState.userID
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
            <Box>
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
                dataLength={listUser.list.length}
                hasMore={listUser.list.length < listUser.totalCount}
                next={getUser}
                loader={<DisappearedLoading color={'#67cb48'} />}
                scrollThreshold={0.8}
                height={200}
              >
                {generateUser()}
              </InfiniteScroll>
            </Box>
          </Menu>
        </div>
      )}
    </PopupState>
  );
};

export default AssignUser;
