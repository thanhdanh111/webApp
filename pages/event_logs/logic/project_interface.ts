export interface ProjectsPage {
  projects: ProjectState[]
  selectedProject: ProjectState
}
  ​
export interface ProjectState {
  _id: string
  name: string
  companyID: string
  eventExpirationTime: string
  description?: string
  departmentID?: string
  channelID?: string
  totalEventLogs?: number
}
