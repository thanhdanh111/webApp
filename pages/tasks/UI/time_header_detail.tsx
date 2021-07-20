import { Box, Tooltip } from '@material-ui/core'
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline'
import EventAvailableOutlinedIcon from '@material-ui/icons/EventAvailableOutlined'
import DatetimeIconPicker from './date_and_time_picker'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { updateTaskThunkAction } from '../logic/task_reducer'

const TimeDetail: React.FC = () => {
  const task = useSelector((state: RootStateOrAny) => state.tasks.currentTask)
  const dispatch =  useDispatch()

  return (
    <Box className='detail-time'>
      <Tooltip
        title={`Created by Phạm Thị Yến on ${moment(task.createdAt).format('MMM DD, hh:ss a')} Updated on ${moment(task.updatedAt).format('MMM DD, hh:ss a')}`}
      >
        <Box className='item-time detail-created-time'>
          <p className='text-time'>CREATED</p>
          <p className='text-time'>{moment(task.createAt).format('MMM DD, hh:ss a')}</p>

        </Box>
      </Tooltip>
      <Box className='item-time detail-tracked'>
        <p className='text-time'>TIME TRACKED</p>
        <p className='text-time'>
          <PlayCircleOutlineIcon className='tracked-icon'/>
        </p>
      </Box>
      <Box className='item-time detail-due-date'>
        <DatetimeIconPicker
          title='Due date'
          minDateTime={task?.createdAt || moment()}
          onChangeDate={(dateTime) =>
            dispatch(updateTaskThunkAction(task._id, { dueDate: dateTime.toString() }))
          }
          date={task.dueDate}
        >
          <EventAvailableOutlinedIcon className='border-dashed-icon due-date' />
        </DatetimeIconPicker>
      </Box>
    </Box>
  )
}

export default TimeDetail
