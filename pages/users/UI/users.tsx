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
} from '../logic/users_reducer';
import BaseTable from '@components/table/table';
import SearchIcon from '@material-ui/icons/Search';
import { RootState } from 'redux/reducers_registration';
import UserDetail from './user_detail/user_detail';
import { ConfirmDialog } from '@components/confirm_dialog/confirm_dialog';
import { updateUsersReducer } from '../logic/users_actions';
import { removeUserFromCompany, removeUserFromDepartment } from '../logic/users_apis';

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

    return;
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchDataUsers();
  }, []);

  const fetchDataUsers = () => {
    dispatch(getPaginationThunkAction());
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const getData = () => {
    if (debouncedSearchTerm) {
      return users?.listSearch ?? [];
    }

    return users?.list ?? [];
  };

  function cancelDelete() {
    dispatch(updateUsersReducer({
      onRemovingUser: false,
      editingUserInfo: {
        ...users?.editingUserInfo,
        id: '',
      },
    }));
  }

  function agreeToRemoveUser() {
    const removeFromWhere = users?.editingUserInfo?.removeUserFrom;

    if (removeFromWhere === 'company') {
      dispatch(removeUserFromCompany({ onSearch: !!debouncedSearchTerm }));

      return;
    }

    dispatch(removeUserFromDepartment({ onSearch: !!debouncedSearchTerm }));
  }

  function handleWarningTitle(removeFromWhere) {
    switch (removeFromWhere) {
      case 'department':
        return `REMOVE ${users?.editingUserInfo?.userName} from department ${users?.editingUserInfo?.editingDepartmentRole?.departmentName ?? ''}?`;
      case 'company':
        return `REMOVE ${users?.editingUserInfo?.userName} from company ${users?.editingUserInfo?.editingCompany?.name ?? ''}?`;
      default:
        return 'Are you sure you want to CONTINUE?';
    }
  }

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
                      fixedHeightInfiniteScroll={500}
                      length={users?.totalCount}
                      loading={loading}
                      actions={actionList}
                      fetchData={fetchDataUsers}
                      needCheckBox={false}
                      hadExpandableRows={true}
                      redButtonName='delete'
                      ComponentDetail={UserDetail}
                    />
                  </div>
                </div>
            </Container>
          <ConfirmDialog
            loading={users?.isLoading}
            warning={handleWarningTitle(users?.editingUserInfo?.removeUserFrom)}
            onOpen={users?.onRemovingUser}
            handleClose={cancelDelete}
            handleNo={cancelDelete}
            handleYes={agreeToRemoveUser}
            status='REMOVE'
          />
        </div>
  );
};

export default ListUsers;
