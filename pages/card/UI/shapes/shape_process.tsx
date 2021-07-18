import React, { useState, useRef } from 'react'
import { Handle, Position } from 'react-flow-renderer'
import Resizer from '../resizer/resize'
import { handleResize } from '../../../../helpers/handle_resize'
import SvgProcess from '@components/svg/svg_process'

const CustomProcess = ({ id }) => {
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
        <Resizer id={id} panelRef={panelRef} onResize={handleResize}  />
      </div>
      <input title='text' placeholder='Add Text' className='text-input' />
      <SvgProcess />
      <div className='handle'>
        <Handle
          type='source'
          position={Position.Right}
        />

        <Handle
          type='target'
          position={Position.Left}
        />
        <Handle
          type='target'
          position={Position.Top}
        />
        <Handle
          type='source'
          position={Position.Bottom}
        />
      </div>
    </div>
  )
}

export default CustomProcess
