import { Typography } from '@material-ui/core'
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CheckIcon from '@material-ui/icons/Check'
import CloseIcon from '@material-ui/icons/Close'
import { TaskStatus } from 'helpers/type'
// import { setTemplateTitleStatus } from 'pages/task_boards/logic/task_boards_action'
import { RootState } from 'redux/reducers_registration'
import { setTempTitleStatus } from '../logic/task_statuses_action'
import { renameStatusThunkAction, StatusesType } from '../logic/task_statuses_reducer'

interface InitialProps {
  taskStatusID: TaskStatus
  renaming?: boolean
  setRetitleStatus: () => void
}

const RenameStatusUI = (props: InitialProps) => {
  const {
    taskStatusID,
    renaming,
    setRetitleStatus,
  }: InitialProps = props
  const { tempTitleStatus }: StatusesType = useSelector((state: RootState) => state.statuses)
  const newTaskRef = useRef<HTMLTitleElement>(null)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setTempTitleStatus(taskStatusID?.title))
  }, [taskStatusID])

  if (!renaming) {
    return (
      <>
        <Typography className='name-status' ref={newTaskRef}>{taskStatusID?.title}</Typography>
        <Typography className='quality-task'>{taskStatusID?.taskIDs?.length}</Typography>
      </>
    )
  }

  const submitReTitleTaskStatus = () => {
    setRetitleStatus()
    dispatch(renameStatusThunkAction(taskStatusID?._id))
  }

  const handleChangeTitle = (event) => {
    if (tempTitleStatus === event?.target?.value) {
      return
    }

    dispatch(setTempTitleStatus(event.target.value))
  }

  const handleCloseChange = () => {
    setRetitleStatus()
    dispatch(setTempTitleStatus(taskStatusID?.title))
  }

  return (
    <div className='rename-status'>
      <input
        type='text'
        value={tempTitleStatus || taskStatusID?.title}
        className='add-status-input'
        onChange={handleChangeTitle}
      />
      <div className='close-create-status' onClick={handleCloseChange}>
        <CloseIcon className='close-create-status-icon' />
      </div>
      <div className='submit-create-status' onClick={submitReTitleTaskStatus} >
        <CheckIcon className='submit-create-status-icon' />
      </div>
    </div>

  )
}

export default (RenameStatusUI)
