import React, { useState, useRef } from 'react'
import { Handle, Position } from 'react-flow-renderer'
import Resizer from '../resizer/resize'
import { handleResize } from '../../../../helpers/handle_resize'
import SvgProcess from '@components/svg/svg_process'

const CustomProcess = () => {
  const panelRef = useRef<HTMLDivElement>(null)
  const [focus, setFocus] = useState<boolean>(false)

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
      <SvgProcess />
      <div className='handle'>
        <Handle
          type='source'
          position={Position.Right}
          id='mm'
        />

        <Handle
          type='target'
          position={Position.Left}
          id='mn'
        />
        <Handle
          type='target'
          position={Position.Top}
          id='mk'
        />
        <Handle
          type='source'
          position={Position.Bottom}
          id='mh'
        />
      </div>
    </div>
  )
}

export default CustomProcess
