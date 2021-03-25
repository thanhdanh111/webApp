import { Box, Button, Container, Grid, Link, Typography } from '@material-ui/core';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Login } from '../logic/login_actions';
import { config } from 'helpers/get_config';
import { GetUserDataThunkAction } from '../logic/login_reducer';
import * as qs from 'query-string';
import { useRouter } from 'next/router';
import { DisappearedLoading } from 'react-loadingg';
const redirectUrl = `${config.LOCAL_HOST}/auth/google/callback&state=${config.STATE}`
  .split(':')
  .join('%3A')
  .split('/')
  .join('%2F');
const linkAPILogin = `https://accounts.google.com/o/oauth2/v2/auth?scope=profile&access_type=offline&include_granted_scopes=true&response_type=code&client_id=${config.CLIENT_ID}&redirect_uri=${redirectUrl}`;
const LoginUi: FunctionComponent = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    void logUserIn();
  }, []);

  async function logUserIn() {
    const localAccess = localStorage.getItem('access_token');

    if (localAccess) {
      await router.push('/home');
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
    await Promise.all([
      dispatch(GetUserDataThunkAction(accessToken)),
      dispatch(Login(accessToken)),
    ]);

    await router.push('/home');
    setIsLogin(false);
  }

  const FormLogin = () => {
    return (
      <Grid sm={12} md={7} lg={9} item className='form-login'>
        <Box className='from-header' component='h5' display={{ xs: 'none', sm: 'block' }}>
          Don't have an account?
          <Link className='link-header' href='#'> Get started</Link>
        </Box>
        <Grid item className='login-contain'>
          <div className='context'>
            <Typography className='title-contain' component='h3' variant='h4' align='left' color='textPrimary'>
              Sign to Minimal
            </Typography>
            <Typography className='description-contain' align='left'>
              Enter your details below
            </Typography>
          </div>
          <div className='btn'>
            <Button className='btn-gg' color='inherit' size='medium' href={linkAPILogin}>
              <Typography className='icon-gg'>G</Typography>
            </Button>
          </div>
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
