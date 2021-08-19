import React, { useEffect } from 'react'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux'
import {
  CommentType,
  getTaskCommentThunkAction,
} from '../logic/task_comment_reducer'
import { RootState } from 'redux/reducers_registration'
import TaskCommentItemDetail from './task_comment_item_detail'
import ScrollableFeed from 'react-scrollable-feed'
import { Task } from 'helpers/type'
const TaskCommentItem = () => {
  const { comments }: CommentType = useSelector((state: RootState) => state.taskComment)
  const { currentTask }: {currentTask : Task} = useSelector((state: RootStateOrAny) => state.tasks)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getTaskCommentThunkAction(currentTask._id))
  }, [currentTask])

  return (
    <ScrollableFeed>
      {Object.keys(comments).map((each) => {
        return <TaskCommentItemDetail comment={comments[each]} key={each}/>
      })}
    </ScrollableFeed>
  )
}

export default TaskCommentItem
