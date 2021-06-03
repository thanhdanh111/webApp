import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/reducers_registration';
import { useSnackbar, WithSnackbarProps } from 'notistack';
import { updateCompanyNotifications } from './logic/company_actions';
import { CompanyStateType } from './logic/company_reducer';
import ConnectSlackTabUi from './UI/connect_slack_tab';
import CompanyDetailTab from './UI/company_detail';
import { Avatar, Container, Grid } from '@material-ui/core';

const CompanyPage = () => {
  const { companyNotifications  }: CompanyStateType  = useSelector((state: RootState) => state.company);
  const authState  = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const { enqueueSnackbar }: WithSnackbarProps = useSnackbar();
  const photoNameCompany = authState?.extendedCompany?.companyID?.name?.charAt(0);
  const [img, setImg] = useState(true);

  useEffect(pushNotification, [companyNotifications]);

  function pushNotification() {

    if (companyNotifications && companyNotifications.length) {
      for (const notification of companyNotifications) {
        if (!notification) {
          continue;
        }

        enqueueSnackbar(notification.message, { variant: notification['variant'] });
      }

      dispatch(updateCompanyNotifications({ notifications: [] }));
    }

    return;
  }

  return (
    <>
      <Container className='company-page'>
        <Grid className='company-photo' sm={3} xs={12}>
          { (authState?.extendedCompany?.companyID?.photos?.[0] && img) ?
            <img
              src={authState.extendedCompany.companyID.photos[0]}
              className='img-company'
              onError={() => setImg(false)}
            /> :
            <Avatar
              variant='rounded'
              className='img-company'
            >
              {photoNameCompany}
            </Avatar>
          }
        </Grid>
        <Grid className='company-information' sm={9} xs={12}>
          <CompanyDetailTab/>
          <ConnectSlackTabUi />

        </Grid>
      </Container>
    </>
  );
};

export default CompanyPage;
