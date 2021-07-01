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
import PrimaryButtonUI from '@components/primary_button/primary_button';
import { updateNameFlowChartMiddleWare } from 'pages/board/logic/board_reducer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/reducers_registration';
import { useDebounce } from 'pages/users/logic/users_reducer';
import CustomProcess from '../shapes/shape_process';
import AvatarFlowChart from './avatar_flowchart';
import ListOptionCard from './list_option_card';

const onLoad = (reactFlowInstance) => {
  reactFlowInstance.fitView();
};

const nodeTypes = {
  process: CustomProcess,
  decision: CustomDecision,
};

const NewBoard = () => {
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
              <AvatarFlowChart />
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
          <ListOptionCard
            onClickAddProcess={addShapeProcess}
            onClickAddDecision={addShapeDecision}
          />
        </ReactFlow>
      </div>
    </Fragment>
  );
};

export default NewBoard;
