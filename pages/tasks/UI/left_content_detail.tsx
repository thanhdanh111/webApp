import { Box } from '@material-ui/core';
import StatusDetail from './status_header_detail';
import TitleDetail from './title_detail';

const LeftContentDetail: React.FC = () => {
  return (
    <Box height='100%' display='flex' flexDirection='column' className='left-content'>
      <StatusDetail/>
      <Box className='main-content-detail' height='100%'>
      <TitleDetail/>
      </Box>
    </Box>
  );
};
export default LeftContentDetail;
