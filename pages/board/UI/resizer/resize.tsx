import { useEffect, useState, useRef } from 'react';
import { Direction } from './constants';
import CloseIcon from '@material-ui/icons/Close';
import { deleteCardMiddleWare } from 'pages/board/logic/board_reducer';
import { useDispatch } from 'react-redux';

const Resizer = ({ id, onResize, panelRef }) => {
  const heightRef = useRef(40);
  const widthRef = useRef(100);
  const [direction, setDirection] = useState('');
  const [mouseDown, setMouseDown] = useState(false);
  const dispatch = useDispatch();

  const handleMouseMove = (event) => {
    if (!direction) return;
    onResize(panelRef, heightRef, widthRef, direction, event.movementX, event.movementY);
  };
  useEffect(() => {

    if (mouseDown) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseDown]);

  useEffect(() => {
    const handelMouseUp = () => setMouseDown(false);

    window.addEventListener('mouseup', handelMouseUp);

    return () => {
      window.removeEventListener('mouseup', handelMouseUp);
    };
  }, []);

  const handleMouseDown = (men) => () => {
    setDirection(men);
    setMouseDown(true);

  };

  const handelDeleteCard = () => {
    dispatch(deleteCardMiddleWare(id));
  };

  return(
    <div>
      <div className='icon'>
        <CloseIcon className='icon-delete' onClick={() => handelDeleteCard()}/>
      </div>

      <div className='resizer top-left' onMouseDown={handleMouseDown(Direction.TopLeft)}/>

      <div className='resizer top-right' onMouseDown={handleMouseDown(Direction.TopRight)}/>

      <div className='resizer bottom-right' onMouseDown={handleMouseDown(Direction.BottomRight)}/>

      <div className='resizer bottom-left' onMouseDown={handleMouseDown(Direction.BottomLeft)}/>

    </div>
  );
};

export default Resizer;
