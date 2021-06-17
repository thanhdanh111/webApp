import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

const CustomEllip = () => {
  return (
    <div className='node-item-flow-oval'>
      <input title='text' placeholder='Add Text' className='text-input'/>
      <Handle
        type='target'
        position={Position.Right}
        id='a'
        style={{ borderRadius: 0 }}
      />
      <Handle
        type='source'
        position={Position.Left}
        id='b'
        style={{ borderRadius: 0 }}
      />
      <Handle
        type='source'
        position={Position.Top}
        id='c'
        style={{  borderRadius: 0 }}
      />
      <Handle
        type='source'
        position={Position.Bottom}
        id='d'
        style={{  borderRadius: 0 }}
      />
    </div>

  );
};
export default CustomEllip;
