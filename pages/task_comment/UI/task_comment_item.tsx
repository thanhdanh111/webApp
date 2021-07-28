import React, { useEffect, useState } from 'react'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux'
import {
  CommentType,
  getTaskCommentThunkAction,
} from '../logic/task_comment_reducer'
import { RootState } from 'redux/reducers_registration'
import TaskCommentItemDetail from './task_comment_item_detail'
import { Task } from 'helpers/type'
interface TaskComment  {
  _id: string,
  content: string
}
const initialState: TaskComment = {
  _id: '',
  content: '',
}

const TaskCommentItem = () => {
  const { comments }: CommentType = useSelector((state: RootState) => state.taskComment)
  const { currentTask }: {currentTask : Task} = useSelector((state: RootStateOrAny) => state.tasks)
  const [tasksComent, setTaskComment] = useState([initialState])
  const dispatch = useDispatch()

  useEffect(() => {
    if (!comments) {
      return
    }
    const listTaskComment = Object.keys(comments).map((each) => {
      return {
        _id: comments[each]?._id,
        content: comments[each]?.content,
      }
    })
    setTaskComment(listTaskComment)
  }, [comments, currentTask])
  useEffect(() => {
    dispatch(getTaskCommentThunkAction(currentTask._id))
  }, [currentTask])

  return (
    <>
      {tasksComent.map((each) => {
        return <TaskCommentItemDetail comment={each} key={each._id}/>
      })}
    </>
  )
}

export default TaskCommentItem
