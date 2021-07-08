import React, { useState, useRef } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import Resizer from '../resizer/resize';
import { handleResize } from '../../../../helpers/handle_resize';

interface InitialProps {
  onChangeTextContent: () => void;
}

const CustomProcess: React.FC<InitialProps> = (props: InitialProps) => {

  const { onChangeTextContent }: InitialProps = props;
  const panelRef = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState<boolean>(false);

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
      <input title='text' placeholder='Add Text' className='text-input' onChange={onChangeTextContent} />
      <svg width='100%' height='100%' viewBox='0 0 80 40' preserveAspectRatio='none' fill='#ffffff' className='process-svg'>
        <rect height='40' width='135' />
      </svg>
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
  );
};

export default CustomProcess;
