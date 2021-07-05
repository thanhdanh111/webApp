import React, { useState, useRef } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import Resizer from '../resizer/resize';
import { handleResize } from '../../../../helpers/handle_resize';
import { RootState } from 'redux/reducers_registration';
import { useSelector } from 'react-redux';
const CustomProcess = () => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState<boolean>(false);

  const tempCard = useSelector((state: RootState) => state.boards.tempCard);
  // const [source, setSource] = useState('');

  return (
    <div
      className='node-item-process'
      tabIndex={0}
      ref={panelRef}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
    >
      <div className='border' style={focus ? {} : { display: 'none' }}>
        <Resizer panelRef={panelRef} onResize={handleResize}  />
      </div>
      <input title='text' placeholder='Add Text' className='text-input' />
      <svg width='100%' height='100%' viewBox='0 0 80 40' preserveAspectRatio='none' fill='#ffffff' className='process-svg'>
        <rect height='40' width='135' />
      </svg>
      <div className='handle'>
        <Handle
          type='source'
          position={Position.Right}
          id={`rightTo-${tempCard._id}`}
          // onConnect={(params) => console.log('handle onConnect', params)}
          // isValidConnection={(connection) => {
          //   return connection.target === 'some-id';
          // }}
        />

        <Handle
          type='target'
          position={Position.Left}
          id={`leftTo-${tempCard._id}`}
          // onConnect={() => setSource(true)}
          // isValidConnection={(connection) => connection.source === 'some-id'}
        />
        <Handle
          type='target'
          position={Position.Top}
          id={`topTo-${tempCard._id}`}
          // onConnect={(params) => console.log('handle onConnect top', params)}
          // isValidConnection={(connection) => connection.source === 'some-id'}
        />
        <Handle
          type='source'
          position={Position.Bottom}
          id={`bottomTo-${tempCard._id}`}
          // onConnect={(params) => console.log('handle onConnect bottom', params)}
          // isValidConnection={(connection) => connection.target === 'some-id'}
        />
      </div>
    </div>
  );
};

export default CustomProcess;
