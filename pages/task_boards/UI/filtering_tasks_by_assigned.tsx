import UsersPopupUI from '@components/users_popup/users_popup'
import { Container, Typography } from '@material-ui/core'
import { checkIfEmptyArray } from 'helpers/check_if_empty_array'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'redux/reducers_registration'
import FilterTaskContentUI from './filter_task_content'
import CloseIcon from '@material-ui/icons/Close'
import { TaskType } from 'pages/tasks/logic/task_reducer'
import { setSelectedUserIDs } from 'pages/tasks/logic/task_action'

const FilteringTaskByUserAssignUI: React.FC = () => {
  const {
    selectedUserIDs,
  }: TaskType = useSelector((state: RootState) => state.tasks)
  const dispatch = useDispatch()

  const handleRemoveUser = (value) => {
    const removeUser = selectedUserIDs.filter((each) => each._id !== value)

    dispatch(setSelectedUserIDs(removeUser))
  }

  const showUserValue = checkIfEmptyArray(selectedUserIDs) ? selectedUserIDs?.map((each) => {
    return (
        <li className='value-item' key={each?._id}>
          <Typography className='text-value-item'>
          {(each.firstName?.trim() || each.lastName?.trim())
          ? `${each.firstName} ${each.lastName}`
          : `${each.email}`}
          </Typography>
          <div className='icon-value-item' onClick={() => handleRemoveUser(each?._id)}>
            <div className='icon-close-item'>
              <CloseIcon
                className='icon-item delete'
              />
            </div>
          </div>
        </li>
    )
  }) : []

  return (
    <Container>
      <FilterTaskContentUI
        component={<UsersPopupUI chooseUser={setSelectedUserIDs} type='reduxAction' usersAssigned={selectedUserIDs} />}
        valueElement={showUserValue}
        filterLabel='users'
      />
    </Container>
  )
}

export default (FilteringTaskByUserAssignUI)
