import React, { useRef, useState } from 'react';

import { Handle, Position } from 'react-flow-renderer';
import { Direction } from '../resizer/constants';
import Resizer from '../resizer/resize';

const CustomNodeComponent = () => {
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
      className='node-item-process'
      tabIndex={0}
      ref={panelRef}
      onFocus={() => setForcus(true)}
      onBlur={() => setForcus(false)}
    >
      <div className='border' style={focus ? {} : { display: 'none' }}>
        <Resizer onResize={handleResize} />
      </div>
      <input title='text' placeholder='Add Text' className='text-input' />
      <svg width='100%' height='100%' viewBox='0 0 80 40' preserveAspectRatio='none' fill='#ffffff' className='process-svg'>
        <rect height='40' width='135' />
      </svg>
      <div className='handle'>
        <Handle
          type='source'
          position={Position.Right}
          id='handle-process-right'
        />

        <Handle
          type='target'
          position={Position.Left}
          id='handle-process-left'
        />
        <Handle
          type='target'
          position={Position.Top}
          id='handle-process-top'
        />
        <Handle
          type='source'
          position={Position.Bottom}
          id='handle-process-bottom'
        />
      </div>
    </div>
  );
};

export default CustomNodeComponent;
