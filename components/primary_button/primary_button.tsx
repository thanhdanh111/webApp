import React, { FunctionComponent } from 'react'
import {
  Button,
} from '@material-ui/core'

interface DataType {
  title: string
  handleClick: () => void
  disabled?: boolean
  extendClass?: string
}

type BodyProps = DataType

const PrimaryButtonUI: FunctionComponent<BodyProps> = ({ title, handleClick, extendClass, disabled = false }) => {

  return (
    <div className={`btn-primary-container ${extendClass}`}>
      <Button disabled={disabled} color='secondary' variant='contained' onClick={handleClick} className='btn-primary' >
        {title}
      </Button>
    </div>
  )
}

export default PrimaryButtonUI
