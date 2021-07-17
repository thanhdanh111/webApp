import { Container, Link, Typography } from '@material-ui/core'
import React, { useRef, useState } from 'react'
import AddIcon from '@material-ui/icons/Add'
import TasksUI from '../../tasks/UI/tasks'
import { useDispatch, useSelector } from 'react-redux'
import { DisappearedLoading } from 'react-loadingg'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import TaskNew from 'pages/tasks/UI/task_new'
import ActionTaskStatusUI from './action_task_status'
import RenameStatusUI from './ui_rename_task_status'
import { StatusesType } from '../logic/task_statuses_reducer'
import { RootState } from 'redux/reducers_registration'
import { TaskType } from 'pages/tasks/logic/task_reducer'
import { setCurrentStatus } from '../logic/task_statuses_action'
import { TaskStatus } from 'helpers/type'
import { checkIfEmptyArray } from 'helpers/check_if_empty_array'

interface InitProps {
  taskStatusID: TaskStatus
}

const TaskStatusUI = (props: InitProps) => {
  const { taskStatusID }: InitProps = props
  const { loading, currentStatusID }: StatusesType = useSelector((state: RootState) => state.statuses)
  const { tasks }: TaskType = useSelector((state: RootState) => state.tasks)
  const dispatch = useDispatch()
  const newTaskRef = useRef<HTMLTitleElement>(null)
  const style = taskStatusID && taskStatusID?.title?.split(' ').join('-').toLowerCase()
  const [retitling, setRetitling] = useState(false)

  const setRetitleStatus = () => {
    setRetitling(!retitling)
  }

  const TaskStatusContent = () => {
    const scrollInput = () => {
      if (!newTaskRef.current) {
        return
      }
      newTaskRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    const generateTask = () => {
      if (!checkIfEmptyArray(taskStatusID?.taskIDs)) {
        return
      }

      return taskStatusID.taskIDs?.map((key, index) => {
        if (!tasks[key]) {
          return
        }

        return (
          <>
            <Draggable
              key={key}
              draggableId={key}
              index={index}
            >
              {(provideTask) => {
                return (
                  <div
                    ref={provideTask.innerRef}
                    {...provideTask.draggableProps}
                    {...provideTask.dragHandleProps}
                  >
                    <TasksUI key={key} task={tasks[key]}/>
                  </div>
                )
              }}
            </Draggable>
          </>
        )
      })
    }

    return (
      <>
      <Droppable droppableId={taskStatusID?._id} type='TASK_STATUS'>
        {(provided) => (
          <div
            className={`task-status ${style}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <div className='status'>
              <Container className='status-left'>
                  <RenameStatusUI
                    taskStatusID={taskStatusID}
                    renaming={retitling}
                    setRetitleStatus={setRetitleStatus}
                  />
              </Container>
              <Container className='status-right'>
                  <ActionTaskStatusUI
                    taskStatusID={taskStatusID?._id}
                    setRenameStatus={setRetitleStatus}
                  />
                  <Link
                    className='actions-status add-action'
                    onClick={() => dispatch(setCurrentStatus(taskStatusID?._id || ''))}
                  >
                    <AddIcon />
                  </Link>
              </Container>
            </div>
            <div className='status-task-list'>
              {
                currentStatusID === taskStatusID?._id &&
                <TaskNew
                  taskStatusID={taskStatusID?._id}
                />
              }
              {generateTask()}
              {
                currentStatusID !== taskStatusID?._id &&
                  <div
                    className='add-task'
                    onClick={() => {
                      dispatch(setCurrentStatus(taskStatusID?._id))
                      scrollInput()
                    }}
                  >
                    <Link className='icon-add-task'><AddIcon /></Link>
                    <Typography component='span' className='text-add-task'>NEW TASK</Typography>
                  </div>
                }
            </div>
          </div>
        )}
      </Droppable>
    </>
    )
  }

  return (
    <div className='task-status'>
      {(!loading) &&
        TaskStatusContent()
      }
      {loading && <DisappearedLoading color={'#67cb48'}/>}
    </div>
  )
}

export default (TaskStatusUI)
