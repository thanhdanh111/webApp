import {
  TaskBoardsType, updateTaskToTaskStatusByIdThunkAction,
} from '../logic/task_boards_reducer'
import { TaskType } from '../../tasks/logic/task_reducer'
import React, { FunctionComponent, useState, useCallback } from 'react'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux'
import { DisappearedLoading } from 'react-loadingg'
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
    isAdmin,
    rolesInCompany,
  }: UserInfoType =  useSelector((state: RootState) => state?.userInfo)
  const { tasks } : TaskType =  useSelector((state: RootState) => state?.tasks)
  const checkUserScope = isAdmin || checkValidAccess({ rolesInCompany, validAccesses })
  const dispatch = useDispatch()
  const [isAddStatus, setIsAddStatus] = useState(false)
  const [title, setTitle] = useState('')

  const addStatusStyle = !isAddStatus ? 'no-add-status' : 'add-status-style'

  const GenerateTaskStatuses = useCallback(() => {
    if (!currentTaskBoard || !currentTaskBoard?.taskStatusIDs) {
      return <></>
    }

    return (<>
      {
        checkIfEmptyArray(currentTaskBoard?.taskStatusIDs) && currentTaskBoard?.taskStatusIDs?.map((each) => {
          return (
            <>
              <TaskStatusUI
                key={each?._id}
                taskStatusID={each}
              />
            </>
          )
        })}
    </>
    )
  }, [tasks])

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
  }

  const addTaskStatusUI = () => {
    return (
      <div className={`add-status-modal ${addStatusStyle}`} >
        <input className='add-status-input' placeholder='STATUS NAME' onChange={(event) => setTitle(event.target.value)} />
        <div className='close-create-status' onClick={() => setIsAddStatus(false)}>
          <CloseIcon className='close-create-status-icon' />
        </div>
        <div className='submit-create-status' onClick={submitCreatedTaskStatus} >
          <CheckIcon className='submit-create-status-icon' />
        </div>
      </div>
    )
  }

  return (
    <div className='board'>
      <NavClickUp />
      <div className='board-tasks'>
          {!loading &&
          <>
            <DragDropContext onDragEnd={onDragEnd}>
              <GenerateTaskStatuses/>
            </DragDropContext>
            <div className='add-task task-status'>
              <div className='status'>
                {isAddStatus ?
                  addTaskStatusUI() :
                  <Typography component='span' className='add-task-text'  onClick={() => setIsAddStatus(true)}>
                    NEW STATUS
                  </Typography>
                }
              </div>
            </div>
          </>}
            {loading && <DisappearedLoading color={'#67cb48'}/>}
        </div>
      </div>
  )
}

export default (BoardTasks)
