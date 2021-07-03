import { Box, MenuItem } from '@material-ui/core';
import { updateNewTask } from 'pages/task_boards/logic/task_boards_action';
import React from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import CloseIcon from '@material-ui/icons/Close';
import OutlinedFlagIcon from '@material-ui/icons/OutlinedFlag';

interface PriorityLevel {
  text: string;
  color: string;
  value: string;
}
interface InitProps {
  priorityLevel: PriorityLevel;
  close: () => void;
}
const PriorityItem: React.FC<InitProps> = (props) => {
  const dispatch = useDispatch();
  const newTask = useSelector((state: RootStateOrAny) => state.taskBoards?.newTask);

  const onChoosingValue = (priority) => {
    dispatch(updateNewTask({ ...newTask, priority }));
  };

  return (
    <MenuItem
     onClick={() => {
       onChoosingValue(props.priorityLevel.value);
       props.close();
     }}
    >
     <Box display='flex' alignItems='center'>
       {props.priorityLevel.value === '' ? (
         <CloseIcon
           fontSize='small'
           className='icon-popup'
           style={{ color: props.priorityLevel.color }}
         />
       ) : (
         <OutlinedFlagIcon
           fontSize='small'
           className='icon-popup'
           style={{ color: props.priorityLevel.color }}
         />
       )}
       {props.priorityLevel.text}
     </Box>
    </MenuItem>
  );
};

export default PriorityItem;
