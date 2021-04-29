import { checkArray } from 'helpers/check_array';
import { ExceptionState } from 'pages/event_logs/logic/event_log_interface';
import React, { FunctionComponent } from 'react';
import ExceptionItem from './exception_item';

type ExceptionType = ExceptionState;

const Exception: FunctionComponent<ExceptionType> = (props: ExceptionState) => {
  const frames = props.stacktrace ? props.stacktrace.frames : [];

  return (
    <div className='exception-container'>
        <ul className='exception-detail'>
            {checkArray(frames) && frames.map((frame) => {
              return (
                <>
                  <ExceptionItem {...frame} />
                </>
              );
            })}
        </ul>
    </div>
  );
};

export default Exception;
