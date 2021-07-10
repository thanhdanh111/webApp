import React, { useRef, useState } from 'react';

import { Handle, Position } from 'react-flow-renderer';
import Resizer from '../resizer/resize';
import { handleResize } from '../../../../helpers/handle_resize';
import SvgDecision from '@components/svg/svg_decision';

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
      <SvgDecision />
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
