import { Box, Button, Typography } from '@material-ui/core'
import { Task, UserInfoType } from 'helpers/type'
import { Container } from 'next/app'
import { useState } from 'react'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import UserAvatar from '@components/user_avatar/info_user'
import {
  deleteTaskCommentThunkAction,
  updateTaskCommentThunkAction,
} from '../logic/task_comment_reducer'
import { ConfirmDialog } from '@components/confirm_dialog/confirm_dialog'

const TaskCommentItemDetail = ({ comment }) => {
  const { profile }: UserInfoType = useSelector((state: RootStateOrAny) => state?.userInfo)
  const { currentTask }: {currentTask : Task} = useSelector((state: RootStateOrAny) => state.tasks)
  const [contentTaskComment, setContentTaskComment] = useState()
  const dispatch = useDispatch()
  const [handle, setHandle] = useState(false)
  const [open, setOpen] = useState(false)
  const setOpenDeteleConfirm = () => {
    setOpen(!open)
  }
  const handleChange = () => {
    setHandle(!handle)
  }
  const onChangeTaskComment = (event) => {
    setContentTaskComment(event.target.value)
  }
  const deleteTaskComments = () => {
    dispatch(deleteTaskCommentThunkAction(currentTask._id, comment._id))
  }
  const CommentHeader = () => {

    return (
      <div className='comment-head'>
        <Container className='comment-head-left'>
          <Typography component='span' className='created-comment-user-name'>
            {}
          </Typography>
          {handle ? (
            <input
              defaultValue={comment.content}
              onChange={onChangeTaskComment}
            />
          ) : (
            <Typography component='span' className='text-label-comment'>
              {comment.content}
            </Typography>
          )}
        </Container>
        {handle ? null : (
          <Container className='comment-head-right'>
            <ul className='menu-action-comment'>
              <li onClick={handleChange}>
                <EditIcon />
              </li>
              <li onClick={setOpenDeteleConfirm}>
                <DeleteIcon />
              </li>
              <ConfirmDialog
                warning='Are you sure you want to CONTINUE?'
                onOpen={open}
                handleClose={setOpenDeteleConfirm}
                handleNo={setOpenDeteleConfirm}
                handleYes={deleteTaskComments}
                status='REMOVE'
              />
            </ul>
          </Container>
        )}
      </div>
    )
  }

  const CommentContent = () => {

    const saveEditTaskComment = () => {
      dispatch(updateTaskCommentThunkAction(contentTaskComment, currentTask._id, comment._id))
      setHandle(!handle)
    }

    return (
      <div className='comment-item-content'>
        <Container className='comment-item-content-action comment-item-content-action-hide'>
          <Button
            className='comment-item-content-action-cancel'
            onClick={handleChange}
          >
            Cancel
          </Button>
          <Button
            className='comment-item-content-action-save'
            onClick={saveEditTaskComment}
          >
            Save
          </Button>
        </Container>
      </div>
    )
  }

  return (
    <Box className='task-comment-item'>
      <div className='comment-user'>
        <UserAvatar user={profile} style='user-avatar-commented' />
      </div>
      <div className='comment-content'>
        {CommentHeader()}
        {handle ? CommentContent() : null}
      </div>
    </Box>
  )
}
export default TaskCommentItemDetail
