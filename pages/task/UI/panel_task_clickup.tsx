import {
  Box,
  Grid,
  Menu,
  MenuItem,
  Tooltip,
} from '@material-ui/core';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import OutlinedFlagIcon from '@material-ui/icons/OutlinedFlag';
import EventOutlinedIcon from '@material-ui/icons/EventOutlined';
import EventAvailableOutlinedIcon from '@material-ui/icons/EventAvailableOutlined';
import HourglassEmptyOutlinedIcon from '@material-ui/icons/HourglassEmptyOutlined';
import React from 'react';
import moment from 'moment';
import CloseIcon from '@material-ui/icons/Close';
import DateIconPicker from './date_picker_clickup';
import DatetimeIconPicker from './date_and_time_picker';
import { updateNewTask } from '../../home/logic/home_actions';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';

const priorityLevel = [
  {
    text: 'Urgent',
    value: 'URGENT',
    color: '#F24423',
  },
  {
    text: 'High',
    value: 'HIGH',
    color: '#FFCD37',
  },
  {
    text: 'Normal',
    value: 'NORMAL',
    color: '#70DCFC',
  },
  {
    text: 'Low',
    value: 'LOW',
    color: '#D8D8D8',
  },
  {
    text: 'Clear',
    value: '',
    color: '#F8B6B1',
  },
];

enum TypePiority {
  URGENT = 'urgent-icon',
  HIGH = 'high-icon',
  NORMAL = 'normal-icon',
  LOW = 'low-icon',
}

const Panel: React.FC = () => {
  const newTask = useSelector((state: RootStateOrAny) => state.taskStatuses?.newTask);
  const dispatch = useDispatch();

  const onChoosingValue = (priority) => {
    dispatch(updateNewTask({ ...newTask, priority }));
  };

  const onChangeDate = (event) => {
    if (event.name === 'estimateDate') {
      dispatch(updateNewTask({
        ...newTask,
        [event.name]: moment(event.value).endOf('day').toString(),
      }));

      return;
    }

    dispatch(updateNewTask({ ...newTask, [event.name]: event.value.toString() }));
  };

  return (
    <Grid
      container
      justify='flex-start'
      spacing={newTask?.startDate ? 1 : 2}
      className='grid-icon'
    >
      <Grid item>
        <PopupState variant='popover'>
          {(popupState) => (
            <React.Fragment>
              <Tooltip title='Set Priority' arrow={true} placement='top'>
                  <OutlinedFlagIcon
                    fontSize='small'
                    className={`icon-add ${TypePiority[newTask?.priority || '']}`}
                    {...bindTrigger(popupState)}
                  />
              </Tooltip>
              <Menu
                {...bindMenu(popupState)}
                autoFocus={false}
                className='priority-popup'
              >
                {priorityLevel.map((val, key) => (
                  <MenuItem
                    key={key}
                    onClick={() => {
                      onChoosingValue(val.value);
                      popupState.close();
                    }}
                  >
                    <Box display='flex' alignItems='center'>
                      {val.value === '' ? (
                        <CloseIcon
                          fontSize='small'
                          className='icon-popup'
                          style={{ color: val.color }}
                        />
                      ) : (
                        <OutlinedFlagIcon
                          fontSize='small'
                          className='icon-popup'
                          style={{ color: val.color }}
                        />
                      )}
                      {val.text}
                    </Box>
                  </MenuItem>
                ))}
              </Menu>
            </React.Fragment>
          )}
        </PopupState>
      </Grid>
      <Grid item>
        <DatetimeIconPicker
          onChangeDate={onChangeDate}
          title='Start Date'
          minDateTime={moment()}
          name='startDate'
        >
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
        <DateIconPicker
          onChangeDate={onChangeDate}
          title='Estimate task'
          minDate={moment()}
          name='estimateDate'
        >
          <HourglassEmptyOutlinedIcon fontSize='small' />
        </DateIconPicker>
      </Grid>
    </Grid>
  );
};
export default Panel;
