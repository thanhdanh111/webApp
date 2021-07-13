import {
  Button,
  Container,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import PersonIcon from '@material-ui/icons/Person';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import TaskBoardUI from './show_task_board';
import { TaskBoardsType } from '../logic/task_boards_reducer';
import { useDispatch, useSelector } from 'react-redux';
import { setFiltering, setFilterTaskByUserAction, setSelectedTitle } from '../logic/task_boards_action';
import { UserInfoType } from 'helpers/type';
import { RootState } from 'redux/reducers_registration';
import { checkValidAccess } from 'helpers/check_valid_access';
import { Roles } from 'constants/roles';
import { useDebounce } from 'helpers/debounce';
import FilteringTaskByUserUI from './filtering_tasks_by_users';

const validAccesses = [Roles.COMPANY_MANAGER, Roles.DEPARTMENT_MANAGER, Roles.COMPANY_STAFF, Roles.DEPARTMENT_STAFF];

const NavClickUp: React.FC = () => {
  const dispatch = useDispatch();
  const {
    filteringTaskByUser,
  }: TaskBoardsType = useSelector((state: RootState) => state.taskBoards);
  const {
    isAdmin,
    rolesInCompany,
  }: UserInfoType =  useSelector((state: RootState) => state?.userInfo);
  const loadData = isAdmin || checkValidAccess({ rolesInCompany, validAccesses });
  const btnShow = filteringTaskByUser ? 'btn-show-me' : 'btn-show-all';
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    void getSearchTaskData();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (loadData) {
      dispatch(setFilterTaskByUserAction(false));
    }

    return;
  }, []);

  const getSearchTaskData = async () => {
    if (debouncedSearchTerm) {
      await Promise.all([
        dispatch(setFiltering(true)),
        dispatch(setSelectedTitle(debouncedSearchTerm)),
      ]);

      return;
    }

    await Promise.all([
      dispatch(setFiltering(false)),
      dispatch(setSelectedTitle('')),
    ]);

    return;
  };

  const onChangeMe = () => {
    dispatch(setFilterTaskByUserAction(true));
  };

  const onChangeAll = () => {
    dispatch(setFilterTaskByUserAction(false));
  };

  return (
    <div className='nav-click_up'>
      <Container className='nav-click-up-search'>
        <TaskBoardUI />
        <div className='nav-search'>
          <SearchIcon className='icon-search' />
          <input
            placeholder='Filter by task title...'
            className='nav-input-search'
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </Container>
      <Container className='menu-content-value'>
        <FilteringTaskByUserUI />
      </Container>
      <Container className='show-task'>
        <ul className='list-actions'>
          <li className='item-action'>
            <div className='action action-use'>
              <div className='btn-assign'>
                <Button
                  className={`btn ${btnShow}`}
                  onClick={onChangeMe}
                >
                  <div className='assign assign-me'>
                    <PersonIcon className='icon icon-me' />
                    <Typography className='text-per'>Me</Typography>
                  </div>
                </Button>
              </div>
              <div className='btn-assign'>
                <Button
                  className={`btn ${btnShow}`}
                  onClick={onChangeAll}
                >
                  <div className='assign assign-other'>
                    <PeopleAltIcon className='icon icon-other' />
                  </div>
                </Button>
              </div>
            </div>
          </li>
        </ul>
      </Container>
    </div>
  );
};

export default NavClickUp;
