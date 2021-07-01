import {
  Button,
  Container,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core';
import React, { useEffect } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import FilterListIcon from '@material-ui/icons/FilterList';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import FilterNoneIcon from '@material-ui/icons/FilterNone';
import ScatterPlotIcon from '@material-ui/icons/ScatterPlot';
import PersonIcon from '@material-ui/icons/Person';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import ListIcon from '@material-ui/icons/List';
import TaskBoardUI from './show_task_board';
import { TaskBoardsType } from '../logic/task_boards_reducer';
import { useDispatch, useSelector } from 'react-redux';
import { setFilterTaskByUserAction } from '../logic/task_boards_action';
import { UserInfoType } from 'helpers/type';
import { RootState } from 'redux/reducers_registration';
import { checkValidAccess } from 'helpers/check_valid_access';
import { Roles } from 'constants/roles';

const validAccesses = [Roles.COMPANY_MANAGER, Roles.DEPARTMENT_MANAGER, Roles.COMPANY_STAFF, Roles.DEPARTMENT_STAFF];

const NavClickUp = () => {
  const dispatch = useDispatch();
  const { filteringTaskByUser }: TaskBoardsType = useSelector((state: RootState) => state.taskBoards);
  const {
    isAdmin,
    rolesInCompany,
  }: UserInfoType =  useSelector((state: RootState) => state?.userInfo);
  const loadData = isAdmin || checkValidAccess({ rolesInCompany, validAccesses });
  const btnShow = filteringTaskByUser ? 'btn-show-me' : 'btn-show-all';

  useEffect(() => {
    if (loadData) {
      dispatch(setFilterTaskByUserAction(false));
    }

    return;
  }, []);

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
            placeholder='Filter by task name...'
            className='nav-input-search'
          />
        </div>
      </Container>
      <PopupState variant='popover' popupId='demo-popup-menu'>
        {(popupState) => (
          <React.Fragment>
            <Button
              variant='contained'
              color='inherit'
              {...bindTrigger(popupState)}
              className='btn-choose'
            >
              <ListIcon className='action-icon list-icon' />
            </Button>

            <Menu {...bindMenu(popupState)} className='menu-drop'>
              <MenuItem className='item-drop action-drop item-switch'>
                <FilterListIcon className='action-icon filter-icon' />
                <Typography className='action-text text-filter'>
                  Filter
                </Typography>
              </MenuItem>
              <MenuItem className='item-drop action-drop item-switch'>
                <UnfoldMoreIcon className='action-icon sort-icon' />
                <Typography className='action-text text-sort'>
                  Sort by
                </Typography>
              </MenuItem>
              <MenuItem className='item-drop action-drop item-switch'>
                <FilterNoneIcon className='action-icon group-icon' />
                <Typography className='action-text text-group'>
                  Group by
                </Typography>
              </MenuItem>
              <MenuItem className='item-drop action-drop item-switch'>
                <ScatterPlotIcon className='action-icon subtask-icon' />
                <Typography className='action-text text-subtask'>
                  Subtasks
                </Typography>
              </MenuItem>
            </Menu>
          </React.Fragment>
        )}
      </PopupState>
      <Container className='nav-actions'>
        <ul className='list-actions'>
          <li className='item-action'>
            <div className='action action-filter'>
              <FilterListIcon className='action-icon filter-icon' />
              <Typography className='action-text text-filter'>
                Filter
              </Typography>
            </div>
          </li>
          <li className='item-action'>
            <div className='action action-sort'>
              <UnfoldMoreIcon className='action-icon sort-icon' />
              <Typography className='action-text text-sort'>Sort by</Typography>
            </div>
          </li>
          <li className='item-action'>
            <div className='action action-group'>
              <FilterNoneIcon className='action-icon group-icon' />
              <Typography className='action-text text-group'>
                Group by
              </Typography>
            </div>
          </li>
          <li className='item-action'>
            <div className='action action-subtask'>
              <ScatterPlotIcon className='action-icon subtask-icon' />
              <Typography className='action-text text-subtask'>
                Subtasks
              </Typography>
            </div>
          </li>
        </ul>
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
