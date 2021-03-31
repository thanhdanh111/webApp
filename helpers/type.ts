export interface HeadCell {
  disablePadding?: boolean;
  id: string;
  label: string;
  numeric?: boolean;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  gender?: string;
  address: string;
  phoneNumber: string;
  email: string;
  facebookID?: string;
  googleID?: string;
  status?: string;
}

interface Company {
  name: string;
  photos?: string [];
  description?: string;
  emails?: string [];
  phoneNumbers?: string [];
  address?: string;
}

export interface Department {
  companyID: Company;
  name: string;
  photos?: string[];
  description?: string;
  emails?: string[];
  phoneNumbers?: string[];
  address?: string;
}

export interface Data {
  id: string;
  userName: string;
  departments: string[];
  activeRoles: string[];
  pendingRoles: string[];
}

export interface Access {
  _id: string;
  role: string;
  status: string;
}

export interface UserAccess {
  _id: string;
  userID: User;
  accesses: Access[];
  departmentID: Department[] ;
}

export interface UsersData {
  cursor: string;
  list: UserAccess[];
  listSearch: UserAccess[];
  totalCount: number;
  loadingList: boolean;
  status: string;
  limit: number;
}

export interface ParamGetUser {
  companyID: string;
  limit?: number;
  cursor?: string;
  fullName?: string;
}

export interface CheckInCheckOut {
  checkInAt?: string;
  checkOutAt?: string;
  description?: string;
  id: string;
  userID?: User;
  companyID?: string;
}
