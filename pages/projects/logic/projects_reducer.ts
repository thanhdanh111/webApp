import axios from 'axios';
import { checkArray } from 'helpers/check_array';
import { config } from 'helpers/get_config';
import { ProjectsPage } from 'helpers/type';
import { getChannelsByCompany, getProject, getProjectAction, shouldShowDescription, updateChannelIDProject } from './projects_actions';
import { projectsActionType } from './projects_type_action';

const initialState: ProjectsPage = {
  projects: [],
  selectedProject: {
    _id: '',
    name: '',
    eventExpirationTime: '',
    description: '',
    channelID: '',
    totalEventLogs: 0,
  },
  selectedChannelID: '',
  channels: [],
  channelIDResultInfo: {},
  shouldShowDescription: false,
};

export const projectsReducer = (state = initialState, action) => {
  switch (action.type) {
    case projectsActionType.GET_LIST_PROJECTS:
      const channelIDs = {};

      if (checkArray(action.payload.list)) {
        action.payload.list.map((element) => {
          if (element.channelID) {
            channelIDs[element.channelID] = element.channelID;
          }

          return;
        });
      }

      return {
        ...state,
        channelIDs,
        projects: action.payload.list,
      };
    case projectsActionType.GET_PROJECT:
      const variable = action.payload?.project;
      const selectedProject = {
        _id: variable?._id,
        name: variable?.name,
        companyID: variable?.companyID?._id,
        eventExpirationTime: variable?.eventExpirationTime,
        description: variable?.description,
        channelID: variable?.channelID,
        totalEventLogs: variable?.totalEventLogs,
      };

      return {
        ...state,
        selectedProject,
      };
    case projectsActionType.GET_CHANNELS_BY_COMPANY:
      return {
        ...state,
        channels: action.payload,
      };
    case projectsActionType.SET_SELECTED_CHANNEL_ID:
      return {
        ...state,
        selectedChannelID: action.payload.selectedChannelID,
      };
    case projectsActionType.UPDATE_CHANNEL_ID:
      return {
        ...state,
        channelIDResultInfo: action.channelIDResultInfo,
        selectedProject: action.channelIDResultInfo,
      };
    case projectsActionType.SHOULD_SHOW_DESCRIPTION:
      return {
        ...state,
        shouldShowDescription: action.payload,
      };
    default:
      return state;
  }
};

export const getProjectDataMiddleWare = () => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');

    const res = await axios.get(`${config.BASE_URL}/projects`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    await dispatch(getProjectAction(res.data));
  } catch (error) {
    throw error;
  }
};

export const getProjectDetailData = (detailsProjectID) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');

    if (!detailsProjectID) {
      return;
    }

    const res = await axios.get(`${config.BASE_URL}/projects/${detailsProjectID}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (res?.data?.project?.description) {
      await dispatch(shouldShowDescription(true));
    }

    await dispatch(getProject(res.data));
  } catch (error) {
    throw error;
  }
};

export const updateChannelIDMiddeleWare = (projectID: string, channelID: string) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');

    if (!token || !channelID || !projectID) {
      return;
    }

    const res = await axios.put(`${config.BASE_URL}/projects/${projectID}`,
      {
        channelID,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
     );

    if (res.status !== 200) {
      throw {
        status: res.status,
        response: res,
      };
    }

    const succeessNotofication = {
      status: String(res?.data.status ?? ''),
      message: '',
      channelID: res?.data?.channelID,
      name: '',
      description: '',
      eventExpirationTime: '',
      type: 'succeed',
    };

    await dispatch(updateChannelIDProject({ channelIDResultInfo: succeessNotofication }));
  } catch (error) {
    const errorNotification = {
      status: String(error?.statusCode ?? ''),
      message: error?.response?.data?.message,
      channelID: '',
      name: '',
      description: '',
      eventExpirationTime: '',
      type: 'failed',
    };

    await dispatch(updateChannelIDProject({ channelIDResultInfo: errorNotification }));
  }
};

export const getExtendedCompaniesMiddelWare = (companyID) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');

    if (!token || !companyID) {
      return;
    }

    const res = await axios.get(`${config.BASE_URL}/extendedCompanies/${companyID}/slack`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (checkArray(res.data.channels)) {
      const channels = res.data.channels.map((channel) => {
        return {
          _id: channel.id,
          name: channel.name,
        };
      });

      await dispatch(getChannelsByCompany(channels));
    }

    return;
  } catch (error) {
    throw error;
  }
};
