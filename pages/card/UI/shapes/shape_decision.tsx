import React, { useRef, useState } from 'react'

import { Handle, Position } from 'react-flow-renderer'
import Resizer from '../resizer/resize'
import { handleResize } from '../../../../helpers/handle_resize'
import SvgDecision from '@components/svg/svg_decision'

const CustomDecision = ({ id }) => {
  const panelRef = useRef<HTMLDivElement>(null)
  const [focus, setFocus] = useState<boolean>(false)

  return (
    <div
      className='node-item'
      tabIndex={0}
      ref={panelRef}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      data-id={id}
    >
      <div className='border' style={focus ? {} : { display: 'none' }}>
        <Resizer id={id} panelRef={panelRef} onResize={handleResize} />
      </div>
      <input id='input' placeholder='Add Text' className='text-input' />
      <SvgDecision />
      <Handle
        type='source'
        position={Position.Right}
        style={{ top: '50%' }}
      />
      <Handle
        type='target'
        position={Position.Left}
        style={{ top: '50%' }}
      />
      <Handle
        type='source'
        position={Position.Right}
        style={{ top: '100%', left: '48%' }}
      />
      <Handle
        type='target'
        position={Position.Left}
        style={{ top: '0%', left: '48%' }}
      />
    </div>
  )
}

export default CustomDecision
