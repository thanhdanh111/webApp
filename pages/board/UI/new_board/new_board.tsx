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
import { updateNameFlowChartMiddleWare, createNewCard, Shape, getDataListCard } from 'pages/board/logic/board_reducer';
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
  PROCESS: CustomProcess,
  DECISION: CustomDecision,
};

const NewBoard = () => {
  const dispatch = useDispatch();
  const [elements, setElements] = useState(initialElements);
  const selectedBoard = useSelector((state: RootState) => state.boards.selectedBoard);
  const tempCard = useSelector((state: RootState) => state.boards.tempCard);
  const dataList = useSelector((state: RootState) => state.boards.cards);
  // const listCards = dataList.cards;
  const [inputName, setInputName] = useState('');

  const debouncedInputName = useDebounce(inputName, 1000);

  useEffect(() => {
    if (debouncedInputName) {
      dispatch(updateNameFlowChartMiddleWare(selectedBoard._id, inputName));
    }

    return;
  }, [debouncedInputName]);

  useEffect(() => {
    dispatch(getDataListCard());
  }, []);

  useEffect(() => {
    if (!dataList) {
      return;
    }

    return dataList.forEach((element) => setElements(element));

  }, [dataList]);
// console.log('dataList', dataList);
  const onChangeNameFlowChart = (event) => {
    setInputName(event.target.value);
  };

  function addShape(type: Shape) {
    dispatch(createNewCard(type, tempCard.position));
  }
  // const addShapeProcess = () => {
  //   createCardAction()
  //   setElements((element) => element.concat({
  //     // id: (element.length + 1).toString(),
  //     id: selectedCard._id,
  //     position: { x: Math.random() * window.innerWidth - 100, y: Math.random() * window.innerHeight },
  //     type: 'process',
  //     // source: '',
  //     // target: '',
  //   }));
  // };

  // const addShapeDecision = () => {
  //   setElements((element) => element.concat({
  //     id: (element.length + 1).toString(),
  //     position: { x: Math.random() * window.innerWidth - 100, y: Math.random() * window.innerHeight },
  //     type: 'decision',
  //   }));
  // };
  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));

  const onEdgeUpdate = (oldEdge, newConnection) =>
    setElements((els) => updateEdge(oldEdge, newConnection, els));

  const onConnect = (params) => setElements((els) => addEdge({ ...params, arrowHeadType: ArrowHeadType.ArrowClosed }, els));
  // const onConnectStart = (params) => setOnConnectStart(() => console.log('onConnect start', params));

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
          // onConnectStart={onConnectStart}
          connectionLineStyle={{ stroke: '#af00e7', strokeWidth: 2 }}
          connectionLineType={ConnectionLineType.SmoothStep}
          snapToGrid={true}
          snapGrid={[13, 13]}
          onElementsRemove={onElementsRemove}
          nodeTypes={nodeTypes}
          onEdgeUpdate={onEdgeUpdate}
        >
          <Background
            className='back-ground'
            gap={13}
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
            onClickAdd={addShape}
          />
        </ReactFlow>
      </div>
    </Fragment>
  );
};

export default NewBoard;
