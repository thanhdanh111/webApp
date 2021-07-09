export interface InviteValue {
  inviteMembers: InviteMemberInfo[];
  loading: boolean;
  inviteLoading: boolean;
  departments: InviteDepartmentInfo[];
}

export interface InviteDepartmentInfo {
  departmentID?: string;
  name: string;
}

export interface InviteMemberInfo {
  role: string;
  departmentID?: string;
  email: string;
}

export interface AvailInviteCompanies {
  companyID: string;
  name: string;
  departments: InviteDepartmentInfo[];
}

export type InviteStateProps = InviteValue;
