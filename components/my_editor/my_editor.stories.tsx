import { storiesOf } from '@storybook/react';
import React from 'react';
import { EditorState } from 'draft-js';
import MyEditor from './my_editor';

storiesOf('My Editor', module).add('Header', () => {
  return <MyEditor
    handleOnChangeStyleLine={() => 'handled'}
    onMoveBlockAction={() => 'handled'}
    key='my-editor'
    index={0}
    handleChangeEditorState={() => 'handled'}
    editorState={EditorState.createEmpty()}
    currentIndex={0}
    onClickSideToolbar={() => 'handled'}
  />;
});
