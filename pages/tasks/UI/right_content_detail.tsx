import { Box } from '@material-ui/core';
import LogDetail from './activity_detail';
import TimeDetail from './time_header_detail';

const RightContentDetail: React.FC = () => {
  return (
    <Box>
      <TimeDetail/>
      <LogDetail/>
    </Box>
  );
};
export default RightContentDetail;
