import {
  TaskBoardsType, updateTaskToTaskStatusByIdThunkAction,
} from '../logic/task_boards_reducer'
import React, { FunctionComponent, useState, useCallback, useEffect } from 'react'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux'
import TaskStatusUI from '../../task_statuses/UI/task_statuses'
import NavClickUp from './task_board_header'
import { Typography } from '@material-ui/core'
import CheckIcon from '@material-ui/icons/Check'
import CloseIcon from '@material-ui/icons/Close'
import { UserInfoType } from 'helpers/type'
import { DragDropContext } from 'react-beautiful-dnd'
import { Roles } from 'constants/roles'
import { RootState } from 'redux/reducers_registration'
import { checkValidAccess } from 'helpers/check_valid_access'
import { createStatusThunkAction } from 'pages/task_statuses/logic/task_statuses_reducer'
import { updateTaskIDsToStatusByID } from '../logic/task_boards_action'
import { checkIfEmptyArray } from 'helpers/check_if_empty_array'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getTasksThunkAction, TaskType } from 'pages/tasks/logic/task_reducer'
import { DisappearedLoading } from 'react-loadingg'

const validAccesses = [Roles.COMPANY_MANAGER, Roles.DEPARTMENT_MANAGER, Roles.COMPANY_STAFF, Roles.DEPARTMENT_STAFF]

interface IDroppable {
  droppableId: string
  index: number
}

interface OnDropResult {
  destination: IDroppable
  source: IDroppable
  draggableId: string
}

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source)
  const destClone = Array.from(destination)
  const [removed] = sourceClone.splice(droppableSource.index, 1)

  destClone.splice(droppableDestination.index, 0, removed)

  const resultMove = {}
  resultMove[droppableSource.droppableId] = sourceClone
  resultMove[droppableDestination.droppableId] = destClone

  return resultMove
}

const BoardTasks: FunctionComponent = () => {
  const {
    loading,
    currentTaskBoard,
  }: TaskBoardsType = useSelector((state: RootStateOrAny) => state.taskBoards)
  const {
    tasks,
    totalCountTask,
    filteringTaskByUser,
    selectedUserIDs,
    selectedTags,
    selectedTitle,
  }: TaskType = useSelector((state: RootState) => state.tasks)
  const {
    isAdmin,
    rolesInCompany,
  }: UserInfoType = useSelector((state: RootState) => state?.userInfo)
  const checkUserScope = isAdmin || checkValidAccess({ rolesInCompany, validAccesses })
  const dispatch = useDispatch()
  const [isAddStatus, setIsAddStatus] = useState(false)
  const [title, setTitle] = useState('')
  const addStatusStyle = !isAddStatus ? 'no-add-status' : 'add-status-style'
  const tasksLength = Object.keys(tasks).length

  useEffect(() => {
    fetchTasksData()
  }, [
    selectedUserIDs,
    selectedTags,
    selectedTitle,
    filteringTaskByUser,
    currentTaskBoard,
  ])

  const GenerateTaskStatuses = useCallback(() => {
    if (!currentTaskBoard?.taskStatusIDs?.length) {
      return <></>
    }

    return (<>
      {currentTaskBoard?.taskStatusIDs?.map((each) =>
        <TaskStatusUI
          key={each?._id}
          taskStatusID={each}
        />,
      )}
    </>)
  }, [currentTaskBoard])

  const getTasksFromTaskStatus = ({ taskStatusID }) => {
    let tempTaskIDs: string[] = []

    if (!taskStatusID || !checkIfEmptyArray(currentTaskBoard?.taskStatusIDs)) {
      return tempTaskIDs
    }

    tempTaskIDs = currentTaskBoard.taskStatusIDs?.find((each) => each?._id === taskStatusID)?.taskIDs || []

    return tempTaskIDs
  }

  const onDragEnd = (result) => {
    const { source, destination, draggableId }: OnDropResult = result

    if (!destination) {
      return
    }

    if (source.droppableId === destination.droppableId) {
      const items: string[] = reorder(
        getTasksFromTaskStatus({ taskStatusID: source.droppableId }),
        source.index,
        destination.index,
      ) as string[]

      dispatch(updateTaskIDsToStatusByID({
        statusID: destination.droppableId,
        taskIDs: items,
      }))

      return
    }

    const sourceTasks = getTasksFromTaskStatus({ taskStatusID: source.droppableId }) || []
    let destinationTasks = getTasksFromTaskStatus({ taskStatusID: destination.droppableId }) || []

    const movedData = move(
      sourceTasks,
      destinationTasks,
      source,
      destination,
    )

    const newSourceTasks = movedData[source.droppableId] as string[]
    destinationTasks = movedData[destination.droppableId] as string[]
    dispatch(updateTaskToTaskStatusByIdThunkAction({
      destinationTasks,
      taskID: draggableId,
      data: {
        taskStatusID: destination.droppableId,
        newIndex: destination.index,
      },
      sourceTasks: newSourceTasks,
      sourceTaskStatusID: source.droppableId,
    }))
  }

  const submitCreatedTaskStatus = async () => {
    if (!checkUserScope) {
      return
    }

    dispatch(createStatusThunkAction(title))
    setIsAddStatus(false)
  }

  const addTaskStatusUI = () => {
    return (
      <div className={`add-status-modal ${addStatusStyle}`} >
        <input
          autoFocus
          className='add-status-input'
          placeholder='STATUS NAME'
          onChange={(event) => setTitle(event.target.value)}
        />
        <div className='close-create-status' onClick={() => setIsAddStatus(false)}>
          <CloseIcon className='close-create-status-icon' />
        </div>
        <div className='submit-create-status' onClick={submitCreatedTaskStatus} >
          <CheckIcon className='submit-create-status-icon' />
        </div>
      </div>
    )
  }

  const fetchTasksData = () => {
    dispatch(getTasksThunkAction(currentTaskBoard))
  }

  return (
    <div className='board'>
      <NavClickUp />
      <div className='board-tasks'>
      <InfiniteScroll
        className='board-tasks--showing-tasks'
        dataLength={tasksLength}
        hasMore={tasksLength < totalCountTask}
        next={fetchTasksData}
        loader={loading ?? <DisappearedLoading color={'#67cb48'} />}
        scrollThreshold={0.8}
        height={500}
      >
        <>
          <DragDropContext onDragEnd={onDragEnd}>
            <GenerateTaskStatuses />
          </DragDropContext>
          <div className='add-task task-status'>
            <div className='status'>
              {isAddStatus ?
                addTaskStatusUI() :
                <Typography component='span' className='add-task-text' onClick={() => setIsAddStatus(true)}>
                  NEW STATUS
                </Typography>
              }
            </div>
          </div>
        </>
      </InfiniteScroll>
      </div>
    </div>
  )
}

export default (BoardTasks)
