import SelectOption from '@components/option_select/option_select';
import PrimaryButtonUI from '@components/primary_button/primary_button';
import { Avatar } from '@material-ui/core';
import { ProjectsPage } from 'helpers/type';
import { useRouter } from 'next/router';
import { useSnackbar, WithSnackbarProps } from 'notistack';
import { returnNotification } from 'pages/projects/logic/error_notifications';
import { setSelectedChannelID, updateChannelIDProject } from 'pages/projects/logic/projects_actions';
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
    channelIDResultInfo,
    shouldShowDescription,
  }: ProjectsPage = useSelector((state: RootState) => state.projects);
  const showDescription = shouldShowDescription ? 'show-description' : 'hide-description';

  const companyID = selectedProject?.companyID;

  const query = router.query;

  const { enqueueSnackbar }: WithSnackbarProps = useSnackbar();

  useEffect(() => {
    void fetchData();
  }, [companyID]);

  const fetchData = async() => {
    await Promise.all([
      dispatch(getProjectDetailData(query.id)),
      dispatch(setSelectedChannelID(selectedProject?.channelID)),
      dispatch(getExtendedCompaniesMiddelWare(selectedProject?.companyID)),
    ]);
  };

  const char = selectedProject?.name?.charAt(0);

  useEffect(() => {
    if (channelIDResultInfo?.type) {
      pushNotification();
    }

    return;
  }, [channelIDResultInfo]);

  const changeChannelID = (event) => {
    if (event.target.value === selectedChannelID) {
      return;
    }
    dispatch(setSelectedChannelID(event.target.value));
  };

  function updateBtn(dataUpdate) {

    dispatch(updateChannelIDMiddeleWare(selectedProject._id, dataUpdate));

  }

  function pushNotification() {
    const newResultInfo = returnNotification({ resultInfo: channelIDResultInfo });
    if (newResultInfo) {
      enqueueSnackbar(newResultInfo['message'], { variant: newResultInfo['status'] });
    }

    dispatch(updateChannelIDProject({ channelIDResultInfo: {} }));

    return;
  }

  return (
    <div className='detail-project'>
      <div className='name-team'>
        <a className='title-project'>
          <Avatar className='avt-title'>{char}</Avatar>
          <div className='name-project' >{selectedProject.name}</div>
        </a>
      </div>
      <div className={`description ${showDescription}`}>
        <div className='title-des'>
          Description
        </div>
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
              handleChange={changeChannelID}
            />
          </div>
        </div>
        <PrimaryButtonUI
          handleClick={() => updateBtn(selectedChannelID)}
          title='Update'
        />
      </div>
    </div>
  );
};

export default (ProjectDetail);
