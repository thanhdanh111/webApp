import React, { Fragment, useState } from 'react';
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

export default NewFlowChart;
