import React, { Fragment, useState } from 'react';
import ReactFlow, {
  removeElements,
  addEdge,
  MiniMap,
  Controls,
  Background,
  ConnectionLineType,
  updateEdge,
} from 'react-flow-renderer';
import CustomNodeComponent from '../shapes/shape_process';
import CustomDicision from '../shapes/shape_decision';
import { initialElements } from './initial_elements';
import { Box } from '@material-ui/core';

const onLoad = (reactFlowInstance) => {
  reactFlowInstance.fitView();
};

const nodeTypes = {
  process: CustomNodeComponent,
  decision: CustomDicision,
};

const NewFlowChart = () => {

  const [elements, setElements] = useState(initialElements);

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
      // data: { label: `${name}` },
      position: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight },
      type: 'decision',
    }));
  };
  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));

  const onEdgeUpdate = (oldEdge, newConnection) =>
    setElements((els) => updateEdge(oldEdge, newConnection, els));

  const onConnect = (params) => setElements((els) => addEdge(params, els));

  return (
    <Fragment>
      <div className='style-page'>
        <ReactFlow
          elements={elements}
          onLoad={onLoad}
          onConnect={onConnect}
          connectionLineStyle={{ stroke: 'red', strokeWidth: 2 }}
          connectionLineType={ConnectionLineType.SmoothStep}
          snapToGrid={true}
          snapGrid={[16, 16]}
          onElementsRemove={onElementsRemove}
          nodeTypes={nodeTypes}
          onEdgeUpdate={onEdgeUpdate}
          edgeTypes={{ smoothstep: CustomNodeComponent }}

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
              <svg onClick={addShapeProcess} width='35' height='30' className='svg-process'>
                <rect rx='0' ry='100' x='2.5' y='2.5' height='25' width='30' fill='none'/>
              </svg>

              <svg width='30' height='30' onClick={addShapeDecision} className='svg-decision'>
                <path id='my' className='rhombus' d='M15 0 L0 15 L15 30 L30 15z' fill='none'/>
              </svg>
            </Box>
          </div>
        </ReactFlow>
        <div className='shapes' style={{ resize: 'both' }}>
          {/* <svg onClick={addShapeCircle} width='25' height='25'>
            <circle r='12.5' cx='12.5' cy='12.5' stroke='#3de' fill='none'/>
          </svg> */}
          <svg onClick={addShapeProcess} width='35' height='30'>
            <rect rx='0' ry='100' x='2.5' y='2.5' height='25' width='30' stroke='#3de' fill='none'/>
          </svg>
          <svg width='30' height='30' onClick={addShapeDecision}>
            <path id='my' className='rhombus' d='M15 0 L0 15 L15 30 L30 15z' stroke='#3de' fill='none'/>
          </svg>
          {/* <svg onClick={addShapeEllip} width='40' height='25' style={{ cursor: 'nwse-resize' }}>
            <ellipse cx='18' cy='12.5' rx='18' ry='12.5' stroke='#3de' fill='none' />
          </svg> */}

        </div>
      </div>
    </Fragment>
  );
};

export default NewFlowChart;
