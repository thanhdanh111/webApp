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
import { createNewCard, getDataListCard } from 'pages/board/logic/board_reducer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/reducers_registration';
import CustomProcess from '../shapes/shape_process';
import ListOptionCard from './list_option_card';
import HeaderContentBoard from './header_content_board';

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
  const tempCard = useSelector((state: RootState) => state.boards.tempCard);
  const dataList = useSelector((state: RootState) => state.boards.cards);
  // const listCards = dataList.cards.list;
  // console.log('dataList', dataList);
  useEffect(() => {
    dispatch(getDataListCard());
  }, []);

  useEffect(() => {
    if (!dataList) {
      return;
    }

    const list = dataList.map((each) => {
      return {
        id: each._id,
        position: {
          x: Math.random() * window.innerWidth - 100,
          y: Math.random() * window.innerHeight,
        },
        type: each.shape,
        data: {
          label: each.textContent,
        },
      };

    });

    setElements(list);
  }, [dataList]);

  function addShape(type: string) {
    // const test = nodeTypes[type];
     // console.log(type, typeof type);
    // dispatch(createNewCard(type.toLowerCase(), tempCard.position));
    dispatch(createNewCard(type, tempCard.position));
  }
  // console.log('tempCard', tempCard);
  // console.log('dataList', dataList);
  // console.log('elements', elements);

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
            <HeaderContentBoard />
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
