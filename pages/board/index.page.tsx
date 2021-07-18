import React from 'react'
import BoardUI from './UI/board'
import { BoardsPage } from 'helpers/type'
import { useSelector } from 'react-redux'
import { RootState } from 'redux/reducers_registration'

const FlowChartPage = () => {
  const {
    loading,
  }: BoardsPage = useSelector((state: RootState) => state.boards)

  return (
    <>
      <BoardUI loading={loading}/>
    </>
  )
}

export default FlowChartPage
