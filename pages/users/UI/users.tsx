import { Container, Toolbar } from '@material-ui/core';
import React, { FunctionComponent, useEffect, useState } from 'react';
import UserLinkMenu from './user_link_menu';
import { useDispatch, useSelector } from 'react-redux';
import {
  headCells,
  actionList,
  getSearchAction,
  useDebounce,
  getPaginationThunkAction,
  renderData,
} from '../logic/users_reducer';
import BaseTable from '@components/table/table';
import { Data } from '../../../helpers/type';
import SearchIcon from '@material-ui/icons/Search';
import { RootState } from 'redux/reducers_registration';

const ListUsers: FunctionComponent = () => {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.users);
  const loading = users.loadingList;
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 200);

  useEffect(() => {
    if (debouncedSearchTerm) {
      dispatch(getSearchAction(debouncedSearchTerm));
    }

    return void fetchDataUsers();
  }, [debouncedSearchTerm]);

  const usersList = users && users.list && Array.isArray(users.list)
    ? renderData(users.list) : [];

  const usersListSearch: Data[] = users && users.listSearch && Array.isArray(users.listSearch)
  ? renderData(users.listSearch) : [];

  const fetchDataUsers = () => {
    dispatch(getPaginationThunkAction());
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const getData = () => {
    if (debouncedSearchTerm) {
      return usersListSearch;
    }

    return usersList;
  };

  return (
        <div className='users'>
            <Container className='list-user'>
                <div className='container'>
                  <UserLinkMenu />
                  <div className='table-container'>
                    <Toolbar className='head-table'>
                      <div className='header-search'>
                          <SearchIcon className='icon-search'/>
                          <input
                            placeholder='Search user...'
                            className='input-search'
                            type='search'
                            value={searchTerm}
                            onChange={handleChange}
                          />
                        </div>
                    </Toolbar>
                    <BaseTable
                      headCells={headCells}
                      data={getData()}
                      length={users.totalCount}
                      loading={loading}
                      actions={actionList}
                      fetchData={fetchDataUsers}
                    />
                  </div>
                </div>
            </Container>
        </div>
  );
};

export default ListUsers;
