import { Checkbox, Container, MenuItem, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { FunctionComponent } from 'react';
import { EventLogState } from '../logic/event_log_interface';

interface InitProps {
  eventLog: EventLogState;
}

type IssuesItemType = InitProps;

const IssuesItem: FunctionComponent<IssuesItemType> = (props: InitProps) => {

  const { eventLog }: InitProps = props;
  const time = new Date(eventLog.createdAt);
  const router = useRouter();
  const pathname = router.pathname;

  const onPushToPage = (url: string) => {
    void router.push(`${pathname}/${url}`);
  };

  const showTime = time.toUTCString();

  return (
    <MenuItem className='issus-item'>
      <div className='issus-item-div' onClick={() => onPushToPage(eventLog._id)}>
        <Container className='issus-top'>
              <Checkbox className='issus-check' />
              <a>
                {eventLog.exception.type || 'undefined'}
              </a>
          </Container>
          <Container className='issus-bottom'>
              <div className='value-issus'>
                <Typography className='issus-item-value'>{eventLog.exception.value}</Typography>
              </div>
              <Typography className='issus-item-timestamp'>{showTime}</Typography>
          </Container>
      </div>
    </MenuItem>
  );
};

export default IssuesItem;
