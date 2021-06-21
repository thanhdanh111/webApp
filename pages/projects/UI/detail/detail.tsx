import SelectOption from '@components/option_select/option_select';
import PrimaryButtonUI from '@components/primary_button/primary_button';
import { Avatar, Box } from '@material-ui/core';
import { getManagerIDs, GetManagerIDsType } from '../../../../helpers/get_manager_ids_of_departments_and_companies';
import { ProjectsPage } from 'helpers/type';
import { useRouter } from 'next/router';
import { setSelectedChannelID } from 'pages/projects/logic/projects_actions';
import { getExtendedCompaniesMiddelWare, getProjectDetailData, updateChannelIDMiddeleWare } from 'pages/projects/logic/projects_reducer';
import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/reducers_registration';

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
  const authState = useSelector((state: RootState) => state.auth);
  const {
    isAdmin,
    managerCompanyIDs,
    managerDepartmentIDs,
  }: GetManagerIDsType = getManagerIDs({ access: authState?.access });
  const loadMemberData = isAdmin || managerCompanyIDs?.length > 0 || managerDepartmentIDs?.length > 0;

  useEffect(() => {
    void fetchData();
  }, [channelID]);

  const fetchData = async() => {
    await Promise.all([
      dispatch(getProjectDetailData(query.id)),
      dispatch(setSelectedChannelID(selectedProject?.channelID)),
      dispatch(getExtendedCompaniesMiddelWare()),
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
    dispatch(updateChannelIDMiddeleWare(selectedProject._id, dataUpdate));
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
