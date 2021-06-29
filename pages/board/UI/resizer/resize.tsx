import { useEffect, useState } from 'react';

import { Direction } from './constants';

const Resizer = ({ onResize }) => {
  const [direction, setDirection] = useState('');
  const [mouseDown, setMouseDown] = useState(false);

  const handleMouseMove = (event) => {
    if (!direction) return;
    onResize(direction, event.movementX, event.movementY);
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

  return(
    <>

      <div className='resizer top-left' onMouseDown={handleMouseDown(Direction.TopLeft)}/>

      <div className='resizer top-right' onMouseDown={handleMouseDown(Direction.TopRight)}/>

      <div className='resizer bottom-right' onMouseDown={handleMouseDown(Direction.BottomRight)}/>

      <div className='resizer bottom-left' onMouseDown={handleMouseDown(Direction.BottomLeft)}/>

    </>
  );
};

export default Resizer;
