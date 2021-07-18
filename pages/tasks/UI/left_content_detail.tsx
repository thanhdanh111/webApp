import { Box } from '@material-ui/core'

const LeftContentDetail: React.FC = ({ children }) => {
  return (
    <Box height='100%' display='flex' flexDirection='column' className='left-content'>
      {children}
    </Box>
  )
}
export default LeftContentDetail
