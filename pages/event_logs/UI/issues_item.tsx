import { Checkbox, Container, MenuItem, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import Link from 'next/link';
import React, { FunctionComponent } from 'react';
import { EventLogState } from '../logic/event_log_interface';

interface InitProps {
  eventLog: EventLogState;
}

type IssuesItemType = InitProps;

const IssuesItem: FunctionComponent<IssuesItemType> = (props: InitProps) => {

  const { eventLog }: InitProps = props;
  const router = useRouter();
  const time = new Date(eventLog.createdAt);
  const pathname = router.pathname;

  const showTime = time.toUTCString();

  return (
    <MenuItem className='issus'>
        <Container className='issus-top'>
            <Checkbox className='issus-check' />
            <Link
              href={`${pathname}/${eventLog._id}`}
            >
              {eventLog.exception.type || 'undefined'}
            </Link>
        </Container>
        <Container className='issus-bottom'>
            <div className='value-issus'>
              <Typography className='issus-item-value'>{eventLog.exception.value}</Typography>
            </div>
            <Typography className='issus-item-timestamp'>{showTime}</Typography>
        </Container>
    </MenuItem>
  );
};

export default IssuesItem;
