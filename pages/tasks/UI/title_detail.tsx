import { Box, TextareaAutosize } from '@material-ui/core';
import AttachmentInBody from './attachment_detail';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import TagTask from '../../../components/tag/tag';
import { updateTaskThunkAction } from 'pages/task_boards/logic/task_boards_reducer';

const TitleDetail: React.FC = () => {
  const dispatch = useDispatch();
  const task = useSelector((state: RootStateOrAny) => state.taskBoards?.taskDetail);

  const updateTask = (tags) => {
    const tagIDs = tags.map((tag) => tag._id);
    dispatch(updateTaskThunkAction(task?._id, { tagIDs }));
  };

  return (
    <Box display='flex' flexDirection='column' className='attachment-detail'>
      <TagTask selectedTag={task.tagIDs} getSelectedTag={(tags) => updateTask(tags)}/>
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
