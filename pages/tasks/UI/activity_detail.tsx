import { Box, IconButton, InputBase, Paper } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

const LogDetail: React.FC = () => {
  return (
    <Box>
      <Box className='content-activity' width={'50%'} m={'15px'}>
        <FilterActivity/>
        <ContentActivity/>
      </Box>
    </Box>
  );
};

export default LogDetail;

const FilterActivity = () => {
  return (
    <Box display='flex' alignItems='center' className='filter-activity'>
      <Paper component='div' className='search-activity'>
        <IconButton className='icon-activity' aria-label='search'>
          <SearchIcon className='search-icon-activity'/>
        </IconButton>
        <InputBase
          className='input-activity'
          placeholder='Search...'
        />
      </Paper>
      <PersonAddIcon/>
    </Box>
  );
};

const ContentActivity = () => {
  return (
    <Box>
      Box
    </Box>
  );
};
