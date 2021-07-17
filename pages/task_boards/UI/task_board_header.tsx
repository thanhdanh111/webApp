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
import { UserInfoType } from 'helpers/type'
import { RootState } from 'redux/reducers_registration'
import { checkValidAccess } from 'helpers/check_valid_access'
import { Roles } from 'constants/roles'
import { useDebounce } from 'helpers/debounce'
import FilteringTaskByUserAssignUI from './filtering_tasks_by_assigned'
import { setFilteringTaskByCurrentUser, setSelectedTitle } from 'pages/tasks/logic/task_action'
import { getTasksThunkAction, TaskType } from 'pages/tasks/logic/task_reducer'

const validAccesses = [Roles.COMPANY_MANAGER, Roles.DEPARTMENT_MANAGER, Roles.COMPANY_STAFF, Roles.DEPARTMENT_STAFF]

const NavClickUp: React.FC = () => {
  const dispatch = useDispatch()
  const {
    filteringTaskByUser,
    selectedUserIDs,
    selectedTags,
    selectedTitle,
  }: TaskType = useSelector((state: RootState) => state.tasks)
  const {
    isAdmin,
    rolesInCompany,
  }: UserInfoType =  useSelector((state: RootState) => state?.userInfo)
  const loadData = isAdmin || checkValidAccess({ rolesInCompany, validAccesses })
  const btnShow = filteringTaskByUser ? 'btn-show-me' : 'btn-show-all'
  const [searchTerm, setSearchTerm] = useState('')

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    void getSearchTaskData()
  }, [debouncedSearchTerm])

  useEffect(() => {
    if (loadData) {
      dispatch(setFilteringTaskByCurrentUser(false))
    }

    return
  }, [])

  useEffect(() => {
    dispatch(getTasksThunkAction())
  }, [
    selectedUserIDs,
    selectedTags,
    selectedTitle,
    filteringTaskByUser,
  ])

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
  )
}

export default NavClickUp
