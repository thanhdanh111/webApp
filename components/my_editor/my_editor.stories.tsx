import { storiesOf } from '@storybook/react';
import React from 'react';
import { EditorState } from 'draft-js';
import MyEditor from './my_editor';

storiesOf('My Editor', module).add('Header', () => {
  return <MyEditor
    readOnly={false}
    handleOnChangeLineStyle={() => 'handled'}
    onMoveBlockAction={() => 'handled'}
    key='my-editor'
    handleChangeEditorState={() => 'handled'}
    editorState={EditorState.createEmpty()}
    onClickSideToolbar={() => 'handled'}
  />;
});
