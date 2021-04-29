import { Company, Department } from 'helpers/type';
import { VariantType } from 'notistack';

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

export interface TimeOffRequestValue {
  onRequest: boolean;
  onSendingRequest: boolean;
  companies: Company[];
  timeOffRequestNotifications: TimeOffNotification[];
  selectedCompany?: Company;
  selectedDepartment?: Department;
  reason: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

interface TimeOffNotification {
  message: string;
  variant: VariantType;
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

export type TimeOffRequestProps = TimeOffRequestValue;
