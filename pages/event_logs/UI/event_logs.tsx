import { Container, Typography } from '@material-ui/core';
import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/reducers_registration';
import { EventLogPage } from '../logic/event_log_interface';
import { getEventLogsData } from '../logic/event_log_reducer';
import EventLogHead from './event_log_head';
import Issues from './issues';

const EventLog: FunctionComponent = ({}) => {
  const dispatch = useDispatch();
  const {
    eventLogs,
    selectedEnv,
    selectedProjectID,
    selectedTime,
    loading,
    hasNoEventLogs,
  }: EventLogPage = useSelector((state: RootState) => state.eventLogs);

  useEffect(() => {
    dispatch(getEventLogsData());
  }, [selectedEnv, selectedProjectID, selectedTime]);

  const generatedEventLog = () => {
    if (!eventLogs.length && hasNoEventLogs) {
      return (
        <div className='empty-state'>
          <img alt='logo' width='100px' src='../document.svg'/>
          <Typography color='textSecondary' className='empty-state--text'>Not found any eventLogs</Typography>
        </div>
      );
    }

    return (
      <Issues eventLogs={eventLogs} loading={loading}/>
    );
  };

  return (
        <div className='event-container'>
            <EventLogHead />
            <Container className='event-content'>
              <Typography className='title-issues'>Issues</Typography>
              {generatedEventLog()}
            </Container>
        </div>
  );
};

export default EventLog;
