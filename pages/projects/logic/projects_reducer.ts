import axios from 'axios';
import { config } from 'helpers/get_config';
import { ProjectsPage } from 'helpers/type';
import { getProjectAction } from './projects_actions';
import { projectsActionType } from './projects_type_action';

const initialState: ProjectsPage = {
  projects: [],
  selectedProject: {
    _id: '',
    name: '',
    companyID: '',
    eventExpirationTime: '',
    description: '',
    channelID: '',
    totalEventLogs: 0,
  },
};

export const projectsReducer = (state = initialState, action) => {
  switch (action.type) {
    case projectsActionType.GET_LIST_PROJECTS:
      return {
        ...state,
        projects: action.payload.list,
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
