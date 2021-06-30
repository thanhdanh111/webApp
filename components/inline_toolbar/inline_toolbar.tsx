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

function areEqual(prevState, nextState) {
  const sameSelectionRect = prevState?.selectionRect?.top === nextState?.selectionRect?.top ||
    prevState?.selectionRect?.left === nextState?.selectionRect?.left;
  const sameNeedDisplay = prevState?.needDisplay === nextState?.needDisplay;

  return sameSelectionRect && sameNeedDisplay;
}

export default React.memo(InlineToolbar, areEqual);
