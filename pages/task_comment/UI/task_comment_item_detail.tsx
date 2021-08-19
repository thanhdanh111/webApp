import { Box, Button, TextareaAutosize, Typography } from '@material-ui/core'
import { Task, UserInfoType } from 'helpers/type'
import { useState } from 'react'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined'
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined'
import UserAvatar from '@components/user_avatar/info_user'
import {
  deleteTaskCommentThunkAction,
  updateTaskCommentThunkAction,
} from '../logic/task_comment_reducer'
import { ConfirmDialog } from '@components/confirm_dialog/confirm_dialog'
import moment from 'moment'

const TaskCommentEditDetail = (handleCancel, saveEditTaskComment, comment, onChangeTaskComment) => {
  return (
    <div className='comment-item-content'>
      <div className='comment-item-content-input' >
        <TextareaAutosize
          defaultValue={comment.content}
          onChange={onChangeTaskComment}
          className='comment-head-input'
        />
      </div>
      <div className='comment-item-content-action comment-item-content-action-hide'>
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
      </div>
    </div>
  )
}
const TaskCommentItemDetail = ({ comment }) => {
  const { profile }: UserInfoType = useSelector((state: RootStateOrAny) => state?.userInfo)
  const { currentTask }: { currentTask: Task } = useSelector((state: RootStateOrAny) => state.tasks)
  const [contentTaskComment, setContentTaskComment] = useState()
  const dispatch = useDispatch()
  const [openTaskCommentEditDetail, setOpenTaskCommentEditDetail] =
    useState(false)
  const [open, setOpen] = useState(false)
  const userName = `${comment?.createdBy?.lastName} ${comment?.createdBy?.firstName}`
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
  const checkUserIsOnline = () => {
    if (!(comment?.createdBy.email)){
      return true
    }
    if (comment?.createdBy.email === profile.email){
      return true
    }

    return false
  }
  const Commentcontent = () => {
    return (
      <>
      {openTaskCommentEditDetail ? TaskCommentEditDetail(handleCancel, saveEditTaskComment, comment, onChangeTaskComment) :
        <div className='comment-head'>
        <div className='comment-header-content'>
          <Typography component='span' className='text-label-comment'>
              <span className='text-label-comment-span'>{checkUserIsOnline() ? 'You' : userName}</span> commented
          </Typography>
          <Typography component='span' className='created-comment-moment'>
            {moment(comment.createdAt).format('MMM DD, hh:ss a')}
          </Typography>
          <ul className='menu-action-comment'>
              <li
                onClick={handleOpenTaskCommentEditDetail}
                className='menu-action-comment-detail'
              >
                <EditOutlinedIcon className='taskComment-icon' /> <span>Edit</span>
              </li>
              <li
                onClick={setOpenDeteleConfirm}
                className='menu-action-comment-detail'
              >
                <DeleteOutlineOutlinedIcon className='taskComment-icon' /> <span>Delete</span>
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
        </div>
        <div className='comment-content-show'>
          {contentTaskComment || comment.content}
        </div>
      </div>
      }
      </>
    )
  }

  return (
    <Box className='task-comment-item'>
      <div className='comment-user'>
        <UserAvatar
          user={comment?.createdBy.email ? comment?.createdBy : profile}
          style='user-avatar-commented'
        />
      </div>
      <div className='comment-content'>
        {Commentcontent()}
      </div>
    </Box>
  )
}
export default TaskCommentItemDetail
