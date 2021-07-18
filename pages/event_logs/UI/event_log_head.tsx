import React, { FunctionComponent } from 'react'
import EventNoteIcon from '@material-ui/icons/EventNote'
import SelectOption from '@components/option_select/option_select'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'redux/reducers_registration'
import { EventLogPage } from '../logic/event_log_interface'
import { setSelectedEnv, setSelectedProjectID, setSelectedTime } from '../logic/event_log_action'
import { ProjectState } from '../logic/project_interface'

const projects: ProjectState[] = [
  {
    departmentID: '',
    description: '',
    channelID: 'G01HPG7H8JX',
    eventExpirationTime: '604800000',
    _id: '607a92bb6c7a3a0008bf937b',
    companyID: '607a8ca4acf0ef00083d009b',
    name: 'Snt-internal-Apis',
  },
]

const timeRange = [
  {
    _id: 'id_1',
    name: 'Last 24 hours',
    value: 1,
  },
  {
    _id: 'id_7',
    name: 'Last 7 days',
    value: 7,
  },
  {
    _id: 'id_14',
    name: 'Last 14 days',
    value: 14,
  },
  {
    _id: 'id_30',
    name: 'Last 30 days',
    value: 30,
  },
]

const EventLogHead: FunctionComponent = ({}) => {
  const dispatch = useDispatch()

  const {
    environments,
    selectedProjectID,
    selectedEnv,
    selectedTime,
  }: EventLogPage = useSelector((state: RootState) => state.eventLogs)

  const listEnvironment = Object.keys(environments).map((item) => {
    return {
      _id: item,
      name: item,
    }
  })

  const changeEnvironment = (event) => {
    if (event.target.value === selectedEnv) {
      return
    }
    dispatch(setSelectedEnv(event.target.value))
  }

  const changeProject = (event) => {
    if (event.target.value === selectedProjectID) {
      return
    }
    dispatch(setSelectedProjectID(event.target.value))
  }

  const changeTime = (event) => {
    if (event.target.value === selectedTime) {
      return
    }
    dispatch(setSelectedTime(event.target.value))
  }

  return (
    <div className='event-head'>
      <SelectOption
        iconLabel={<img className='icon-select img-icon' src='https://s1.sentry-cdn.com/_static/fece22aae5a4f36c7188881abea5cdfe/sentry/dist/svg/nodejs.4f4dd9.svg' />}
        list={projects}
        value={selectedProjectID}
        handleChange={changeProject}
      />
      <SelectOption
        iconLabel={<EventNoteIcon className='icon-select icon-environment' />}
        list={listEnvironment}
        value={selectedEnv}
        handleChange={changeEnvironment}
        style='option-center'
      />
      <SelectOption
        iconLabel={<EventNoteIcon className='icon-select icon-time' />}
        list={timeRange}
        value={selectedTime}
        handleChange={changeTime}
      />
    </div>
  )
}

export default EventLogHead
