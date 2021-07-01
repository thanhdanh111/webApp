import React, { useRef, useState } from 'react';

import { Handle, Position } from 'react-flow-renderer';
import Resizer from '../resizer/resize';
import { handleResize } from '../../../../helpers/handle_resize';

const CustomDecision = () => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState<boolean>(false);

  return (
    <div
      className='node-item-decision'
      tabIndex={0}
      ref={panelRef}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
    >

      <div className='border-decision' style={focus ? {} : { display: 'none' }}>
        <Resizer panelRef={panelRef} onResize={handleResize} />
      </div>

      <input id='input' placeholder='Add Text' className='input-decision' />
      <svg width='100%' height='100%' viewBox='0 0 1200 1200' preserveAspectRatio='none' className='decision' fill='#ffffff'>
        <path id='my' className='rhombus' d='M600 0 L0 600 L600 1200 L1200 600z' />
      </svg>
      <Handle
        id='handel-decision-right'
        type='source'
        position={Position.Right}
        style={{ top: '50%' }}
      />
      <Handle
        id='handel-decision-left'
        type='target'
        position={Position.Left}
        style={{ top: '50%' }}
      />
      <Handle
        id='handel-decision-bottom'
        type='source'
        position={Position.Right}
        style={{ top: '100%', left: '48%' }}
      />
      <Handle
        id='handel-decision-top'
        type='target'
        position={Position.Left}
        style={{ top: '0%', left: '48%' }}
      />
    </div>
  );
};

export default CustomDecision;
