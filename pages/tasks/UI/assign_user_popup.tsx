import { Box, Input } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import InfiniteScroll from 'react-infinite-scroll-component';
import { DisappearedLoading } from 'react-loadingg';
import { getSearchAction, useDebounce } from 'pages/users/logic/users_reducer';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import UserItem from './user_item_popup';
import { User } from 'helpers/type';

interface InitProps {
  getUser: () => void;
  usersAssigned: User[];
  handleAssign: (user) => void;
}

const AssignUserPopup: React.FC<InitProps> = (props) => {
  const dispatch = useDispatch();
  const users = useSelector((state: RootStateOrAny) => state.users);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 200);
  const { getUser, handleAssign, usersAssigned }: InitProps = props;
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    if (!debouncedSearchTerm) {
      return;
    }
    dispatch(getSearchAction(debouncedSearchTerm));
  }, [debouncedSearchTerm]);

  const generateUser = () => {
    const user = debouncedSearchTerm ? users.listSearch : users.list;

    const renderUser = user?.map((each) => {
      const isAssignUser = usersAssigned.filter((assign) => assign?._id === each?.user?.userID?._id)
      .length !== 0;

      return (
        <UserItem
          key={each?.user?._id}
          userAccess={each?.user}
          handleAssign={() => handleAssign(each?.user)}
          isAssign={isAssignUser}
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
      next={getUser}
      loader={<DisappearedLoading color={'#67cb48'} />}
      scrollThreshold={0.8}
      height={200}
    >
      {generateUser()}
    </InfiniteScroll>
    </>
  );
};

export default AssignUserPopup;
