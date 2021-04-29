export type Token = string | null;

export interface HeadCell {
  disablePadding?: boolean;
  id: string;
  label: string;
  numeric?: boolean;
}
export interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  gender?: string;
  address?: string;
  phoneNumber?: string;
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
  companyID?: string | undefined;
  departmentID?: string | undefined;
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

export interface MenuItem {
  style: string;
  handleClick: () => void;
  element: JSX.Element | string;
}

export interface Task {
  _id: string;
  companyID: Company;
  departmentID: Department;
  taskStatusID: TaskStatusType;
  tagIDs: string[];
  userIDs: User[];
  title: string;
  description: string;
  attachments: string[];
  dueDate: string;
  estimateTime: string;
  timeTracked: string;
  priority: string;
  logs: string[];
}

export interface TaskStatusType {
  _id: string;
  statusID: string;
  companyID: Company;
  departmentID: Department;
  taskBoardID: string;
  title?: string;
  taskIDs: Task[];
  description: string;
}
export interface CheckInCheckOut {
  checkInAt?: string;
  checkOutAt?: string;
  description?: string;
  _id: string;
  userID?: User;
  companyID?: Company;
}

export interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto: string;
  status: string;
}

interface ExtendedUser {
  _id: string;
  gender: string;
  userID: string;
}

export interface LoginValue {
  value: string;
  userID: string;
  access: Access[] | [];
  userProfile: Profile | {};
  extendedUser: ExtendedUser | {};
}
