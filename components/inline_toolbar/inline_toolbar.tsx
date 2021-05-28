import React from 'react';
import { Fade } from '@material-ui/core';
import InlineToolbarButton from './inline_toolbar_buttons';
import { inlineToolbarButons } from 'constants/toolbar_docs';

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
      top: `${position?.top - 60}px`,
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
        {inlineToolbarButons.map((button) => {
          const styles = styleControls();
          const isActive = styles?.inlineStyles?.has(button.styleName) ||
            styles?.blockType === button.styleName;

          return <InlineToolbarButton
            key={button.functionality}
            functionality={button.functionality}
            icon={button.icon}
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
