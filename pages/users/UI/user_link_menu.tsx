import { Container, Typography } from '@material-ui/core';
import React from 'react';

const UserLinkMenu = () => {
  return (
            <div className='header-list'>
                <Typography className='title-list' component='h3' variant='h4' align='left' color='textPrimary'>
                    User List
                </Typography>
                <Container className='link-list'>
                    <ul className='link-list-ul'>
                        <li className='link-item item-first'>
                            <div className='item'>
                                <a href='/home' className='link'>Home</a>
                            </div>
                        </li>
                        <li className='link-item'>
                            <div className='item'>
                                <a href='/manager' className='link'>Management</a>
                            </div>
                        </li>
                        <li className='link-item'>
                            <div className='item'>
                                <a href='/user' className='link'>User</a>
                            </div>
                        </li>
                        <li className='link-item'>
                            <div className='item'>
                                <a href='/users' className='link'>List</a>
                            </div>
                        </li>
                    </ul>
                </Container>
            </div>
  );
};

export default(UserLinkMenu);
