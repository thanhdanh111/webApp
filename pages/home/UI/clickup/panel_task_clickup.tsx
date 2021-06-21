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
import { Task } from 'helpers/type';
import moment from 'moment';
import CloseIcon from '@material-ui/icons/Close';
import DateIconPicker from './date_picker_clickup';
import DatetimeIconPicker from './datetime_picker';

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
    value: 'CLEAR',
    color: '#F8B6B1',
  },
];

enum TypePiority {
  URGENT = 'urgent-icon',
  HIGH = 'high-icon',
  NORMAL = 'normal-icon',
  LOW = 'low-icon',
}

interface InitProps {
  setTask: (e) => void;
  task: Task;
}

const Panel: React.FC<InitProps> = (props) => {
  const onChoosingValue = (priority) => {
    props.setTask({ ...props.task, priority });
  };

  const onChangeDate = (event) => {
    if (event.name === 'estimateDate') {
      props.setTask({
        ...props.task,
        [event.name]: moment(event.value).endOf('day').toString(),
      });

      return;
    }

    props.setTask({ ...props.task, [event.name]: event.value.toString() });
  };

  return (
    <Grid
      container
      justify='flex-start'
      spacing={props.task.startDate ? 1 : 2}
      className='grid-icon'
    >
      <Grid item>
        <PopupState variant='popover'>
          {(popupState) => (
            <React.Fragment>
              <Tooltip title='Set Priority' arrow={true} placement='top'>
                <Box className='icon-add' {...bindTrigger(popupState)}>
                  <OutlinedFlagIcon
                    fontSize='small'
                    className={TypePiority[props.task.priority || '']}
                  />
                </Box>
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
                      {val.value === 'CLEAR' ? (
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
            props.task.startDate
              ? moment(props.task.startDate) > moment()
                ? props.task.startDate
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
