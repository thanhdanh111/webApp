import { Typography, IconButton } from '@material-ui/core'
import { Task } from 'helpers/type'
import { useDispatch } from 'react-redux'
import AssignUser from './assign_user'
import React, { FunctionComponent, useState } from 'react'
import { ConfirmDialog } from '@components/confirm_dialog/confirm_dialog'
import DeleteIcon from '@material-ui/icons/Delete'
import { deletedTaskThunkAction, getTaskByIDThunkAction, updateAssignUserThunkAction } from '../logic/task_reducer'
interface InitialProp {
  task: Task
}

const TasksUI: FunctionComponent<InitialProp> = (props: InitialProp) => {
  const dispatch = useDispatch()
  const { task }: InitialProp = props
  const [open, setOpen] = useState(false)
  const taskName = task?.title?.split('_').join(' ')
  const taskID = task?._id?.slice(0, 6)

  const handleAssign = (users) => {
    const userAssigns = users?.map((each) => each?._id)

    dispatch(updateAssignUserThunkAction(task._id, userAssigns))
  }

  const cancelDelete = () => {
    setOpen(false)
  }

  const handleDeleteTask = () => {
    setOpen(false)
    dispatch(deletedTaskThunkAction({ taskID: task?._id, taskStatusID: task?.taskStatusID?._id ?? task?.taskStatusID }))
  }

  const getTask = () => {
    dispatch(getTaskByIDThunkAction(task?._id))
  }

  return (
    <>
        <div className='task-item' onClick={() => getTask()}>
            <Typography className='text-board' component='span'>Team</Typography>
            <div className='task-title' title={taskName}>
                <Typography
                  component='span'
                  className='task-name'
                >{taskName}
                </Typography>
                <div onClick={(event) => event.stopPropagation()}>
                  <AssignUser
                    usersAssigned={task?.userIDs || []}
                    handleAssign={handleAssign}
                    sizes='assigned-user-avatar'
                  />
                </div>
            </div>
            <div className='footer-task'>
              <Typography className='task-id'>{`#${taskID}`}</Typography>
              <IconButton
                className='delete-task'
                onClick={(event) => {
                  setOpen(true)
                  event.stopPropagation()
                }}
              >
                <DeleteIcon className='delete-task-icon' />
              </IconButton>
            </div>
        </div>
        <ConfirmDialog
          warning='Are you sure you want to CONTINUE?'
          onOpen={open}
          handleClose={cancelDelete}
          handleNo={cancelDelete}
          handleYes={handleDeleteTask}
          status='REMOVE'
          style='deleted-task-dialog'
        />
    </>
  )
}

export default (TasksUI)
