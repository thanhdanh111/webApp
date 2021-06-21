import { Elements } from 'react-flow-renderer';
export const initialElements: Elements = [
  {
    id: '1' ,
    type: 'process',
    position: { x: 0, y: 0 },
    isHidden: false,
  },
  // {
  //   id: 'e1-2',
  //   type: 'smoothstep',
  //   source: '1',
  //   target: '2',
  //   animated: true,
  //   label: 'edge label',
  // },
  {
    id: '2' ,
    type: 'decision',
    position: { x: 30, y: 30 },
    isHidden: false,
  },

];
