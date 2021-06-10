import { Box, Button, Container, Grid, Link, Typography } from '@material-ui/core';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Login } from '../logic/login_actions';
import { config } from 'helpers/get_config';
import { GetUserDataThunkAction } from '../logic/login_reducer';
import * as qs from 'query-string';
import { useRouter } from 'next/router';
import { DisappearedLoading } from 'react-loadingg';
const redirectUrl = `${config.BASE_URL}/auth/google/callback&state=${config.STATE}`
  .split(':')
  .join('%3A')
  .split('/')
  .join('%2F');
const linkAPILogin = `${config.API_LOGIN}&redirect_uri=${redirectUrl}`;
const LoginUi: FunctionComponent = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    void logUserIn();
  }, []);

  function logUserIn() {
    const localAccess = localStorage.getItem('access_token');

    if (localAccess) {
      void router.replace('/home', '/home.html');
      setIsLogin(false);
    }

    const query = qs.parse(window.location.search);
    const token = query.token;
    if (!token) {
      return;
    }
    const accessToken = token.replace('?token=', '');
    localStorage.setItem('access_token', accessToken);
    setIsLogin(true);

    dispatch(GetUserDataThunkAction(accessToken));

    dispatch(Login(accessToken));

    void router.replace('/home', '/home.html');
    setIsLogin(false);
  }

  const FormLogin = () => {

    return (
      <Grid sm={12} md={7} lg={9} item className='form-login'>
        <Grid item className='login-contain'>
          <div className='btn'>
            <Button
              startIcon={
                <img alt='signin icon' src='../signin-google.svg'/>
              }
              className='btn-gg'
              size='medium'
              href={linkAPILogin}
            >
                Sign in with Google
            </Button>
          </div>
          <Box className='login-contain--signup' component='body' display={{ sm: 'block' }}>
            Don't have an account?
          <Link className='login-contain--link' href='#'> Get started</Link>
        </Box>
        </Grid>
      </Grid>
    );
  };

  const ImgLogin = () => {
    return (
      <Grid sm={false} md={5} lg={3} item className='img-login'>
        <Container className='logo'>
          <Link className='link-logo'><img alt='logo' className='logo-img' src='../logo_single.svg'/></Link>
        </Container>
        <Container className='text-img'>
          <Typography className='content-text' component='h3' variant='subtitle1' align='left' color='textPrimary'>
            Hi, Welcome Back
          </Typography>
        </Container>
        <Container className='image'>
          <div className='image-login'>
            <img alt='image' className='image-illustration' src='../illustration_login.svg' />
          </div>
        </Container>
      </Grid>
    );
  };

  return (
    <div className='login-page'>
      { isLogin ? <DisappearedLoading color={'#67cb48'} /> :
        <Container maxWidth='xl' className='login'>
          <div className='login-container'>
            <ImgLogin />
            <FormLogin />
          </div>
        </Container>}
    </div>
  );
};

export default LoginUi;
