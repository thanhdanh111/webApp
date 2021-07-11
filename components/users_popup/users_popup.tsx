import { Box, Input } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import InfiniteScroll from 'react-infinite-scroll-component';
import { DisappearedLoading } from 'react-loadingg';
import { getPaginationThunkAction, getSearchAction } from 'pages/users/logic/users_reducer';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import UserItem from './user_popup_item';
import { User } from 'helpers/type';
import { checkInObjectByID } from 'helpers/check_assigned';
import { useDebounce } from 'helpers/debounce';

interface InitProps {
  usersAssigned?: User[];
  chooseUser: (user) => void;
  type?: string;
}

const UsersPopupUI: React.FC<InitProps> = (props) => {
  const dispatch = useDispatch();
  const users = useSelector((state: RootStateOrAny) => state.users);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 200);
  const { chooseUser, usersAssigned, type }: InitProps = props;
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    if (!debouncedSearchTerm) {
      return;
    }
    dispatch(getSearchAction(debouncedSearchTerm));
  }, [debouncedSearchTerm]);

  const onHandleAssigned = (user) => {
    if (!chooseUser || !user) {
      return;
    }

    if (type === 'reduxAction') {
      dispatch(chooseUser(user));

      return;
    }

    return chooseUser(user);
  };

  const generateUser = () => {
    const user = debouncedSearchTerm ? users.listSearch : users.list;

    const renderUser = user?.map((each) => {
      const checkAssignedOfUser = usersAssigned && checkInObjectByID(usersAssigned, each?.user?.userID?._id);

      return (
        <UserItem
          key={each?.user?._id}
          userAccess={each?.user}
          handleAssign={() => onHandleAssigned(each?.user)}
          isAssigned={checkAssignedOfUser}
        />
      );
    });

    return renderUser;
  };

  return (
    <>
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
      dataLength={users?.list?.length}
      hasMore={users?.list?.length < users?.totalCount}
      next={() => dispatch(getPaginationThunkAction())}
      loader={<DisappearedLoading color={'#67cb48'} />}
      scrollThreshold={0.8}
      height={200}
    >
      {generateUser()}
    </InfiniteScroll>
    </>
  );
};

export default UsersPopupUI;
