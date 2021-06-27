import { Button, Container } from '@material-ui/core';
import React, { FunctionComponent, useEffect } from 'react';
import { useRouter } from 'next/router';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { isAdminOrManagerUser } from 'helpers/check_role_user';
import { getDaysoffByIDThunkAction } from 'pages/time_off/logic/time_off_apis';

interface InitialProps {
  targetEntityName: string;
  daysOffID: string;
}

const TimeOffNotificationContent: FunctionComponent<InitialProps> = (props: InitialProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const timeOff = useSelector((state: RootStateOrAny) => state.timeoff);
  const dayOffbyID = timeOff.dayOff;
  const authState = useSelector((state: RootStateOrAny) => state.auth);
  const companyID = authState.extendedCompany?.companyID?._id;
  const departmentID = authState.department?._id;
  const checkRole = isAdminOrManagerUser(authState.access, companyID, departmentID);

  useEffect(() => {
    dispatch(getDaysoffByIDThunkAction(props.daysOffID));
  }, []);
  const onPushToPage = (path: string) => {
    return router.push(`/${path}`, `/${path}.html`);
  };
  const startDay = (new Date(Date.parse(dayOffbyID.startTime))).toLocaleDateString('en-GB');
  const endDate = (new Date(Date.parse(dayOffbyID.endTime))).toLocaleDateString('en-GB');
  const name = dayOffbyID.createdBy && `${dayOffbyID.createdBy?.firstName} ${dayOffbyID?.createdBy.lastName}`;

  return (
    <Container className='content-detail-notification-dayOff'>
      <h2 className='notification-detail-title'>DAY OFF DETAIL</h2>
      <div className='notification-detail-title-content'>
      <span className='notification-detail-content-span' > {name} </span> has request a <span className='notification-detail-content-span'> day  Offs </span> from {startDay} to {endDate}
      </div>
      <div className='title-detail-notification-dayOff'>
        <span>Reason : </span>{dayOffbyID.reason}
      </div>
      { checkRole ?
        <div className='btn-detail-notification-dayOff'>
        <Button variant='outlined' onClick={() => onPushToPage('home')}>Go to page</Button>
        <Button variant='contained' color='secondary'>Accept</Button>
        <Button className='btn-reject' variant='contained'>Reject</Button>
        </div>
        : null
      }
    </Container>
  );
};

export default (TimeOffNotificationContent);
