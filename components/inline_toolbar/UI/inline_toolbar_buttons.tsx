import { Button } from '@material-ui/core';

const InlineToolbarButton = ({
  functionality,
  name,
  onClick,
  overrideClass = '',
  active,
}) => {
  let className = `inline-toolbar-btn ${overrideClass}`;

  if (active) {
    className += ' inline-toolbar-btn--active';
  }

  return <Button
    disableElevation
    variant='text'
    className={className}
    onClick={() => onClick(functionality)}
  >
    {name}
  </Button>;
};

export default InlineToolbarButton;
