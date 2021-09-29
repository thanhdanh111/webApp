import { Box, List, ListItem, Popper } from '@material-ui/core'
import AssignUser from './assign_user'
import OutlinedFlagIcon from '@material-ui/icons/OutlinedFlag'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux'
import { updateAssignUserThunkAction, updateTaskThunkAction } from '../logic/task_reducer'
import { Task, TaskBoard, TaskStatus, User } from 'helpers/type'
import { useState } from 'react'
import Priority, { priorityLevels } from './priority_task'
import { updateTaskToTaskStatusByIdThunkAction } from 'pages/task_boards/logic/task_boards_reducer'

const StatusDetail = () => {
  const { currentTask }: {currentTask : Task} = useSelector((state: RootStateOrAny) => state.tasks)
  const { currentTaskBoard }: { currentTaskBoard: TaskBoard} = useSelector((state: RootStateOrAny) => state.taskBoards)
  const dispatch = useDispatch()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const id = anchorEl ? 'simple-popper' : undefined

  const getAssignUser = (users) => {
    const userAssigns = users?.map((each) => each?._id)

    dispatch(updateAssignUserThunkAction(currentTask._id, userAssigns))
  }

  const renderStatuses = () => {
    const statuses = currentTaskBoard.taskStatusIDs?.map((status) => {
      if (currentTask.taskStatusID?._id === status._id){
        return
      }

      return(
        <ListItem
          button
          key={status._id}
          className={`item-status item-${status.title.toLowerCase().replace(' ', '-')}`}
          onClick={() => {
            changeStatus(status._id)
            setAnchorEl(null)
          }}
        >
          {status.title}
        </ListItem>
      )
    })

    return statuses
  }

  const changeStatus = (taskStatusID) => {
    if (!currentTask){
      return
    }

    const iUpdateTask = {
      taskID: currentTask?._id,
      data: {
        taskStatusID,
        newIndex: 0,
      },
      sourceTaskStatusID: currentTask?.taskStatusID._id,
      sourceTasks: getTasksInTaskStatus(
        currentTaskBoard.taskStatusIDs || [],
        currentTask.taskStatusID._id,
      ).filter((task) => task !== currentTask._id),
      destinationTasks: [currentTask._id || '', ...getTasksInTaskStatus(
        currentTaskBoard.taskStatusIDs || [],
        taskStatusID,
      )],
    }

    dispatch(updateTaskToTaskStatusByIdThunkAction(iUpdateTask))
  }

  const getTasksInTaskStatus = (taskStatusIDs: TaskStatus[], taskStatusID: string) => {
    return taskStatusIDs?.find((taskStatus) => taskStatus._id === taskStatusID)?.taskIDs || []
  }

  return (
    <Box
      display='flex'
      alignItems='center'
      alignContent='center'
      py='15px'
      pl={4}
      className='status-modal'
    >
      <Box
        display='flex'
        height='30px'
        className='status-detail'
        onClick={handleClick}
      >
        <button className='btn-status'>
          {currentTask.taskStatusID?.title}
        </button>
      </Box>
      <Popper
        id={id}
        open={!!anchorEl}
        anchorEl={anchorEl}
        placement='bottom-start'
        className='popup-status-detail'
      >
        <List component='nav' className='list-status'>
          {renderStatuses()}
        </List>
      </Popper>
      <div onClick={(event) => event.stopPropagation()}>
        <AssignUser
          usersAssigned={currentTask?.userIDs as User[]}
          handleAssign={getAssignUser}
          sizes='assigned-user-avatar'
        />
      </div>
      <Box className='priority-detail' display='flex' alignItems='center'>
        <Priority
          getPriority={(priority) =>
            dispatch(updateTaskThunkAction(currentTask._id, { priority : priority || 'LOW' }))
          }
        >
          <OutlinedFlagIcon
            style={{
              color: priorityLevels[currentTask?.priority || '']?.color || '#d3d3d3',
              borderColor: priorityLevels[currentTask?.priority || '']?.color || '#d3d3d3',
            }}
            className='border-dashed-icon priority-icon'
          />
        </Priority>
      </Box>
    </Box>
  )
}

export default StatusDetail
