import { Button, Container, Input, Typography } from '@material-ui/core';
import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import FilterListIcon from '@material-ui/icons/FilterList';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import FilterNoneIcon from '@material-ui/icons/FilterNone';
import ScatterPlotIcon from '@material-ui/icons/ScatterPlot';
import PersonIcon from '@material-ui/icons/Person';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';

interface InitProps {
  handleClick: (e) => void;
  show: string;
}

const NavClickUp = (props: InitProps) => {

  const { handleClick, show }: InitProps = props;

  const btnShowMe = show === 'me' ? 'btn-show' : '';

  const btnShowEvery = show === 'everyone' ? 'btn-show' : '';

  return (
        <div className='nav-click_up'>
            <Container className='nav-search'>
                <SearchIcon className='icon-search' />
                <Input placeholder='Filter by task name...' className='nav-input-search'/>
            </Container>
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
                    <li className='item-action'>
                        <div className='action action-use'>
                            <Button className={`btn-me ${btnShowMe}`} onClick={() => handleClick('me')}>
                                <div className='assign-me'>
                                    <PersonIcon className='icon-per' />
                                    <Typography className='text-per'>Me</Typography>
                                </div>
                            </Button>
                            <Button className={`btn-other ${btnShowEvery}`} onClick={() => handleClick('everyone')}>
                                <PeopleAltIcon className='icon-other' />
                            </Button>
                        </div>
                    </li>
                </ul>
            </Container>
        </div>
  );
};

export default (NavClickUp);
