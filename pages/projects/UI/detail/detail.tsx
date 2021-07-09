import SelectOption from '@components/option_select/option_select';
import PrimaryButtonUI from '@components/primary_button/primary_button';
import { Avatar, Box } from '@material-ui/core';
import { Roles } from 'constants/roles';
import { checkValidAccess } from 'helpers/check_valid_access';
import { UserInfoType, ProjectsPage } from 'helpers/type';
import { useRouter } from 'next/router';
import { setSelectedChannelID } from 'pages/projects/logic/projects_actions';
import { getExtendedCompaniesMiddleWare, getProjectDetailData, updateChannelIDMiddleWare } from 'pages/projects/logic/projects_reducer';
import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/reducers_registration';

const validAccesses = [Roles.COMPANY_MANAGER, Roles.DEPARTMENT_MANAGER];

const ProjectDetail: FunctionComponent = () => {

  const router = useRouter();
  const dispatch = useDispatch();
  const {
    selectedProject,
    selectedChannelID,
    channels,
    shouldShowDescription,
  }: ProjectsPage = useSelector((state: RootState) => state.projects);
  const showDescription = shouldShowDescription ? 'show-description' : 'hide-description';
  const channelID = selectedProject?.channelID;

  const query = router.query;
  const {
    isAdmin,
    rolesInCompany,
  }: UserInfoType =  useSelector((state: RootState) => state?.userInfo);
  const loadMemberData = isAdmin || checkValidAccess({ rolesInCompany, validAccesses });

  useEffect(() => {
    void fetchData();
  }, [channelID]);

  const fetchData = async() => {
    await Promise.all([
      dispatch(getProjectDetailData(query.id)),
      dispatch(setSelectedChannelID(selectedProject?.channelID)),
      dispatch(getExtendedCompaniesMiddleWare()),
    ]);
  };

  const char = selectedProject?.name?.charAt(0);

  const changeChannelID = (event) => {
    if (event.target.value === selectedChannelID) {
      return;
    }
    dispatch(setSelectedChannelID(event.target.value));
  };

  function updateBtn(dataUpdate) {
    if (!loadMemberData) {
      return;
    }
    dispatch(updateChannelIDMiddleWare(selectedProject._id, dataUpdate));
  }

  return (
    <Box className='detail-project'>
      <div className='all-title-project'>
        <a className='title-project'>
          <Avatar className='avt-title'>{char}</Avatar>
          <div className='name-project' >{selectedProject.name}</div>
        </a>
      </div>
      <div className={`description ${showDescription}`}>
        Description
        <div className='detail-des'>{selectedProject.description}</div>
      </div>
      <div className='detail-project-form'>
        <div className='form-label'>
          Choose which channel to send notifications
        </div>
        <div className='project-name-input'>
          <div className='form-select'>
            <SelectOption
              list={channels}
              value={selectedChannelID}
              required={!selectedChannelID}
              handleChange={changeChannelID}
              disabled={(!loadMemberData) ? true : false}
            />
          </div>
        </div>
      </div>
      <div className='btn'>
        <PrimaryButtonUI
          handleClick={() => updateBtn(selectedChannelID)}
          title='Update'
          extendClass={(!loadMemberData) ? 'hide-btn-send' : ''}
        />
      </div>
    </Box>
  );
};

export default (ProjectDetail);
