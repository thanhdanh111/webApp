import { Container } from '@material-ui/core'
import React, { useState } from 'react'
import SendIcon from '@material-ui/icons/Send'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux'
import {
  addTaskComentsThunkAction,
} from '../logic/task_comment_reducer'
import { Task } from 'helpers/type'

const TaskCommentInputUI = () => {
  const [taskCommentInput, setTaskCommentInput] = useState('')
  const { currentTask }: {currentTask : Task} = useSelector((state: RootStateOrAny) => state.tasks)

  const dispatch = useDispatch()
  const onChangeTaskCommentInput = (event) => {
    setTaskCommentInput(event.target.value)
  }
  const sendCommentTaskInput = () => {
    dispatch(addTaskComentsThunkAction(taskCommentInput, currentTask._id))
    setTaskCommentInput('')
  }

  return (
    <Container className='comment-input-ui'>
      <input
        className='comment-input'
        placeholder='Comment or type / for commands'
        onChange={onChangeTaskCommentInput}
        value={taskCommentInput}
      />
      <div className='action-new-comment'>
        <SendIcon
          className='btn-confirm-comment'
          color='secondary'
          onClick={sendCommentTaskInput}
        />
      </div>
    </Container>
  )
}

export default TaskCommentInputUI
