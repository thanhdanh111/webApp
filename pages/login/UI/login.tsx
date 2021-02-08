import { Button, Container, Grid, Link, Typography } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import AddCircleOutlineSharpIcon from '@material-ui/icons/AddCircleOutlineSharp';

const LoginUi: FunctionComponent = () => {

  const FormLogin = () => {
    return (
        <Grid item xs={9} className='form-login'>
            <Typography className='from-header' component='h5' variant='subtitle1' align='right' >
                Don't have an account?
                <Link className='link-header'> Get started</Link>
            </Typography>
            <Grid item xs={4} className='login-contain'>
                <div className='context'>
                    <Typography className='title-contain' component='h3' variant='h4' align='left' color='textPrimary'>
                        Sign to Minimal</Typography>
                    <Typography className='description-contain' align='left'>
                        Enter your details below</Typography>
                </div>
                <div className='btn'>
                    <Button className='btn-gg' color='inherit' size='medium'>
                        <AddCircleOutlineSharpIcon />
                    </Button>
                </div>
            </Grid>
        </Grid>
    );
  };

  const ImgLogin = () => {
    return (
          <Grid item xs={3} className='img-login'>
              <Container className='logo'>
                <Link className='link-logo'><img alt='logo' className='logo-img' src='../logo_single.svg' /></Link>
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
      <main>
          <Container maxWidth='xl' className='root login'>
            <div className='login-container'>
                <ImgLogin/>
                <FormLogin/>
            </div>
          </Container>
      </main>
  );
};

export default LoginUi;
