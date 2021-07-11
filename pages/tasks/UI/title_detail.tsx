import { Box, TextareaAutosize } from '@material-ui/core';
import AttachmentInBody from './attachment_detail';
import { RootStateOrAny, useSelector } from 'react-redux';
import TagTask from '../../../components/tag/tag';

const TitleDetail: React.FC = () => {
  const task = useSelector((state: RootStateOrAny) => state.taskBoards?.taskDetail);

  return (
    <Box display='flex' flexDirection='column' className='attachment-detail'>
      <TagTask/>
      <Box position='sticky' top='0' className='title-detail' px={2} mt={1}>
        <TextareaAutosize
          className='input-title'
          rowsMin={1}
          rowsMax={5}
          value={task?.title}
        />
      </Box>
      <Box pb={2} px={2} className='title-detail'>
        <TextareaAutosize
          className='input-title input-description'
          rowsMin={10}
          placeholder="Description or type '/' for commands"
          value={task?.description}
        />
      </Box>
      <AttachmentInBody />
    </Box>
  );
};

export default TitleDetail;
