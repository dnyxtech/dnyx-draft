'use client';

import { xml } from '@codemirror/lang-xml';
import { EditorView } from '@codemirror/view';
import { githubDark, githubLight } from '@uiw/codemirror-theme-github';
import CodeMirror from '@uiw/react-codemirror';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';

interface SvgCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const monoFont =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

export function SvgCodeEditor({ value, onChange }: SvgCodeEditorProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const editorTheme = useMemo(
    () =>
      EditorView.theme({
        '&': { fontSize: '13px', fontFamily: monoFont, height: '100%' },
        '.cm-scroller': { fontFamily: monoFont, lineHeight: '1.6', overflow: 'auto' },
        '.cm-content': { padding: '16px', minHeight: '100%' },
      }),
    [],
  );

  const extensions = useMemo(() => [xml(), EditorView.lineWrapping, editorTheme], [editorTheme]);

  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      height="100%"
      theme={isDark ? githubDark : githubLight}
      extensions={extensions}
      className="h-full overflow-hidden"
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        dropCursor: true,
        allowMultipleSelections: true,
        indentOnInput: true,
        bracketMatching: true,
        closeBrackets: true,
        autocompletion: true,
        highlightActiveLine: true,
        tabSize: 2,
      }}
    />
  );
}
