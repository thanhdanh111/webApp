import { projectsActionType } from './projects_type_action';

export const getProjectAction = (res: object) => {
  return {
    type: projectsActionType.GET_LIST_PROJECTS,
    payload: res,
  };
};
