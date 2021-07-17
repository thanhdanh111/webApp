import { Box, Button } from '@material-ui/core'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'
import FooterDetail from './footer_detail'
interface InitialProp {
  close: () => void
}
const TaskDetail: React.FC<InitialProp> = ({ close, children }) => {

  return (
    <Box className='collapse-content' style={{ width: '90%' }}>
      <div className='detail-content'>
        <Box display='flex' justifyContent='flex-end' p='10px' className='header-modal-detail'>
        <Button variant='outlined' color='primary' className='btn-detail close-detail' onClick={(close)}>
          <CloseOutlinedIcon className='icon-detail icon-close'/>
        </Button>
        </Box>
        <Box display='flex' justifyItems='center' height='calc(100% - 100px)'>
          {children}
        </Box>
        <FooterDetail/>
      </div>
    </Box>
  )
}

export default TaskDetail
