import { Grid } from '@material-ui/core'
import EventOutlinedIcon from '@material-ui/icons/EventOutlined'
import EventAvailableOutlinedIcon from '@material-ui/icons/EventAvailableOutlined'
import HourglassEmptyOutlinedIcon from '@material-ui/icons/HourglassEmptyOutlined'
import React from 'react'
import moment from 'moment'
import DateIconPicker from './date_picker'
import DatetimeIconPicker from './date_and_time_picker'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux'
import Priority from './priority_task'
import { setTempararyTask } from '../logic/task_action'

const Panel: React.FC = () => {
  const newTask = useSelector((state: RootStateOrAny) => state.taskBoards?.newTask)
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
    <Grid container justify='flex-start' spacing={newTask?.startDate ? 1 : 2} className='grid-icon'>
      <Grid item>
        <Priority/>
      </Grid>
      <Grid item>
        <DatetimeIconPicker onChangeDate={onChangeDate} title='Start Date' minDateTime={moment()} name='startDate'>
          <EventOutlinedIcon fontSize='small' />
        </DatetimeIconPicker>
      </Grid>
      <Grid item>
        <DatetimeIconPicker
          onChangeDate={onChangeDate}
          title='Due Date'
          minDateTime={
            newTask?.startDate
              ? moment(newTask?.startDate) > moment()
                ? newTask?.startDate
                : moment()
              : moment()
          }
          name='dueDate'
        >
          <EventAvailableOutlinedIcon fontSize='small' />
        </DatetimeIconPicker>
      </Grid>
      <Grid item>
        <DateIconPicker onChangeDate={onChangeDate} title='Estimate task' minDate={moment()} name='estimateDate'>
          <HourglassEmptyOutlinedIcon fontSize='small' />
        </DateIconPicker>
      </Grid>
    </Grid>
  )
}
export default Panel
