import { Box, TextareaAutosize } from '@material-ui/core'
import AttachmentInBody from './attachment_detail'
import { RootStateOrAny, useSelector } from 'react-redux'
import TagTask from '../../../pages/tag_tasks/UI/tag'
import { TaskType } from '../logic/task_reducer'

const TitleDetail: React.FC = () => {
  const { currentTask }: TaskType = useSelector((state: RootStateOrAny) => state.tasks)

  return (
    <Box display='flex' flexDirection='column' className='attachment-detail'>
      <TagTask/>
      <Box position='sticky' top='0' className='title-detail' px={2} mt={1}>
        <TextareaAutosize
          className='input-title'
          rowsMin={1}
          rowsMax={5}
          value={currentTask?.title}
        />
      </Box>
      <Box pb={2} px={2} className='title-detail'>
        <TextareaAutosize
          className='input-title input-description'
          rowsMin={10}
          placeholder="Description or type '/' for commands"
          value={currentTask?.description}
        />
      </Box>
      <AttachmentInBody />
    </Box>
  )
}

export default TitleDetail
