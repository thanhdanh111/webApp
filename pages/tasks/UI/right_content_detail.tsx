import { Box } from '@material-ui/core'

const RightContentDetail: React.FC = ({ children }) => {
  return (
    <Box style={{ height: 'calc(100% + 60px)', display: 'flex', flexDirection: 'column' }}>
      {children}
    </Box>
  )
}
export default RightContentDetail
