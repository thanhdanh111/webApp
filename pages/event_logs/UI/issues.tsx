import { Checkbox, MenuItem } from '@material-ui/core'
import { checkIfEmptyArray } from 'helpers/check_if_empty_array'
import React, { FunctionComponent } from 'react'
import { EventLogState } from '../logic/event_log_interface'
import IssuesItem from './issues_item'
import { DisappearedLoading } from 'react-loadingg'

interface InitialProps {
  eventLogs: EventLogState[]
  loading: boolean
}

type IssuesType = InitialProps

const Issues: FunctionComponent<IssuesType> = (props: InitialProps) => {

  const { eventLogs, loading }: InitialProps = props

  const generateIssuesItem = (list: EventLogState[]) => {
    if (checkIfEmptyArray(list)) {
      const eventLogItems = list.map((event: EventLogState, index: number) => {
        return (
          <IssuesItem key={index} eventLog={event}/>
        )
      })

      return eventLogItems
    }

    return
  }

  return (
        <div className='issues'>
            <ul className='issues-list'>
                <MenuItem className='issus'>
                <Checkbox className='issus-check-top' />
                </MenuItem>
                {!loading && generateIssuesItem(eventLogs)}
                {loading && <DisappearedLoading color={'#67cb48'}/>}
            </ul>
        </div>
  )
}

export default Issues
