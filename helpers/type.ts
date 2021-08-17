import { VariantType } from 'notistack'
import { Roles } from 'constants/roles'

export type Token = string | null

enum Arrow {
  OUT_LINE = 'OUT_LINE',
}

enum BoardStatus{
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
}
export interface HeadCell {
  disablePadding?: boolean
  id: string
  label: string
  numeric?: boolean
}
export interface User {
  _id: string
  firstName?: string
  lastName?: string
  profilePhoto?: string
  gender?: string
  address?: string
  phoneNumber?: string
  email?: string
  facebookID?: string
  googleID?: string
  status?: string
  fullName?: string
}

export interface Company {
  companyID?: string
  _id?: string
  photos?: string []
  description?: string
  emails?: string []
  phoneNumbers?: string []
  address?: string
  name?: string
  departments?: Department[]
}

export interface Department {
  departmentID?: string
  name?: string
}

export interface Data {
  id: string
  user: UserAccess
  userName: string
  companyRole: string
  departmentRoles: Access[]
  stringPendingRoles: string[]
  companyRoleCouldDelete?: boolean
  companyRoleRender?: string
}

export interface Access {
  _id: string
  role: string
  status: string
  companyID?: Company | string
  departmentID?: Department | string
  departmentName?: string
  canRemoveFromDepartment?: boolean
}

export interface EditingUserData {
  accesses?: Access[]
  companyID?: Company
  companyIDAndUserID?: string
  departmentID?: Department[]
  userID?: User
  _id?: object
}

export interface EditingUserInfo {
  userData?: EditingUserData
  userIndex?: number
  removeUserFrom?: string
  editingDepartment?: object
  editingCompany?: object
  userName?: string
}

export interface NotificationTypeState {
  _id: string
  body: string
  clickAction: string
  isRead: boolean
  targetEntityName: string
  event: string
  title: string
  createdAt: string
  createdBy?: Profile
  receiverUID: string
  companyID: string
  targetID: string
}

export interface UserAccess {
  _id: string
  userID: User
  accesses: Access[]
  departmentID: Department[]
}

export interface NotificationsData {
  cursor: string
  list: NotificationTypeState[]
  totalCount: number
  totalUnread: number
}

export interface UsersData {
  cursor: string
  list: Data[]
  listSearch: Data[]
  notifications: NotificationsData
  hasNoData: boolean
  totalCount: number
  loadingList: boolean
  status: string
  userLimit: number
  notificationLimit: number
  selectNotification: NotificationTypeState
  editingUserInfo: EditingUserInfo
  onRemovingUser: boolean
  isLoading: boolean
}

export interface ParamGetUser {
  companyID: string
  limit?: number
  cursor?: string
  fullName?: string
}

export interface MenuItem {
  style: string
  handleClick: () => void
  element: JSX.Element | string
}

export interface Task {
  _id: string
  companyID?: Company
  departmentID?: Department
  taskStatusID: TaskStatus
  tagIDs?: Tag[] | string[]
  userIDs?: User[]
  title: string
  description?: string
  attachments?: string[]
  dueDate?: string
  estimateDate?: string
  timeTracked?: string
  priority?: string
  logs?: string[]
  startDate?: string
}

export interface TaskStatus {
  _id: string
  companyID?: string
  departmentID?: string
  taskBoardID: string
  title: string
  taskIDs: string[]
  description?: string
  createdBy?: User
}

export interface CheckInCheckOut {
  checkInAt?: string
  checkOutAt?: string
  description?: string
  _id: string
  userID?: User
  companyID?: Company
}

export interface Profile {
  firstName?: string
  lastName?: string
  email?: string
  profilePhoto?: string
  status?: string
}

interface ExtendedProfile {
  _id?: string
  gender?: string
  userID?: string
}

interface ApiKey {
  description: string
  createdAt: string
  key: string
  companyID: string
}

interface ExtendedCompany {
  companyID?: Company
  slackToken?: string
  createdBy?: string
  createdAt?: string
  updatedAt?: string
  apiKey?: ApiKey
}

export interface RolesInDepartments {
  [departmentID: string]: Roles[]
}

export interface UserInfo {
  token: string
  userID: string
  access: Access[]
  profile: Profile
  extendedProfile: ExtendedProfile
  currentCompany: Company
  currentExtendedCompany: ExtendedCompany
  currentDepartment: Department
  rolesInDepartments: RolesInDepartments
  rolesInCompany: Roles[]
  isAdmin: boolean
}

export type UserInfoType = UserInfo

export interface Notification {
  variant: VariantType
  message: string
}

export interface Channel {
  _id: string
  name: string
}

export interface ProjectsPage {
  projects: ProjectState[]
  selectedProject: ProjectState
  selectedChannelID: string
  channels: Channel[]
  shouldShowDescription: boolean
}
export interface ProjectState {
  _id: string
  name: string
  companyID?: string
  eventExpirationTime?: string
  description?: string
  departmentID?: string
  channelID?: string
  totalEventLogs: number
}

export interface ChannelIDData {
  _id: string
  channelID: string
}

export interface Board {
  _id: string
  companyID?: string
  departmentID?: string
  projectID?: string
  name:	string
  status?: BoardStatus

}

export interface BoardsPage {
  boards: Board[]
  selectedBoard: Board
  loading: boolean
  hasNoBoards: boolean
}

export interface ConnectToData {
  cardID: string
  text: string
  arrow: Arrow
}

export interface CardPositionData {
  x: number
  y: number
}

export interface Card {
  _id: string
  boardID: string | Board
  companyID?: string
  departmentID?: string
  shape: string
  image?: string
  textContent?: string
  border?: string
  background?: string
  leftTo?: ConnectToData
  rightTo?: ConnectToData
  bottomTo?: ConnectToData
  topTo?: ConnectToData
  position?: 	CardPositionData
}

export interface CardsPage {
  cards: Cards
}

export interface Cards {
  [key: string] : Card
}

export interface Tag {
  _id?: string
  name: string
  companyID?: string
  departmentID?: string
  color?: string
}

interface UpdateTaskData {
  taskStatusId?: string
  title?: string
  description?: string
  dueDate?: string
  priority?: string
  tags?: Tag[]
  createdBy?: string
  createdAt?: Date
  isHover?: boolean
}

export interface UpdateTaskToTaskStatus {
  taskId: string
  taskStatusId: string
  data: UpdateTaskData
}
export interface SetTasksToTaskStatus {
  taskStatusId: string
  tasks: Task[]
}
export interface TaskBoard {
  _id: string
  companyID?: Company | string
  departmentID?: Department | string
  taskStatusIDs?: TaskStatus[]
  title: string
  description?: string
  updatedBy?: User
  createdBy?: User | string
}
