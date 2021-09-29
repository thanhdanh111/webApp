import {
  Button,
  Container,
  Typography,
} from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import SearchIcon from '@material-ui/icons/Search'
import PersonIcon from '@material-ui/icons/Person'
import PeopleAltIcon from '@material-ui/icons/PeopleAlt'
import TaskBoardUI from './show_task_board'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'redux/reducers_registration'
import { useDebounce } from 'helpers/debounce'
import FilteringTaskByUserAssignUI from './filtering_tasks_by_assigned'
import { setFilteringTaskByCurrentUser, setSelectedTitle } from 'pages/tasks/logic/task_action'
import { TaskType } from 'pages/tasks/logic/task_reducer'

const NavClickUp: React.FC = () => {
  const dispatch = useDispatch()
  const {
    filteringTaskByUser,
  }: TaskType = useSelector((state: RootState) => state.tasks)
  const btnShow = filteringTaskByUser ? 'btn-show-me' : 'btn-show-all'
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    void getSearchTaskData()
  }, [debouncedSearchTerm])

  const getSearchTaskData = async () => {
    if (debouncedSearchTerm) {
      dispatch(setSelectedTitle(debouncedSearchTerm))

      return
    }

    return dispatch(setSelectedTitle(''))
  }

  const onChangeMe = () => {
    dispatch(setFilteringTaskByCurrentUser(true))
  }

  const onChangeAll = () => {
    dispatch(setFilteringTaskByCurrentUser(false))
  }

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
        <FilteringTaskByUserAssignUI />
      </Container>
      <Container className='show-task'>
        <div className='btn-assign'>
          <Button
            disableTouchRipple
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
            disableTouchRipple
            className={`btn ${btnShow}`}
            onClick={onChangeAll}
          >
            <div className='assign assign-other'>
              <PeopleAltIcon className='icon icon-other' />
            </div>
          </Button>
        </div>
      </Container>
    </div>
  )
}

export default NavClickUp
