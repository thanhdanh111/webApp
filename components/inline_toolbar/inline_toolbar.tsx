import React from 'react';
import { Fade } from '@material-ui/core';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import InlineToolbarButton from './UI/inline_toolbar_buttons';

const buttons = [
  {
    functionality: 'BOLD',
    name: 'B',
    styleName: 'BOLD',
  },
  {
    functionality: 'ITALIC',
    name: 'I',
    styleName: 'ITALIC',
  },
  {
    functionality: 'UNDERLINE',
    name: 'U',
    styleName: 'UNDERLINE',
  },
  {
    functionality: 'H1',
    name: <p>H<sub>1</sub></p>,
    overrideClass: 'text-headings',
    styleName: 'H1',
  },
  {
    functionality: 'H2',
    name: <p>H<sub>2</sub></p>,
    overrideClass: 'text-headings',
    styleName: 'H2',
  },
  {
    functionality: 'H3',
    name: <p>H<sub>3</sub></p>,
    overrideClass: 'text-headings',
    styleName: 'H3',
  },
  {
    functionality: 'NORMAL',
    name: 'T',
    styleName: 'NORMAL',
  },
  {
    functionality: 'CODE',
    name: '< >',
    styleName: 'code-block',
  },
  {
    functionality: 'unordered-list-item',
    name: <FormatListBulletedIcon />,
    styleName: 'unordered-list-item',
  },
];

const InlineToolbar = ({
  selectionRect,
  needDisplay = false,
  onClickOption,
  editorState,
}) => {

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
      left: width < 960 ? `${position?.left + 280}px` : `${position?.left}px`,
    };
  };

  const styleControls = () => {
    if (!editorState) {
      return;
    }

    const selection = editorState.getSelection();
    const blockType = editorState.getCurrentContent()?.getBlockForKey(selection.getStartKey())?.getType();

    const inlineStyles = editorState.getCurrentInlineStyle();

    return {
      inlineStyles,
      blockType,
    };
  };

  return <Fade in={needDisplay}>
    <div
      className='inline-toolbar-wrapper'
      style={getPositionToDisplay({ position: selectionRect })}
    >
      <div className='inline-toolbar'>
        {buttons.map((button) => {
          const styles = styleControls();
          const isActive = styles?.inlineStyles?.has(button.styleName) ||
            styles?.blockType === button.styleName;

          return <InlineToolbarButton
            key={button.functionality}
            functionality={button.functionality}
            name={button.name}
            overrideClass={button.overrideClass}
            active={isActive}
            onClick={(functionality) => onClickOption(functionality)}
          />;
        })}
      </div>
    </div>
  </Fade>;
};

export default InlineToolbar;
