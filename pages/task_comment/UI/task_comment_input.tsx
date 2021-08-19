import { Button, Container } from '@material-ui/core'
import React, { useState } from 'react'
import SendIcon from '@material-ui/icons/Send'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux'
import {
  addTaskComentsThunkAction,
} from '../logic/task_comment_reducer'
import { Task } from 'helpers/type'
import UsersPopupUI from '@components/users_popup/users_popup'
import { User } from '@sentry/types'

const TaskCommentInputUI = () => {
  const [taskCommentInput, setTaskCommentInput] = useState('')
  const { currentTask }: {currentTask : Task} = useSelector((state: RootStateOrAny) => state.tasks)
  const [tagUser, setTagUSer] = useState<User[]>([])
  const dispatch = useDispatch()

  const onChangeTaskCommentInput = (event) => {
    setTaskCommentInput(event.target.value)
  }
  const checkUser = () => {
    const userMap = tagUser.map((user) => {
      const username = `@${user?.userID?.lastName} ${user?.userID?.firstName}`
      if (taskCommentInput.search(username) !== -1){
        return user?.userID?._id
      }

      return
    })

    const userFilter = userMap.filter((user) => {
      if (user){
        return user
      }

      return
    })

    return userFilter
  }
  const sendCommentTaskInput = () => {
    dispatch(addTaskComentsThunkAction(taskCommentInput, checkUser(), currentTask._id))
    setTagUSer([])
    setTaskCommentInput('')
  }
  const showListUserTag = () => {
    if (taskCommentInput[taskCommentInput.length - 1] === '@') {

      return true
    }

    return false
  }

  const addTagUser = (user) => {
    const nameUser = `${user?.userID?.lastName} ${user?.userID?.firstName}`
    setTagUSer([...tagUser, user])
    setTaskCommentInput(`${taskCommentInput}${nameUser} `)
  }

  return (
    <Container className='comment-input-ui'>
      <input
        className='comment-input'
        placeholder='Comment or type / for commands'
        onChange={onChangeTaskCommentInput}
        value={taskCommentInput}
      />
      <div className='tag-user-input'>
      {showListUserTag() ? <UsersPopupUI chooseUser={(user) => addTagUser(user)} /> : null}
      </div>
      <div className='action-new-comment'>
        <Button
          variant='contained'
          color='secondary'
          style={{ margin: '4px' }}
          endIcon={<SendIcon color='secondary' />}
          disabled={!taskCommentInput}
          onClick={sendCommentTaskInput}
        />
      </div>
    </Container>
  )
}

export default TaskCommentInputUI
