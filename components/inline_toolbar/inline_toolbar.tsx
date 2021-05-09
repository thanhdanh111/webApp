import React from 'react';
import { Button, Fade } from '@material-ui/core';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';

const buttons = [
  {
    functionality: 'BOLD',
    name: 'B',
  },
  {
    functionality: 'ITALIC',
    name: 'I',
  },
  {
    functionality: 'UNDERLINE',
    name: 'U',
  },
  {
    functionality: 'CODE',
    name: '< >',
  },
  {
    functionality: 'unordered-list-item',
    name: <FormatListBulletedIcon />,
  },
  {
    functionality: 'H1',
    name: <p>H<sub>1</sub></p>,
    overiderClass: 'text-headings',
  },
  {
    functionality: 'H2',
    name: <p>H<sub>2</sub></p>,
    overiderClass: 'text-headings',
  },
  {
    functionality: 'H3',
    name: <p>H<sub>3</sub></p>,
    overiderClass: 'text-headings',
  },
  {
    functionality: 'NORMAL',
    name: 'T',
  },
];

const InlineToolbar = ({ selectionRect, needDisplay = false, onClickOption }) => {

  if (!selectionRect?.top || !selectionRect?.left) {
    return <div />;
  }

  const getPositionToDisplay = ({ position }) => {
    if (!position?.top || !position?.left) {
      return {
        top: '0px',
        right: '0px',
      };
    }
    const width = window?.innerWidth;

    return {
      top: `${position?.top}px`,
      left: width < 960 ? `${position?.left + 120}px` : `${position?.left}px`,
    };
  };

  return <Fade in={needDisplay}>
    <ul
      className='inline-toolbar'
      style={getPositionToDisplay({ position: selectionRect })}
    >
      {buttons.map((button) => <Button
        disableElevation
        variant='text'
        key={button.functionality}
        className={`'inline-toolbar-btn' ${button.overiderClass ?? ''}`}
        onClick={() => onClickOption(button.functionality)}
      >
        {button.name}
      </Button>)}
    </ul>
  </Fade>;
};

export default InlineToolbar;
