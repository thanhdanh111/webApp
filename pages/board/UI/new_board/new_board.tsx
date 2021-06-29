import React, { Fragment, useEffect, useState } from 'react';
import ReactFlow, {
  removeElements,
  addEdge,
  MiniMap,
  Controls,
  Background,
  ConnectionLineType,
  updateEdge,
  ArrowHeadType,
} from 'react-flow-renderer';
import CustomDecision from '../shapes/shape_decision';
import { initialElements } from './initial_elements';
import { Box } from '@material-ui/core';
import PrimaryButtonUI from '@components/primary_button/primary_button';
import { getBoardDetailDataMiddleWare, updateNameFlowChartMiddleWare } from 'pages/board/logic/board_reducer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/reducers_registration';
import { useDebounce } from 'pages/users/logic/users_reducer';
import CustomProcess from '../shapes/shape_process';

interface BodyProps {
  idBoard?: string | string[];
}
const onLoad = (reactFlowInstance) => {
  reactFlowInstance.fitView();
};

const nodeTypes = {
  process: CustomProcess,
  decision: CustomDecision,
};

const NewBoard: React.FC<BodyProps> = (props) => {
  const dispatch = useDispatch();
  const [elements, setElements] = useState(initialElements);
  const selectedBoard = useSelector((state: RootState) => state.boards.selectedBoard);

  const [inputName, setInputName] = useState('');

  const debouncedInputName = useDebounce(inputName, 1000);

  useEffect(() => {
    if (debouncedInputName) {
      dispatch(updateNameFlowChartMiddleWare(selectedBoard._id, inputName));
    }

    return;
  }, [debouncedInputName]);

  useEffect(() => {
    fetchDataProject();
  }, []);

  const fetchDataProject = () => {
    dispatch(getBoardDetailDataMiddleWare(props.idBoard));
  };

  const onChangeNameFlowChart = (event) => {
    setInputName(event.target.value);
  };

  const addShapeProcess = () => {
    setElements((element) => element.concat({
      id: (element.length + 1).toString(),
      position: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight },
      type: 'process',
    }));
  };

  const addShapeDecision = () => {
    setElements((element) => element.concat({
      id: (element.length + 1).toString(),
      position: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight },
      type: 'decision',
    }));
  };
  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));

  const onEdgeUpdate = (oldEdge, newConnection) =>
    setElements((els) => updateEdge(oldEdge, newConnection, els));

  const onConnect = (params) => setElements((els) => addEdge({ ...params, arrowHeadType: ArrowHeadType.ArrowClosed }, els));

  return (
    <Fragment>
      <div className='style-page'>
        <div className='header-flowchart'>
          <div className='create-name-flowchart'>
            <div className='avt-flowchart'>
              <div style={{ cursor: 'pointer' }}>
                <span className='span'>
                  <svg width='16' height='16' viewBox='0 0 16 16'>
                    <g>
                      <path fill-rule='evenodd' clip-rule='evenodd' d='M7.02186 0.368705C7.51117 -0.121817 8.30413 -0.123058 8.79497 0.36593L15.6294 7.17461C16.1304 7.6737 16.1224 8.48865 15.6117 8.97774L8.6434 15.6514C8.14271 16.1309 7.34931 16.1136 6.86988 15.6127L0.349663 8.8009C-0.123517 8.30656 -0.115458 7.52364 0.367798 7.03919L7.02186 0.368705Z' fill='#730FC3'/>
                      <path fill-rule='evenodd' clip-rule='evenodd' d='M5.75693 5.16327C5.75693 4.96599 5.81475 4.80612 5.9304 4.68367C6.04604 4.56122 6.20591 4.5 6.40999 4.5H9.77734C9.98822 4.5 10.1566 4.56122 10.2824 4.68367C10.4083 4.80612 10.4712 4.96258 10.4712 5.15306C10.4712 5.33674 10.4083 5.4898 10.2824 5.61224C10.1566 5.73469 9.98822 5.79592 9.77734 5.79592H7.31815C7.27734 5.79592 7.25693 5.81633 7.25693 5.85714V7.471C7.25693 7.51182 7.27734 7.53222 7.31815 7.53222H9.27734C9.49502 7.53222 9.66509 7.59175 9.78754 7.71079C9.90999 7.82984 9.97121 8.03358 9.97121 8.22406C9.97121 8.41454 9.90999 8.5693 9.78754 8.68835C9.66509 8.80739 9.49502 8.86692 9.27734 8.86692H7.31815C7.27734 8.86692 7.25693 8.88732 7.25693 8.92814V10.7041C7.25693 10.9422 7.1872 11.1344 7.04774 11.2806C6.90829 11.4269 6.72972 11.5 6.51203 11.5C6.29434 11.5 6.11407 11.4269 5.97121 11.2806C5.82836 11.1344 5.75693 10.9422 5.75693 10.7041V5.16327Z' fill='#ffffff' />
                    </g>
                  </svg>
                </span>
              </div>
            </div>
            <input
             className='input-name'
             placeholder={selectedBoard.name}
             onChange={onChangeNameFlowChart}
            />
          </div>
          <PrimaryButtonUI
            title='Save'
            handleClick={() => ''}
          />
        </div>
        <ReactFlow
          elements={elements}
          onLoad={onLoad}
          onConnect={onConnect}
          connectionLineStyle={{ stroke: '#af00e7', strokeWidth: 2 }}
          connectionLineType={ConnectionLineType.SmoothStep}
          snapToGrid={true}
          snapGrid={[16, 16]}
          onElementsRemove={onElementsRemove}
          nodeTypes={nodeTypes}
          onEdgeUpdate={onEdgeUpdate}
        >
          <Background
            className='back-ground'
            gap={16}
          />
          <MiniMap
            nodeColor={(n) => {
              if (n.type === 'process') return '#0041d0';
              if (n.type === 'decision') return '#ff0072';

              return '#FFCC00';
            }}
          />
          <Controls />
          <div className='card-shape-all'>
            <Box className='card-shape'>
              <div className='div-svg-process'>
                <svg onClick={addShapeProcess} width='34' height='27' className='svg-process'>
                  <rect rx='0' ry='100' height='25' width='30' fill='none'/>
                </svg>
              </div>
              <div className='div-svg-decision'>
                <svg width='34' height='33' viewBox='-0.5, -0.5, 31, 31' onClick={addShapeDecision} >
                  <path
                    d='M15 0 L0 15 L15 30 L30 15z'
                    stroke='#ffffff'
                    fill='none'
                    strokeWidth='2px'
                  />
                </svg>
              </div>
            </Box>
          </div>
        </ReactFlow>
      </div>
    </Fragment>
  );
};

export default NewBoard;
