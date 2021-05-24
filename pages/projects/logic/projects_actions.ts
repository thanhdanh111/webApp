import { projectsActionType } from './projects_type_action';

export const getProjectAction = (res: object) => {
  return {
    type: projectsActionType.GET_LIST_PROJECTS,
    payload: res,
  };
};

export const getProject = (res: object) => {
  return {
    type: projectsActionType.GET_PROJECT,
    payload: res,
  };
};

export const setSelectedChannelID = (res) => {
  return {
    type: projectsActionType.SET_SELECTED_CHANNEL_ID,
    payload: {
      selectedChannelID: res,
    },
  };
};

export const updateChannelIDProject = ({ channelIDResultInfo }) => {
  return {
    channelIDResultInfo,
    type: projectsActionType.UPDATE_CHANNEL_ID,
  };
};

export const getChannelsByCompany = (res) => {
  return {
    type: projectsActionType.GET_CHANNELS_BY_COMPANY,
    payload: res,
  };
};

export const shouldShowDescription = (res: boolean) => {
  return {
    type: projectsActionType.SHOULD_SHOW_DESCRIPTION,
    payload: res,
  };
};
