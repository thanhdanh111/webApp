import React, { FunctionComponent, useEffect, useState } from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import {
  getPaginationThunkAction,
  renderData,
} from '../../users/logic/users_reducer';
import { Data } from '../../../helpers/type';
import {
  Card,
  CardContent,
  FormControl, InputLabel, MenuItem, Select,
} from '@material-ui/core';
import { setUserID } from '../logic/statistics_actions';

const UserSelection: FunctionComponent = () => {
  const dispatch = useDispatch();
  const users = useSelector((state: RootStateOrAny) => state.users);
  const cursor = users.cursor;
  const [user, setUser] = useState('');

  useEffect(() => {

    void fetchDataUsers();
  }, []);

  const usersList = users && users.list && Array.isArray(users.list)
    ? renderData(users.list) : [];

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
    userList.forEach((element) => list.push(<option value={element.id}>{element.userName}</option>));

    return list;
  };

  const getMore = (str: string) => {
    if (str === 'END') {
      return <div />;
    }

    return <MenuItem value='more_users'>...</MenuItem>;
  };

  return (
    <div className='select-name-container' >
      <Card className='select-name-card'>
        <CardContent>
          <FormControl className='select-name-formcontrol' variant='outlined' >
            <InputLabel >Select User</InputLabel>
            <Select
              value={user}
              onChange={handleChange}
            >
              {getOptions(usersList)}
              {getMore(cursor)}
              <option value=''>All</option>
            </Select>
          </FormControl>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSelection;
