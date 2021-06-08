import { TaskFilteringState } from './task_filtering_reducer';

export enum TaskFilteringTypes {
  setTaskFiltering = 'setTaskFiltering',
}

export const setTaskFiltering = (data: TaskFilteringState) => {
  return {
    data,
    type: TaskFilteringTypes.setTaskFiltering,
  };
};
