import { MenuItem, Typography } from '@material-ui/core'
import { StacktraceFrame } from 'pages/event_logs/logic/event_log_interface'
import React, { FunctionComponent, useState } from 'react'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp'

type ExceptionItemType = StacktraceFrame

const ExceptionItem: FunctionComponent<ExceptionItemType> = (props: StacktraceFrame) => {
  const [select, setSelect] = useState(false)

  const generatedContextException = (contexts) => {
    if (contexts) {
      return contexts.map((item) => (
              <li key='' className='item-context'>{item}</li>
          ))
    }

    return
  }

  const showDetailContext = (frame: StacktraceFrame) => {
    if (frame.lineno && frame.pre_context && frame.post_context) {
      const start = (frame.lineno - frame.pre_context.length)

      return (
        <div className='frame-detail'>
            <ol start={start} className='ol-context'>
                {generatedContextException(frame.pre_context)}
                <li className='item-context line-context'>{frame.context_line}</li>
                {generatedContextException(frame.post_context)}
            </ol>
        </div>
      )
    }

    return
  }

  const handleClick = () => {
    setSelect(!select)
  }

  const showButtonDetail = (frame: StacktraceFrame) => {
    if (frame.lineno && frame.pre_context && frame.post_context) {

      const textButton = select ? <ArrowDropUpIcon className='icon-show-context'/> : <ArrowDropDownIcon className='icon-show-context'/>

      return (
        <button onClick={handleClick} className='btn-detail-exception'>{textButton}</button>
      )
    }

    return
  }

  return (
    <MenuItem className='frame' key=''>
        <div className='frame-content'>
            <Typography className='frame-file'>
                <span className='file-name'>
                    {props.filename}
                </span> in <span className='func'>
                     {props.function}
                </span> at line <span className='lineno'>{props.lineno}:{props.colno}</span>
            </Typography>
            <div className='btn-detail-context'>
                {showButtonDetail(props)}
            </div>
        </div>
        {select && showDetailContext(props)}
    </MenuItem>
  )
}

export default ExceptionItem
