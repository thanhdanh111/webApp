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
import UserDetail from './user_detail/user_detail';
import { ConfirmDialog } from '@components/confirm_dialog/confirm_dialog';
import { updateUsersReducer } from '../logic/users_actions';

const mockData = [
  {
    _id: {
      userID: '609e2daf61ce700009e7af85',
      companyID: '607a8ca4acf0ef00083d009b',
    },
    userID: {
      status: 'INACTIVE',
      lastAccessAt: '2021-05-14T07:57:10.359Z',
      createdAt: '2021-05-14T07:57:10.359Z',
      updatedAt: '2021-05-14T07:57:10.359Z',
      _id: '609e2daf61ce700009e7af85',
      email: 'dieuphomaique@gmail.com',
      firstName: ' ',
      lastName: ' ',
      __v: 0,
    },
    accesses: [
      {
        _id: '609e2daf61ce700009e7af86',
        status: 'ACCEPTED',
        role: 'DEPARTMENT_STAFF',
        companyID: {
          _id: '609a9c0362d0667657ae9623',
          photos: [],
          description: '',
          emails: [],
          phoneNumbers: [],
          address: '',
          name: 'company of Tuan ugly',
          createdBy: '60489a18c540c2f4748f6a8a',
          createdAt: '2021-05-11T15:00:19.770Z',
          updatedAt: '2021-05-11T15:00:19.770Z',
        },
        departmentID: {
          _id: '609a9c0362d0667657ae9625',
          companyID: '609a9c0362d0667657ae9623',
          photos: [],
          description: '',
          emails: [],
          phoneNumbers: [],
          address: '',
          name: 'company of Tuan ugly',
          createdBy: '60489a18c540c2f4748f6a8a',
          createdAt: '2021-05-11T15:00:19.870Z',
          updatedAt: '2021-05-11T15:00:19.870Z',
        },
      },
      {
        _id: '609e2daf61ce700009e7af87',
        status: 'ACCEPTED',
        role: 'COMPANY_STAFF',
      },
    ],
    companyID: {
      _id: '607a8ca4acf0ef00083d009b',
      photos: [],
      description: '',
      emails: [],
      address: '',
      name: 'SNT Solutions',
    },
    companyIDAndUserID: '607a8ca4acf0ef00083d009b-609e2daf61ce700009e7af85',
    departmentID: [
      {
        _id: '607a8ca4acf0ef00083d009d',
        photos: [],
        description: '',
        emails: [],
        address: '',
        name: 'SNT Solutions',
      },
    ],
  },
  {
    _id: {
      userID:    '609e2da261ce700009e7af82',
      companyID:    '607a8ca4acf0ef00083d009b',
    },
    userID: {
      status:    'INACTIVE',
      lastAccessAt:    '2021-05-14T07:57:10.359Z',
      createdAt:    '2021-05-14T07:57:10.359Z',
      updatedAt:    '2021-05-14T07:57:10.359Z',
      _id:    '609e2da261ce700009e7af82',
      email:    'diephomaique@gmail.com',
      firstName:    ' ',
      lastName:    ' ',
      __v:    0,
    },
    accesses: [
      {
        _id:    '609e2da261ce700009e7af83',
        status:    'ACCEPTED',
        role:    'DEPARTMENT_STAFF',
        companyID: {
          _id:    '607a8ca4acf0ef00083d009b',
          photos: [],
          description:    '',
          emails: [],
          address:    '',
          name:    'SNT Solutions',
        },
        departmentID: {
          _id:    '607a8ca4acf0ef00083d009d',
          photos: [],
          description:    '',
          emails: [],
          address:    '',
          name:    'SNT Solutions',
        },
      },
      {
        _id:    '609e2da261ce700009e7af84',
        status:    'ACCEPTED',
        role:    'COMPANY_STAFF',
      },
    ],
    companyID: {
      _id:    '607a8ca4acf0ef00083d009b',
      photos: [],
      description:    '',
      emails: [],
      address:    '',
      name:    'SNT Solutions',
    },
    companyIDAndUserID: '607a8ca4acf0ef00083d009b-609e2da261ce700009e7af82',
    departmentID: [
      {
        _id:    '607a8ca4acf0ef00083d009d',
        photos: [],
        description:    '',
        emails: [],
        address:    '',
        name:    'SNT Solutions',
      },
    ],
  },
];

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

  function cancelDelete() {
    dispatch(updateUsersReducer({
      onRemovingUser: false,
      editingUserInfo: {
        ...users?.editingUserInfo,
        id: '',
      },
    }));
  }

  function removeUserFromCompany({ itemIndex }) {
    if (!usersList.length) {
      return;
    }

    const selectedUserInfo = usersList?.[itemIndex];

    dispatch(updateUsersReducer({
      onRemovingUser: true,
      editingUserInfo: selectedUserInfo,
    }));
  }

  const actionFunc = {
    delete: removeUserFromCompany,
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
                      length={users?.totalCount}
                      loading={loading}
                      actions={actionList}
                      actionFunc={actionFunc}
                      fetchData={fetchDataUsers}
                      needCheckBox={false}
                      hadExpandableRows={true}
                      ComponentDetail={UserDetail}
                    />
                  </div>
                </div>
            </Container>
          <ConfirmDialog
            warning={`REMOVE ${users?.editingUserInfo?.userName} from this company?`}
            onOpen={users?.onRemovingUser}
            handleClose={cancelDelete}
            handleNo={cancelDelete}
            handleYes={cancelDelete}
            status='REMOVE'
          />

        </div>
  );
};

export default ListUsers;
