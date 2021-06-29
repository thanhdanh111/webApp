import { VariantType } from 'notistack';
import { Roles } from 'constants/roles';

export type Token = string | null;

enum Arrow {
  OUT_LINE = 'OUT_LINE',
}

enum Shape {
  PROCESS = 'PROCESS',
  DECISION = 'DECISION',
}
enum BoardStatus{
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
}
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
  _id?: string;
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
  firstName?: string;
  lastName?: string;
  email?: string;
  profilePhoto?: string;
  status?: string;
}

interface ExtendedProfile {
  _id?: string;
  gender?: string;
  userID?: string;
}

interface ApiKey {
  description: string;
  createdAt: string;
  key: string;
  companyID: string;
}

interface ExtendedCompany {
  companyID?: Company;
  slackToken?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  apiKey?: ApiKey;
}

export interface RolesInDepartments {
  [departmentID: string]: Roles[];
}

export interface UserInfo {
  token: string;
  userID: string;
  access: Access[];
  profile: Profile;
  extendedProfile: ExtendedProfile;
  currentCompany: Company;
  currentExtendedCompany: ExtendedCompany;
  currentDepartment: Department;
  rolesInDepartments: RolesInDepartments;
  rolesInCompany: Roles[];
  isAdmin: boolean;
}

export type UserInfoType = UserInfo;

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

export interface Board {
  _id: string;
  companyID?: string;
  departmentID?: string;
  projectID?: string;
  name:	string;
  status?: BoardStatus;

}

export interface BoardsPage {
  boards: Board[];
  selectedBoard: Board;
}

export interface ConnecToData {
  cardID: string;
  text: string;
  arrow: Arrow;
}

export interface Card {
  _id: string;
  boardID: string | Board;
  companyID?: string;
  departmentID?: string;
  shape: Shape;
  image?: string;
  textContent?: string;
  border?: string;
  background?: string;
  leftTo?: ConnecToData;
  rightTo?: ConnecToData;
  bottomTo?: ConnecToData;
  topTo?: ConnecToData;
  position?: string;
}
