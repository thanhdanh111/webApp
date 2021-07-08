import { Box, Button } from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import AssignUser from './assign_user';
import OutlinedFlagIcon from '@material-ui/icons/OutlinedFlag';
import DoneIcon from '@material-ui/icons/Done';

const StatusDetail = () => {
  return (
    <Box display='flex' alignItems='center' alignContent='center' py='15px' pl={4} className='status-modal'>
      <Box display='flex' height='30px' className='status-detail'>
        <button className='btn-status'>STATUS</button>
        <button className='btn-status'><ArrowRightIcon/></button>
      </Box>
      <Button variant='outlined' color='primary' className='btn-detail done-detail'>
         <DoneIcon className='icon-detail done-icon'/>
      </Button>
      <AssignUser/>
      <Box className='priority-detail' display='flex' alignItems='center'>
        <OutlinedFlagIcon className='tag-border priority-icon'/>
      </Box>
    </Box>
  );
};

export default StatusDetail;
