export interface TimeOffValue {
  ownTimeOffs: TimeOffModel[];
  ownTimeOffsOffset: number;
  ownTimeOffsCursor: string;
  ownTimeOffsLoading: boolean;
  ownTimeOffsTotalCount: number;
  membersTimeOffs: TimeOffModel[];
  membersTimeOffsOffset: number;
  membersTimeOffsCursor: string;
  membersTimeOffsLoading: boolean;
  membersTimeOffsTotalCount: number;
  optionState: OptionState;
  updateStatusLoading: boolean;
  loadingIndex?: number;
  loadingOptionStateName?: string;
  notFoundAnyOwnTimeOffs: boolean;
  notFoundAnyMembersTimeOffs: boolean;
  onConfirm: boolean;
  onSelectTimeOffData: SelectedTimeOffData;
}

interface SelectedTimeOffData {
  timeOffID?: string;
  status?: string;
  timeOffIndex?: number;
  fieldName?: string;
}

export enum OptionState {
  me = 'me',
  members = 'member',
}

export type TimeOffValueType = TimeOffValue;

export interface TimeOffModel {
  id: string;
  companyName: string;
  departmentName: string;
  startTime: string;
  endTime: string;
  status: string;
  reason: string;
  name: string;
  isManager: boolean;
}

export type SelectedTimeOffDataType = SelectedTimeOffData;

export interface UpdateOnConfirmDialog {
  onConfirm?: boolean;
  onSelectTimeOffData?: SelectedTimeOffData;
}
