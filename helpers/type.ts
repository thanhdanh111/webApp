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
  _id?: string;
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
  companyRole: string;
  departmentRoles: Access[];
  stringPendingRoles: string[];
  isCompanyManager?: boolean;
  companyRoleRender?: string;
}

export interface Access {
  _id: string;
  role: string;
  status: string;
  companyID?: Company | string;
  departmentID?: Department | string;
  departmentName?: string;
  canDelete?: boolean;
}

interface EditingUserData {
  accesses?: Access[];
  companyID?: Company;
  companyIDAndUserID?: string;
  departmentID?: Department[];
  userID?: User;
  _id?: object;
}

export interface EditingUserInfo {
  userData?: EditingUserData;
  userIndex?: number;
  removeUserFrom?: string;
  editingDepartment?: object;
  editingCompany?: object;
  userName?: string;
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
  departmentID: Department[];
}

export interface NotificationsData {
  cursor: string;
  list: NotificationTypeState[];
  totalCount: number;
  totalUnread: number;
}

export interface UsersData {
  cursor: string;
  list: Data[];
  listSearch: Data[];
  notifications: NotificationsData;
  hasNoData: boolean;
  totalCount: number;
  loadingList: boolean;
  status: string;
  userLimit: number;
  notificationLimit: number;
  selectNotification: NotificationTypeState;
  editingUserInfo: EditingUserInfo;
  onRemovingUser: boolean;
  isLoading: boolean;
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
  statusID?: string;
  companyID?: Company;
  departmentID?: Department;
  taskBoardID?: string;
  title?: string;
  taskIDs: Task[];
  description?: string;
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
