import React, { useState, useEffect } from 'react';
import { Editor, EditorState } from 'draft-js';

const PlainTextEditorExample = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  );
  let domEditor;

  const onChange = (editorState) => setEditorState(editorState);

  const logState = () => console.log(editorState.toJS());

  const setDomEditorRef = (ref) => domEditor = ref;

  const focus =  () => domEditor.focus();

  useEffect(() => domEditor?.focus());

  return (
    <div
      style={{
        fontFamily: '\'Helvetica\', sans-serif',
        padding: 20,
        width: 600,
      }}
    >
    <div
      style={{ border: '1px solid #ccc', cursor: 'text', minHeight: 80, padding: 10 }}
      onClick={focus}
    >
      <Editor
        editorState={editorState}
        onChange={onChange}
        placeholder='Enter some text...'
        ref={setDomEditorRef}
      />
    </div>
      <input
        onClick={logState}
        style={{
          marginTop: 10,
          textAlign: 'center',
        }}
        type='button'
        value='Log State'
      />
    </div>
  );
};

export default PlainTextEditorExample;
