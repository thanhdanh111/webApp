import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

const CustomExtract = () => {
  return (
    <div className='node-item-flow-extract' >
      <Handle
        type='target'
        position={Position.Top}
        id='a'
        style={{ top: '0%', borderRadius: 0 }}
      />
      <Handle
        type='source'
        position={Position.Left}
        id='b'
        style={{ top: '100%', borderRadius: 0 }}
      />
      <input title='text' placeholder='Add Text' className='text-input'/>
      <Handle
        type='source'
        position={Position.Right}
        id='c'
        style={{ top: '100%', borderRadius: 0 }}
      />
    </div>

  );
};
export default CustomExtract;
