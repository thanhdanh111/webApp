import React, { useState } from 'react';

// The editor core
import type { Value, CellPlugin } from '@react-page/editor';
import Editor from '@react-page/editor';

import '@react-page/editor/lib/index.css';

// The rich text area plugin
import slate from '@react-page/plugins-slate';

const customTextFieldSlate = slate((def) => ({
  ...def,
  id: 'custom-text-editor',
  Renderer: (props) => (
    <div style={{ display: 'flex', backgroundColor: 'red' }}>
      {props.children}
    </div>
  ),
  plugins: {
    headings: def.plugins.headings,
    emphasize: def.plugins.emphasize,
    paragraphs: def.plugins.paragraphs,
    code: def.plugins.code,
  },
}));

const cellPlugins: CellPlugin[] = [customTextFieldSlate as CellPlugin];

const SimpleExample = () => {
  const [value, setValue] = useState<Value | null>(null);

  return (
    <Editor
      cellPlugins={cellPlugins}
      value={value}
      onChange={setValue}
      hideEditorSidebar={true}
    />
  );
};

export default SimpleExample;
