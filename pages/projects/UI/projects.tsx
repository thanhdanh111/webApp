import React, { FunctionComponent, useEffect } from 'react';
// import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import UserAvatar from '@components/user_avatar/info_user';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/reducers_registration';
import { Typography } from '@material-ui/core';
import ProjectsPageUI from 'pages/projects/UI/project';
import { getProjectDataMiddleWare } from '../logic/projects_reducer';
import { useRouter } from 'next/router';
import PrimaryButtonUI from '@components/primary_button/primary_button';

const Projects: FunctionComponent = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.userProfile);
  const project = useSelector((state: RootState) => state.projects);
  const listProjects = project.projects;
  const router = useRouter();
  const pathname = router.pathname;

  useEffect(() => {
    return void fetchDataProject();
  }, []);

  const fetchDataProject = () => {
    dispatch(getProjectDataMiddleWare());
  };

  const NameTeam = () => {

    const userName = `${user?.firstName} ${user?.lastName}`;

    return (
      <div className='display-name'>
        <Typography className='name-username' component='h5' variant='h6'>#{userName}</Typography>
      </div>
    );
  };

  const onPushToPage = (url: string) => {

    void router.push(`${pathname}/${url}`);
  };

  return (
    <div>
      <div className='projects'>
      <h1 className='text-projects'>Project</h1>
      <PrimaryButtonUI title='Create Project' handleClick={() => onPushToPage('create')}/>
      </div>
      <div className='team-section-wrapper'>
        <div className='team-title-bar'>
          <h1 className='page-heading-team-name'>
            <a className='team-link'>
              <div className='wrapper'>
                <UserAvatar alt='user icon' style='style-avatar' user={user}/>
                <NameTeam />
              </div>
            </a>
          </h1>
        </div>
        {Array.isArray(listProjects) && listProjects.map((item) => {
          return (
            <ProjectsPageUI key={item._id} project={item}/>
          );
        })}
      </div>
    </div>
  );

};

export default Projects;
