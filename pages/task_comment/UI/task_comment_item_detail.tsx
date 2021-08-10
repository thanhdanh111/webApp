import { Box, Button, TextareaAutosize, Typography } from '@material-ui/core'
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
import moment from 'moment'

const TaskCommentEditDetail = (handleCancel, saveEditTaskComment) => {
  return (
    <div className='comment-item-content'>
      <Container className='comment-item-content-action comment-item-content-action-hide'>
        <Button
          className='comment-item-content-action-cancel'
          onClick={handleCancel}
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
const TaskCommentItemDetail = ({ comment }) => {
  const { profile }: UserInfoType = useSelector((state: RootStateOrAny) => state?.userInfo)
  const { currentTask }: { currentTask: Task } = useSelector((state: RootStateOrAny) => state.tasks)
  const [contentTaskComment, setContentTaskComment] = useState()
  const userName = `${comment?.createdBy?.lastName} ${comment?.createdBy?.firstName}`
  const dispatch = useDispatch()
  const [openTaskCommentEditDetail, setOpenTaskCommentEditDetail] =
    useState(false)
  const [open, setOpen] = useState(false)
  const setOpenDeteleConfirm = () => {
    setOpen(!open)
  }
  const handleOpenTaskCommentEditDetail = () => {
    setOpenTaskCommentEditDetail(!openTaskCommentEditDetail)
  }
  const handleCancel = () => {
    setContentTaskComment(undefined)
    setOpenTaskCommentEditDetail(!openTaskCommentEditDetail)
  }
  const onChangeTaskComment = (event) => {
    setContentTaskComment(event.target.value)
  }
  const deleteTaskComments = () => {
    dispatch(deleteTaskCommentThunkAction(currentTask._id, comment._id, comment.createdAt))
  }
  const saveEditTaskComment = () => {
    dispatch(updateTaskCommentThunkAction(contentTaskComment, currentTask._id, comment._id))
    setOpenTaskCommentEditDetail(!openTaskCommentEditDetail)
  }
  const Commentcontent = () => {
    return (
      <div className='comment-head'>
        <Container className='comment-head-left'>
          {openTaskCommentEditDetail ? (
            <TextareaAutosize
              defaultValue={comment.content}
              onChange={onChangeTaskComment}
              className='comment-head-input'
            />
          ) : (
            <>
              <Typography
                component='span'
                className='created-comment-user-name'
              >
                {profile.email === comment?.createdBy?.email ? (
                  <span className='created-comment-name'>You</span>
                ) : (
                  <span className='created-comment-name'>
                    {comment?.createdBy?.profilePhoto ? userName : 'You'}
                  </span>
                )}
                <span style={{ fontSize: '14px' }}> commented</span>
              </Typography>
              <Typography component='span' className='created-comment-moment'>
                {moment(comment.createdAt).format('MMM DD, hh:ss a')}
              </Typography>
              <Typography component='span' className='text-label-comment'>
                {contentTaskComment || comment.content}
              </Typography>
            </>
          )}
        </Container>
        {openTaskCommentEditDetail ? null : (
          <Container className='comment-head-right'>
            <ul className='menu-action-comment'>
              <li
                onClick={handleOpenTaskCommentEditDetail}
                className='menu-action-comment-detail'
              >
                <EditIcon className='taskComment-icon' /> <span>Edit</span>
              </li>
              <li
                onClick={setOpenDeteleConfirm}
                className='menu-action-comment-detail'
              >
                <DeleteIcon className='taskComment-icon' /> <span>Delete</span>
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

  return (
    <Box className='task-comment-item'>
      <div className='comment-user'>
        <UserAvatar
          user={comment?.createdBy?.profilePhoto ? comment?.createdBy : profile}
          style='user-avatar-commented'
        />
      </div>
      <div className='comment-content'>
        {Commentcontent()}
        {openTaskCommentEditDetail
          ? TaskCommentEditDetail(handleCancel, saveEditTaskComment)
          : null}
      </div>
    </Box>
  )
}
export default TaskCommentItemDetail
