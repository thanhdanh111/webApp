import TabsUi from '@components/tabs/tabs'
import { Box } from '@material-ui/core'
import { useState } from 'react'
import SmsOutlinedIcon from '@material-ui/icons/SmsOutlined'
import VerticalSplitIcon from '@material-ui/icons/VerticalSplit'
import { RootStateOrAny, useSelector } from 'react-redux'

const typeLog = {
  CREATE : 'created this task',
  UPDATE :  {
    tagIDs : 'added',
    userIDs: 'assigned to',
    taskStatusID: 'changed status to',
    title: 'changed title to',
    priority: 'set priority',
    dueDate: 'set due date to',
    startDate: 'set due date to',
    timeTracked: 'tracked',
    startTime: 'set start time to',
  },
  DELETE : {
    userIDs: 'remove assignee',
  },
}

const LogDetail: React.FC = () => {
  // const task = useSelector((state: RootStateOrAny) => state.taskBoards?.taskDetail);
  const [currentTab, setCurrentTab] = useState(0)

  return (
    <Box>
      <Box className='content-activity' m={'15px'} alignItems='center'>
        <TabsUi
          tabs={['logs', 'comments']}
          tabIcons={[VerticalSplitIcon, SmsOutlinedIcon]}
          tabUIs={[ContentLogs, ContentComments]}
          currentTabIndex={currentTab}
          handleChange={(_: React.ChangeEvent<{}>, newValue: number) => setCurrentTab(newValue)}

        />
      </Box>
    </Box>
  )
}

export default LogDetail

const ContentLogs = () => {
  const task = useSelector((state: RootStateOrAny) => state.taskBoards?.taskDetail)

  const renderLogs = () => {
    const logs = task?.logs?.map((log) => {

      return (
        <Box key={log._id} className='content-log'>
            <span className='user-log'>You </span>
            {typeLog[log.action][log.changedField] || typeLog[log.action]}
            <span className='value-log'>{log.value}</span>
        </Box>
      )
    })

    return logs
  }

  return (
    <Box>
      {renderLogs()}
      <Box className='load-log'>Load more...</Box>
    </Box>
  )
}

const ContentComments = () => {
  return (
    <Box>
      Comment
    </Box>
  )
}
