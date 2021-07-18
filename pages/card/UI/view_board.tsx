import React, { Fragment, useEffect, useState } from 'react'
import ReactFlow, {
  removeElements,
  addEdge,
  MiniMap,
  Controls,
  Background,
  ConnectionLineType,
  updateEdge,
  ArrowHeadType,
} from 'react-flow-renderer'
import CustomDecision from './shapes/shape_decision'
import { initialElements } from './view_board/initial_elements'
import PrimaryButtonUI from '@components/primary_button/primary_button'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'redux/reducers_registration'
import CustomProcess from './shapes/shape_process'
import ListOptionCard from './view_board/list_option_card'
import HeaderContentBoard from './view_board/header_content_board'
import { useRouter } from 'next/router'
import { getCards, createCard } from 'pages/card/logic/card_reducer'

const ViewBoard = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [elements, setElements] = useState(initialElements)
  const dataList = useSelector((state: RootState) => state.cards.cards)
  const query = router.query

  useEffect(() => {
    if (!query.id) {
      return
    }

    dispatch(getCards(query.id))
  }, [query.id])

  useEffect(() => {
    if (!dataList) {
      return
    }

    const list = Object.keys(dataList).map((each) => {
      return {
        id: each,
        position: {
          x: dataList[each]?.position?.x,
          y: dataList[each]?.position?.y,
        },
        type: dataList[each]?.shape,
        data: dataList[each]?.textContent,
      }

    })

    setElements(list)
  }, [dataList])

  function addShape(type: string) {
    dispatch(createCard(type.toUpperCase(), '', ''))
  }

  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els))

  const onEdgeUpdate = (oldEdge, newConnection) =>
    setElements((els) => updateEdge(oldEdge, newConnection, els))

  const onConnect = (params) => setElements((els) => addEdge({ ...params, arrowHeadType: ArrowHeadType.ArrowClosed }, els))
  // const onConnectStart = (params) => setOnConnectStart(() => console.log('onConnect start', params))

  const onLoad = (reactFlowInstance) => {
    reactFlowInstance.fitView()
  }

  const nodeTypes = {
    PROCESS: CustomProcess,
    DECISION: CustomDecision,
  }

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
              if (n.type === 'PROCESS') return '#0041d0'
              if (n.type === 'DECISION') return '#ff0072'

              return '#FFCC00'
            }}
          />
          <Controls />
          <ListOptionCard
            onClickAdd={addShape}
          />
        </ReactFlow>
      </div>
    </Fragment>
  )
}

export default ViewBoard
