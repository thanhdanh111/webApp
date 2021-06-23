import { VariantType } from 'notistack';

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

export interface Company {
  companyID?: string;
  photos?: string [];
  description?: string;
  emails?: string [];
  phoneNumbers?: string [];
  address?: string;
  name?: string;
  departments?: Department[];
}

export interface Department {
  departmentID?: string;
  name?: string;
}

export interface Data {
  id: string;
  user: UserAccess;
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

export interface NotificationTypeState {
  _id: string;
  body: string;
  clickAction: string;
  isRead: boolean;
  targetEntityName: string;
  event: string;
  title: string;
  createdAt: string;
  createdBy?: Profile;
  receiverUID: string;
  companyID: string;
  targetID: string;
}

export interface UserAccess {
  _id: string;
  userID: User;
  accesses: Access[];
  departmentID: Department[] ;
}

export interface NotificationsData {
  cursor: string;
  list: NotificationTypeState[];
  totalCount: number;
  totalUnread: number;
}

export interface UsersData {
  cursor: string;
  list: UserAccess[];
  listSearch: UserAccess[];
  notifications: NotificationsData;
  hasNoData: boolean;
  totalCount: number;
  loadingList: boolean;
  status: string;
  userLimit: number;
  notificationLimit: number;
  selectNotification: NotificationTypeState;
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
  taskStatusID: TaskStatus;
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

export interface TaskStatus {
  _id: string;
  companyID?: Company | string;
  departmentID?: Department | string;
  taskBoardID: TaskBoard | string;
  title: string;
  taskIDs: Task[];
  description?: string;
  createdBy?: User | string;
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

interface ApiKey {
  description: string;
  createdAt: string;
  key: string;
  companyID: string;
}

interface ExtendedCompany {
  companyID: Company;
  slackToken: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  apiKey: ApiKey;
}

export interface LoginValue {
  value: string;
  userID: string;
  access: Access[] | [];
  userProfile: Profile | {};
  extendedUser: ExtendedUser | {};
  extendedCompany: ExtendedCompany | {};
  department: Department | {};
}

export interface Notification {
  variant: VariantType;
  message: string;
}

export interface Channel {
  _id: string;
  name: string;
}

export interface ProjectsPage {
  projects: ProjectState[];
  selectedProject: ProjectState;
  selectedChannelID: string;
  channels: Channel[];
  shouldShowDescription: boolean;
}
export interface ProjectState {
  _id: string;
  name: string;
  companyID?: string;
  eventExpirationTime?: string;
  description?: string;
  departmentID?: string;
  channelID?: string;
  totalEventLogs: number;
}

export interface ChannelIDData {
  _id: string;
  channelID: string;
}

export interface TaskBoard {
  _id: string;
  companyID?: Company | string;
  departmentID?: Department | string;
  taskStatusIDs?: string[];
  title: string;
  description?: string;
  updatedBy?: User ;
  createdBy?: User | string;
}
