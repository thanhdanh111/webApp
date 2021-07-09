import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/reducers_registration';
import { useState, useEffect } from 'react';
import { useDebounce } from 'pages/users/logic/users_reducer';
import { updateNameFlowChartMiddleWare } from 'pages/board/logic/board_reducer';

const HeaderContentBoard = () => {
  const dispatch = useDispatch();
  const selectedBoard = useSelector((state: RootState) => state.boards.selectedBoard);
  const [inputName, setInputName] = useState('');

  const debouncedInputName = useDebounce(inputName, 1000);

  useEffect(() => {
    if (debouncedInputName) {
      dispatch(updateNameFlowChartMiddleWare(selectedBoard._id, inputName));
    }

    return;
  }, [debouncedInputName]);

  const onChangeNameFlowChart = (event) => {
    setInputName(event.target.value);
  };

  return(
    <>
      <input
        className='input-name'
        placeholder={selectedBoard.name}
        onChange={onChangeNameFlowChart}
      />
    </>
  );

};
export default HeaderContentBoard;
