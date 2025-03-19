'use client';

import { forwardRef } from 'react';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { TRANSFORMERS } from '@lexical/markdown';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { EditorState } from 'lexical';

import AutoLinkPlugin from './plugins/AutoLinkPlugin';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import RichTextEditorTheme from './theme';

import { useState, useEffect } from 'react';

const Placeholder = ({ text = 'Napisz coś...' }) => {
  return <div className='editor-placeholder'>{text}</div>;
};

const editorConfig = {
  // The editor theme
  namespace: 'rich-text-editor',
  theme: RichTextEditorTheme,
  // Handling of errors during update
  onError(error: any) {
    throw error;
  },
  // Any custom nodes go here
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode
  ]
};

type RichTextEditorProps = {
  placeholder?: string;
  initialContent?: string;
  onChange: (content: string) => void;
};

const RichTextEditor = forwardRef<EditorState, RichTextEditorProps>(({placeholder, initialContent='{}', onChange}, ref) => {
  const [editorStateJson, setEditorStateJson] = useState<string>(initialContent);

  useEffect(() => {
    setEditorStateJson(initialContent);
  }, [initialContent]);

  const handleChange = (editorState: EditorState) => {
    editorState.read(() => {
      const json = JSON.stringify(editorState.toJSON());
      setEditorStateJson(json || '{}');
      onChange(json); 
    });
  };

  return (
    <LexicalComposer 
        initialConfig={{ ...editorConfig, editorState: (editor) => {
            try {
              return editor.parseEditorState(editorStateJson);
            } catch (error) {
              console.error("Error parsing editor state:", error);
              return null; 
            }
          }
        }}>
      <div className='editor-container'>
        <ToolbarPlugin />
        <div className='editor-inner'>
          <OnChangePlugin onChange={handleChange}/>
          <RichTextPlugin
            contentEditable={<ContentEditable className='editor-input' />}
            placeholder={<Placeholder text={placeholder} />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </div>
      </div>
    </LexicalComposer>
  );
});

export default RichTextEditor;
