import { storiesOf } from '@storybook/react';
import InlineToolbar from './inline_toolbar';

storiesOf('Inline Toolbar', module).add('Header', () => {
  return <InlineToolbar
    selectionRect={{ top: 0, bottom: 0 }}
    needDisplay={true}
    onClickOption={() => 'handled'}
    editorState={{}}
  />;
});
