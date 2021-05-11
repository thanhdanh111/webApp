import { ProjectState } from './project_interface';
​
export interface EventLogPage {
  projects: ProjectState[];
  environments: {};
  selectedProjectID: string;
  selectedEnv: string;
  selectedTime: number;
  sortByCreatedAt: string;
  selectedEventLog: EventLogState;
  eventLogs: EventLogState[];
  loading: boolean;
  hasNoEventLogs: boolean;
}

​
export interface EventLogState {
  _id: string;
  exception: ExceptionState;
  createdAt: string;
  breadcrumbs: BreadcrumbState[];
}
​
export interface BreadcrumbState {
  timestamp: string;
  category: string;
  level: string;
  message: string;
}
​
export interface ExceptionState {
  stacktrace?: StacktraceState;
  type: string;
  value: string;
  mechanism?: MechanismState;
}
​
export interface MechanismState {
  handled: boolean;
  type: string;
}
​
export interface StacktraceState {
  frames: StacktraceFrame[];
}
​
export interface StacktraceFrame {
  colno: number | null;
  filename: string;
  function: string;
  lineno: number | null;
  in_app: boolean;
  module?: string;
  pre_context?: string[];
  context_line?: string;
  post_context?: string[];
}
