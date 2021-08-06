import { Grid, Tooltip } from '@material-ui/core'
import EventOutlinedIcon from '@material-ui/icons/EventOutlined'
import EventAvailableOutlinedIcon from '@material-ui/icons/EventAvailableOutlined'
import HourglassEmptyOutlinedIcon from '@material-ui/icons/HourglassEmptyOutlined'
import React from 'react'
import moment from 'moment'
import DateIconPicker from './date_picker'
import DatetimeIconPicker from './date_and_time_picker'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux'
import Priority, { priorityLevels } from './priority_task'
import { setTempararyTask } from '../logic/task_action'
import OutlinedFlagIcon from '@material-ui/icons/OutlinedFlag'

const Panel: React.FC = () => {
  const newTask = useSelector((state: RootStateOrAny) => state.tasks?.temporaryTask)
  const dispatch = useDispatch()

  const onChangeDate = (event) => {
    if (event.name === 'estimateDate') {
      dispatch(setTempararyTask({
        ...newTask,
        [event.name]: moment(event.value).endOf('day').toString(),
      }))

      return
    }
    dispatch(setTempararyTask({ ...newTask, [event.name]: event.value.toString() }))
  }

  return (
    <Grid
      container
      justify='flex-start'
      spacing={newTask?.startDate ? 1 : 2}
      className='grid-icon'
    >
      <Grid item>
        <Priority
          getPriority={(priority) =>
            dispatch(setTempararyTask({ ...newTask, priority }))
          }
        >
          <Tooltip title='Set Priority' arrow={true} placement='top'>
            <OutlinedFlagIcon
              fontSize='small'
              className='icon-add'
              style={{
                color: priorityLevels[newTask?.priority]?.color || '#7C828D',
              }}
            />
          </Tooltip>
        </Priority>
      </Grid>
      <Grid item>
        <DatetimeIconPicker
          onChangeDate={(event) =>
            onChangeDate({ name: 'startDate', value: event })
          }
          title='Start Date'
          minDateTime={moment()}
          date={newTask?.startDate}
        >
          <EventOutlinedIcon fontSize='small' />
        </DatetimeIconPicker>
      </Grid>
      <Grid item>
        <DatetimeIconPicker
          onChangeDate={(event) =>
            onChangeDate({ name: 'dueDate', value: event })
          }
          title='Due Date'
          minDateTime={
            newTask?.startDate || moment()
          }
          date={newTask?.dueDate}
        >
          <EventAvailableOutlinedIcon fontSize='small' />
        </DatetimeIconPicker>
      </Grid>
      <Grid item>
        <DateIconPicker
          onChangeDate={(event) =>
            onChangeDate({ name: 'estimateDate', value: event })
          }
          title='Estimate task'
          minDate={moment()}
          name='estimateDate'
          date={newTask.estimateDate}
        >
          <HourglassEmptyOutlinedIcon fontSize='small' />
        </DateIconPicker>
      </Grid>
    </Grid>
  )
}
export default Panel
