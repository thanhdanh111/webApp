import { Button, Container } from '@material-ui/core';
import React, { FunctionComponent, useEffect } from 'react';
import { useRouter } from 'next/router';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { getTimeoffByIDThunkAction } from 'pages/time_off/logic/time_off_apis';
import { checkValidAccess } from 'helpers/check_valid_access';
import { Roles } from 'constants/roles';

interface InitialProps {
  targetEntityName: string;
  daysOffID: string;
}

const TimeOffNotificationContent: FunctionComponent<InitialProps> = (props: InitialProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const timeOff = useSelector((state: RootStateOrAny) => state.timeoff);
  const timeOffDetail = timeOff?.timeOffDetail;
  const userInfo = useSelector((state: RootStateOrAny) => state?.userInfo);
  const departmentID = userInfo?.currentDepartment?._id;
  const haveComanyAccess = checkValidAccess({
    rolesInCompany: userInfo?.rolesInCompany,
    validAccesses: [Roles.COMPANY_MANAGER],
  });
  const haveDepartmentAccess = checkValidAccess({
    departmentID,
    rolesInDepartments: userInfo?.rolesInDepartments,
    validAccesses: [Roles.DEPARTMENT_MANAGER],
  });
  const checkRole = userInfo?.isAdmin || haveComanyAccess || haveDepartmentAccess;

  useEffect(() => {
    dispatch(getTimeoffByIDThunkAction(props?.daysOffID));
  }, []);

  const onPushToPage = (path: string) => {
    return router.push(`/${path}`, `/${path}.html`);
  };
  const startDay = (new Date(Date.parse(timeOffDetail?.startTime))).toLocaleDateString('en-GB');
  const endDate = (new Date(Date.parse(timeOffDetail?.endTime))).toLocaleDateString('en-GB');
  const name = timeOffDetail?.createdBy && `${timeOffDetail?.createdBy?.firstName} ${timeOffDetail?.createdBy?.lastName}`;

  return (
    <Container className='content-detail-notification-dayOff'>
      <h2 className='notification-detail-title'>DAY OFF DETAIL</h2>
      <div className='notification-detail-title-content'>
      <span className='notification-detail-content-span' > {name} </span> has request a <span className='notification-detail-content-span'> day  Offs </span> from {startDay} to {endDate}
      </div>
      <div className='title-detail-notification-dayOff'>
        <span>Reason : </span>{timeOffDetail?.reason}
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
