import { Button, Container, Typography } from '@material-ui/core';
import React, { FunctionComponent, useEffect } from 'react';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import { useRouter } from 'next/router';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { getTaskStatusByIDThunkAction } from 'pages/home/logic/home_reducer';

interface InitialProps {
  title: string;
  taskStatusID: string;
}

const TaskStatusNotificationUI: FunctionComponent<InitialProps> = (props: InitialProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const taskStatuses = useSelector((state: RootStateOrAny) => state.taskStatuses);
  const taskStatus = taskStatuses.taskStatusNotification;
  useEffect(() => {
    dispatch(getTaskStatusByIDThunkAction(props.title, props.taskStatusID));
  }, []);
  const onPushToPage = (path: string) => {
    return router.push(`/${path}`, `/${path}.html`);
  };

  return (
    <Container className='content-detail-notification'>
        <div className='tile-detail-notification'>
            <Typography component='h4' className='h4-tile-detail'>{taskStatus.title}</Typography>
        </div>
        <div className='description-detail-notification'>
            <Typography className='span-description-detail-notification' component='span'>{taskStatus.description}</Typography>
        </div>
        <Button onClick={() => onPushToPage('home')}><ArrowRightAltIcon/></Button>
    </Container>
  );
};

export default (TaskStatusNotificationUI);
