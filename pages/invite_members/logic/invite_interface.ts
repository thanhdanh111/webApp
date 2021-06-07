export interface InviteValue {
  inviteMembers: InviteMemberInfo[];
  inviteCompany: InviteCompany;
  currentPage: string;
  availInviteCompanies: AvailInviteCompanies[];
  inviteLoading: boolean;
  hasNoCompanies: boolean;
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

export interface InviteCompany {
  name: string;
  companyID: string;
  departments: InviteDepartmentInfo[];
}

export interface AvailInviteCompanies {
  companyID: string;
  name: string;
  departments: InviteDepartmentInfo[];
}

export type InviteStateProps = InviteValue;
