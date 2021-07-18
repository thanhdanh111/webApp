import { Box } from '@material-ui/core'
import React, { FC } from 'react'
import { Shape } from 'pages/board/logic/board_reducer'
import SvgOptionProcess from '@components/svg/svg_option_process'
import SvgOptionDecision from '@components/svg/svg_option_decision'

interface InitialProps {
  onClickAdd: (e: string) => void
}

const ListOptionCard: FC<InitialProps> = (props: InitialProps) => {

  const { onClickAdd }: InitialProps = props

  return (
    <div className='card-shape-all'>
      <Box className='card-shape'>
        <div className='div-svg-process' onClick={() => onClickAdd(Shape.PROCESS)}>
          <SvgOptionProcess />
        </div>
        <div className='div-svg-decision' onClick={() => onClickAdd(Shape.DECISION)}>
          <SvgOptionDecision />
        </div>
      </Box>
    </div>
  )
}

export default ListOptionCard
