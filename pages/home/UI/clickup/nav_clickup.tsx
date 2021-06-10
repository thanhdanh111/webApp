import { Button, Container, Input, Menu, MenuItem, Typography } from '@material-ui/core';
import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import FilterListIcon from '@material-ui/icons/FilterList';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import FilterNoneIcon from '@material-ui/icons/FilterNone';
import ScatterPlotIcon from '@material-ui/icons/ScatterPlot';
import PersonIcon from '@material-ui/icons/Person';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import ListIcon from '@material-ui/icons/List';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { setTaskFiltering } from 'pages/home/logic/task_filtering_action';
import { TaskFilteringState } from 'pages/home/logic/task_filtering_reducer';

const NavClickUp = () => {
  const dispatch = useDispatch();
  const taskFilter: TaskFilteringState = useSelector((state: RootStateOrAny) => state.taskFilter);

  const getActiveColor = (isActive: boolean) => {
    if (!isActive) {
      return { };
    }

    return {
      background: '#117bc8',
      color: '#fff',
    };
  };

  const onChangeMe = () => {
    dispatch(setTaskFiltering({ isMe: true }));
  };

  const toggleAssigneesBar = () => {
    dispatch(setTaskFiltering({ isEveryOne: true }));
  };

  return (
        <div className='nav-click_up'>
            <Container className='nav-search'>
                <SearchIcon className='icon-search' />
                <Input placeholder='Filter by task name...' className='nav-input-search'/>
            </Container>
            <PopupState variant='popover' popupId='demo-popup-menu'>
                {(popupState) => (
                    <React.Fragment>

                    <Button variant='contained' color='inherit' {...bindTrigger(popupState)} className='btn-choose'>
                    <ListIcon className='action-icon list-icon'/>
                    </Button>

                    <Menu {...bindMenu(popupState)} className='menu-drop'>
                        <MenuItem className='item-drop action-drop item-switch' >
                            <FilterListIcon className='action-icon filter-icon'/>
                            <Typography className='action-text text-filter'>Filter</Typography>
                        </MenuItem>
                        <MenuItem className='item-drop action-drop item-switch'>
                            <UnfoldMoreIcon className='action-icon sort-icon'/>
                            <Typography className='action-text text-sort'>Sort by</Typography>
                        </MenuItem>
                        <MenuItem className='item-drop action-drop item-switch' >
                            <FilterNoneIcon className='action-icon group-icon'/>
                            <Typography className='action-text text-group'>Group by</Typography>
                        </MenuItem>
                        <MenuItem className='item-drop action-drop item-switch' >
                            <ScatterPlotIcon className='action-icon subtask-icon'/>
                            <Typography className='action-text text-subtask'>Subtasks</Typography>
                        </MenuItem>
                    </Menu>
                    </React.Fragment>
                )}
            </PopupState>
            <Container className='nav-actions'>
                <ul className='list-actions'>
                    <li className='item-action'>
                        <div className='action action-filter'>
                            <FilterListIcon className='action-icon filter-icon'/>
                            <Typography className='action-text text-filter'>Filter</Typography>
                        </div>
                    </li>
                    <li className='item-action'>
                        <div className='action action-sort'>
                            <UnfoldMoreIcon className='action-icon sort-icon'/>
                            <Typography className='action-text text-sort'>Sort by</Typography>
                        </div>
                    </li>
                    <li className='item-action'>
                        <div className='action action-group'>
                            <FilterNoneIcon className='action-icon group-icon'/>
                            <Typography className='action-text text-group'>Group by</Typography>
                        </div>
                    </li>
                    <li className='item-action'>
                        <div className='action action-subtask'>
                            <ScatterPlotIcon className='action-icon subtask-icon'/>
                            <Typography className='action-text text-subtask'>Subtasks</Typography>
                        </div>
                    </li>
                </ul>
            </Container>
            <Container className='show-task'>
                <ul className='list-actions'>
                    <li className='item-action'>
                        <div className='action action-use'>
                            <div className='btn-assign'>
                                <Button className='btn' onClick={onChangeMe}>
                                    <div className='assign' style={getActiveColor(!!taskFilter?.isMe)} >
                                        <PersonIcon className='icon' />
                                        <Typography className='text-per'>Me</Typography>
                                    </div>
                                </Button>
                            </div>
                            <div className='btn-assign'>
                                <Button className='btn' onClick={toggleAssigneesBar}>
                                    <div className='assign assign-other' style={getActiveColor(!!taskFilter?.isEveryOne)}>
                                        <PeopleAltIcon className='icon' />
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

export default (NavClickUp);
