import { Box, Link } from '@material-ui/core'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'

const DirectNewTask: React.FC = () => {
  return (
    <Box
      position='absolute'
      bottom={0}
      top={0}
      right={-10}
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      fontSize={3}
      className='direct-add'
    >
      <Box className='box-direct'>
        <div>
          <Link className='actions-status'>
            <ArrowUpwardIcon className='icon-direct' fontSize='small' />
          </Link>
        </div>
        <div>
          <Link className='actions-status'>
            <ArrowDownwardIcon className='icon-direct' fontSize='small' />
          </Link>
        </div>
      </Box>
    </Box>
  )
}

export default DirectNewTask
