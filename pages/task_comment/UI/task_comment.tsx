import React, { FC } from 'react'
import { Container } from '@material-ui/core'
import TaskCommentItem from './task_comment_item'
import TaskCommentInputUI from './task_comment_input'

const TaskCommentUI: FC = () => {
  return (
    <div className='task-comment-ui'>
      <Container className='task-comment-content'>
        <TaskCommentItem />
      </Container>
      <Container className='task-comment'>
        <TaskCommentInputUI />
      </Container>
    </div>
  )
}

export default (TaskCommentUI)
