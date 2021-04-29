import { Container, Typography } from '@material-ui/core';
import { EventLogPage, EventLogState } from 'pages/event_logs/logic/event_log_interface';
import React, { useEffect } from 'react';
import moment from 'moment';
import Exception from './UI/event_log/exception';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getEventLogData } from './logic/event_log_reducer';
import { RootState } from 'redux/reducers_registration';
import EventLogHead from './UI/event_log_head';
import { DisappearedLoading } from 'react-loadingg';
import BreadcrumbsTable from './UI/event_log/breadcrumbs';

const EventLogDetail = (props: EventLogState) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const time = moment(props.createdAt).utc().format('LLL Z');
  const {
    selectedEventLog,
    loading,
  }: EventLogPage = useSelector((state: RootState) => state.eventLogs);

  const query = router.query;

  useEffect(() => {
    void fetchData();
  }, []);

  const fetchData = () => {
    dispatch(getEventLogData(query.id));
  };

  return (
    <div className='event-log-detail'>
      <EventLogHead />
      {loading && <DisappearedLoading color={'#67cb48'}/>}
      {!loading &&
        <div className='detail-content'>
          <div className='detail-top'>
              <Container className='name-event-log'>
                  <Typography className='name-event-log-detail'>{selectedEventLog.exception.type}</Typography>
                  <div className='status-event' />
              </Container>
              <Container className='description-event'>
                  <Typography className='id-event'>
                    Event <span  className='id-event-exception'>{selectedEventLog._id}</span>
                  </Typography>
                  <Typography className='time-event'>{time}</Typography>
              </Container>
          </div>
          <div className='exception'>
              <Typography className='exception-title'>
                EXCEPTION
                <span className='description-title'>(most recent call first)</span>
              </Typography>
              <Typography className='type-exception'>{selectedEventLog.exception.type}</Typography>
              <Exception {...selectedEventLog.exception} />
              <BreadcrumbsTable breadcrumbs={selectedEventLog.breadcrumbs} loading={loading} />
          </div>
      </div>}
    </div>
  );
};

export default EventLogDetail;
