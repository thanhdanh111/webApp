import { Backdrop, Box, Modal } from '@material-ui/core'
import React from 'react'
import LogDetail from './activity_detail'
import LeftContentDetail from './left_content_detail'
import RightContentDetail from './right_content_detail'
import StatusDetail from './status_header_detail'
import TaskDetail from './task_detail'
import TimeDetail from './time_header_detail'
import TitleDetail from './title_detail'

export const ModalTaskDetail = ({ open, handleClose }) => {

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
      className='detail-modal'
    >
        <TaskDetail close={handleClose}>
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
