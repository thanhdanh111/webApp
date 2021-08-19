import { Box } from '@material-ui/core'
import { AttachmentInFooter } from './attachment_detail'

const FooterDetail: React.FC = () => {
  return(
    <Box display='flex' className='footer-detail-task' alignItems='center'>
      <AttachmentInFooter/>
    </Box>
  )
}

export default FooterDetail

export const CommentFooter: React.FC = () => {
  return (
    <Box width='50%'>
      Comment
    </Box>
  )
}
