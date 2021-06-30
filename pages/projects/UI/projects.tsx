import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/reducers_registration';
import { Typography } from '@material-ui/core';
import { getProjectDataMiddleWare } from '../logic/projects_reducer';
import { useRouter } from 'next/router';
import PrimaryButtonUI from '@components/primary_button/primary_button';
import ProjectPageUI from 'pages/projects/UI/project';
import { UserInfoType } from 'helpers/type';
import { checkValidAccess } from 'helpers/check_valid_access';
import { Roles } from 'constants/roles';

const validAccesses = [Roles.COMPANY_MANAGER, Roles.DEPARTMENT_MANAGER];

const Projects: FunctionComponent = () => {
  const dispatch = useDispatch();
  const project = useSelector((state: RootState) => state.projects);
  const listProjects = project.projects;
  const router = useRouter();
  const pathname = router.pathname;
  const {
    isAdmin,
    rolesInCompany,
    currentCompany,
  }: UserInfoType =  useSelector((state: RootState) => state?.userInfo);
  const loadMemberData = isAdmin || checkValidAccess({ rolesInCompany, validAccesses });
  const companyName = currentCompany?.name;

  useEffect(() => {
    return void fetchDataProject();
  }, []);

  const fetchDataProject = () => {
    dispatch(getProjectDataMiddleWare());
  };

  const onPushToPage = (url: string) => {
    if (!loadMemberData) {
      return;
    }
    void router.push(`${pathname}/${url}`);
  };

  return (
      <div className='projects'>
        <h1 className='text-projects'>Project</h1>
        <div className='btn-create-project'>
          <PrimaryButtonUI
            title='Create Project'
            handleClick={() => onPushToPage('create')}
            extendClass={(!loadMemberData) ? 'hide-btn-send' : ''}
          />
        </div>
        <div className='team-section-wrapper'>
          <div className='team-title-bar'>
            <h1 className='page-heading-team-name'>
              <a className='team-link'>
                <div className='wrapper'>
                  <div className='display-name'>
                    <Typography className='name-username' component='h5' variant='h6'>#{companyName}</Typography>
                  </div>
                </div>
              </a>
            </h1>
          </div>
          <div className='project-card-all'>
            {Array.isArray(listProjects) && listProjects.map((item) => {
              return (
                <ProjectPageUI key={item._id} project={item}/>
              );
            })}
          </div>
        </div>
      </div>
  );
};

export default Projects;
