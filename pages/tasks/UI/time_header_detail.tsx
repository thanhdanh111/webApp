import { Box, Tooltip } from '@material-ui/core';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import EventAvailableOutlinedIcon from '@material-ui/icons/EventAvailableOutlined';

const TimeDetail: React.FC = () => {
  return (
    <Box className='detail-time'>
      <Tooltip title='Created by Phạm Thị Yến on Jul 3, 4:33 pm Updated on Jul 7, 6:38 pm'>
        <Box className='item-time detail-created-time'>
          <p className='text-time'>CREATED</p>
          <p className='text-time'>jul 3, 4:33 pm</p>
        </Box>
      </Tooltip>
      <Box className='item-time detail-tracked'>
        <p className='text-time'>TIME TRACKED</p>
        <p className='text-time'>
          <PlayCircleOutlineIcon className='tracked-icon'/>
        </p>
      </Box>
      <Box className='item-time detail-due-date'>
        <EventAvailableOutlinedIcon className='border-dashed-icon due-date'/>
      </Box>
    </Box>
  );
};

export default TimeDetail;
