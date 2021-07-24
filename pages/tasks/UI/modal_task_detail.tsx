import { Backdrop, Box, Modal } from '@material-ui/core'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'redux/reducers_registration'
import { getTaskByID } from '../logic/task_action'
import { TaskType } from '../logic/task_reducer'
import LogDetail from './activity_detail'
import LeftContentDetail from './left_content_detail'
import RightContentDetail from './right_content_detail'
import StatusDetail from './status_header_detail'
import TaskDetail from './task_detail'
import TimeDetail from './time_header_detail'
import TitleDetail from './title_detail'

export const ModalTaskDetail = () => {
  const { currentTask } : TaskType =  useSelector((state: RootState) => state?.tasks)
  const dispatch = useDispatch()

  return (
    <Modal
      open={!!currentTask._id}
      onClose={() => dispatch(getTaskByID({ title: '', _id: '' }))}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
      className='detail-modal'
    >
        <TaskDetail close={() => dispatch(getTaskByID({ title: '', _id: '' }))}>
          <Box width={'50%'}>
            <LeftContentDetail>
              <StatusDetail/>
              <Box className='main-content-detail' height='100%'>
                <TitleDetail/>
              </Box>
            </LeftContentDetail>
          </Box>
          <Box  width={'50%'}>
            <RightContentDetail>
              <TimeDetail/>
              <LogDetail/>
            </RightContentDetail>
          </Box>
        </TaskDetail>
    </Modal>
  )
}
