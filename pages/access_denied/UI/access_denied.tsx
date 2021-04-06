import { Button, Grid } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { FunctionComponent } from 'react';

const AccessDenied: FunctionComponent = () => {
  const router = useRouter();
  const onBackToLogin = async () => {
    await router.replace('/login', '/login.html');
  };

  return (
    <Grid
      container
      direction='column'
      justify='center'
      alignItems='center'
      className='access-warn'
    >
      <Grid item className='access-warn__title'>
          <p>
            ACCESS DENIED
          </p>
          <hr />
      </Grid>
      <Grid item className='access-warn__content'>
        <p>
          You do not have permission to access this page. Please contact your Manager to request access.
        </p>
      </Grid>
      <Button className='access-warn__btn' size='small' onClick={onBackToLogin}>
        Return to login
      </Button>
    </Grid>
  );
};

export default AccessDenied;
