import React, { FunctionComponent, useEffect, useState } from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { getPaginationThunkAction } from '../../users/logic/users_reducer';
import { Data } from '../../../helpers/type';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { setUserID } from '../logic/statistics_actions';

const UserSelection: FunctionComponent = () => {
  const dispatch = useDispatch();
  const users = useSelector((state: RootStateOrAny) => state.users);
  const cursor = users?.cursor;
  const [user, setUser] = useState('');

  useEffect(() => {
    fetchDataUsers();
  }, []);

  const fetchDataUsers = () => {
    dispatch(getPaginationThunkAction());
  };

  const handleChange = async (event) => {
    setUser(event.target.value);
    if (event.target.value === 'more_users') {
      void fetchDataUsers();
      setUser('');
      dispatch(setUserID(''));

      return;
    }
    dispatch(setUserID(event.target.value));
  };

  const getOptions = (userList: Data[]) => {
    if (!userList || !userList.length) {
      return <div />;
    }
    const list: JSX.Element[] = [];
    userList.forEach((element) => list.push(<MenuItem className='select-item' value={element.id}>{element.userName}</MenuItem>));

    return list;
  };

  const getMore = (str: string) => {
    if (str === 'END') {
      return <div />;
    }

    return <MenuItem value='more_users' className='select-item'>...</MenuItem>;
  };

  return (
    <FormControl className='select-name-formcontrol' variant='outlined' color='secondary'>
      <InputLabel className='label-select' ><span className='span-select' >Select User</span></InputLabel>
      <Select
        value={user}
        onChange={handleChange}
        className='select-list-user'
      >
        {getOptions(users.list)}
        {getMore(cursor)}
        <MenuItem value='all users' className='select-item'>All</MenuItem>
      </Select>
    </FormControl>
  );
};

export default UserSelection;
