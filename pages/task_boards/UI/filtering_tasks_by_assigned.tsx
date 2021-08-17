import UsersPopupUI from '@components/users_popup/users_popup'
import { Container, IconButton, Typography } from '@material-ui/core'
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

  const FilteredUser = ({ user }) => {

    return (
      <div className='value-item' key={user?._id}>
        <Typography className='text-value-item'>
        {(user.firstName?.trim() || user.lastName?.trim())
        ? `${user.firstName} ${user.lastName}`
        : `${user.email}`}
        </Typography>
        <IconButton className='icon-value-item' onClick={() => handleRemoveUser(user?._id)}>
          <CloseIcon className='icon-item delete' />
        </IconButton>
      </div>
    )
  }

  const showUsers = selectedUserIDs?.length > 2 ? [0, 1, 2].map((index) => {
    if (index === 2) {
      return <div className='value-item'>
        <Typography className='text-value-item'>
          {`+ ${selectedUserIDs?.length - 2} person`}
        </Typography>
      </div>
    }

    return <FilteredUser key={selectedUserIDs?.[index]?._id} user={selectedUserIDs[index]} />
  }) : selectedUserIDs?.map((user) => (<FilteredUser user={user} key={user?._id} />))

  return (
    <Container>
      <FilterTaskContentUI
        component={<UsersPopupUI chooseUser={setSelectedUserIDs} type='reduxAction' usersAssigned={selectedUserIDs} />}
        valueElement={showUsers}
        filterLabel='users'
      />
    </Container>
  )
}

export default (FilteringTaskByUserAssignUI)
