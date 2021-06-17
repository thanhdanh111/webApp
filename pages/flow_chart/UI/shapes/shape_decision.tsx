import React, { useRef, useState } from 'react';

import { Handle, Position } from 'react-flow-renderer';
import { Direction } from '../resizer/constants';
import Resizer from '../resizer/resize';

const CustomDecision = () => {
  const panelRef = useRef<HTMLDivElement>(null);
  const heightRef = useRef(100);
  const widthRef = useRef(100);
  const [focus, setForcus] = useState<boolean>(false);

  const handleResize = (direction, movementX, movementY) => {
    const panel = panelRef.current;
    if (!panel) return;

    // gọi getBoundsClientRect để lấy các thuộc tính hiện tại của nó
    // và tạo bốn chức năng để xử lý việc thay đổi kích thước theo bốn hướng chính
    // tslint:disable-next-line: typedef
    const { x, y } = panel.getBoundingClientRect();

    const resizeTop = () => {
      if (!movementY) {
        return;
      }
      heightRef.current = heightRef.current - movementY;
      panel.style.height = `${heightRef.current}px`;
      panel.style.top = `${y - movementY}px`;
    };

    const resizeRight = () => {
      widthRef.current = widthRef.current + movementX;
      panel.style.width = `${widthRef.current}px`;
    };

    const resizeBottom = () => {
      heightRef.current = heightRef.current + movementY;
      panel.style.height = `${heightRef.current}px`;
    };

    const resizeLeft = () => {
      widthRef.current = widthRef.current - movementX;
      panel.style.width = `${widthRef.current}px`;
      panel.style.left = `${x - movementX}px`;
    };

    switch (direction) {
      case Direction.TopLeft:
        resizeTop();
        resizeLeft();
        break;

      case Direction.TopRight:
        resizeTop();
        resizeRight();
        break;

      case Direction.BottomRight:
        resizeBottom();
        resizeRight();
        break;

      case Direction.BottomLeft:
        resizeBottom();
        resizeLeft();
        break;

      default:
        break;
    }
  };

  return (
    <div
      className='custom'
      tabIndex={0}
      ref={panelRef}
      onFocus={() => setForcus(true)}
      onBlur={() => setForcus(false)}
    >

      <div className='border-decision' style={focus ? {} : { display: 'none' }}>
        <Resizer onResize={handleResize} />
      </div>

      <input id='input' placeholder='Add Text' className='input-decision' />
      <svg width='100%' height='100%' viewBox='0 0 1200 1200' preserveAspectRatio='none' className='decision' fill='#ffffff'>
        <path id='my' className='rhombus' d='M600 0 L0 600 L600 1200 L1200 600z' />
      </svg>
      <Handle
        type='source'
        position={Position.Right}
        id='a'
        style={{ top: '50%', borderRadius: 0 }}
      />
      <Handle
        type='target'
        position={Position.Left}
        id='b'
        style={{ top: '50%', borderRadius: 0 }}
      />
      <Handle
        type='source'
        position={Position.Right}
        id='c'
        style={{ top: '100%', left: '48%', borderRadius: 0 }}
      />
      <Handle
        type='target'
        position={Position.Left}
        id='d'
        style={{ top: '0%', left: '48%', borderRadius: 0 }}
      />
    </div>
  );
};

export default CustomDecision;
