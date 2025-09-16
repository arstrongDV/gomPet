'use client';

import { forwardRef, useState, useEffect, useCallback } from 'react';
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
import { $createParagraphNode, $createTextNode, $getRoot, EditorState } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

// Import plugins (assuming these exist in your project)
import AutoLinkPlugin from './plugins/AutoLinkPlugin';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import RichTextEditorTheme from './theme';

const Placeholder = ({ text = 'Napisz coś...' }) => {
  return <div className='editor-placeholder'>{text}</div>;
};

const editorConfig = {
  namespace: 'rich-text-editor',
  theme: RichTextEditorTheme,
  onError(error: any) {
    throw error;
  },
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

// Component to set initial content safely
// In RichTextEditor.tsx, modify the InitialContentSetter component:
function InitialContentSetter({ initialContent }: { initialContent?: string }) {
  const [editor] = useLexicalComposerContext();
  const [hasSetInitialContent, setHasSetInitialContent] = useState(false);
  
  useEffect(() => {
    if (hasSetInitialContent || !initialContent) return;
    
    try {
      // Handle the case where multiple JSON objects are concatenated
      let contentToUse = initialContent;
      
      // If it looks like multiple JSON objects, take the last one
      if (typeof initialContent === 'string' && 
          initialContent.trim().startsWith('{') && 
          initialContent.includes('}{')) {
        const jsonObjects = initialContent.split('}{');
        // Take the last complete object and add back the braces
        contentToUse = `{${jsonObjects[jsonObjects.length - 1]}`;
        
        // If it doesn't end with }, add it
        if (!contentToUse.endsWith('}')) {
          contentToUse += '}';
        }
      }
      
      const trimmed = contentToUse.trim();
      const isEmptyLike = !trimmed || 
                         trimmed === '{}' || 
                         trimmed === 'null' || 
                         trimmed === '{"root":{"children":[],"direction":null,"format":"","indent":0,"type":"root","version":1}}';
      
      if (isEmptyLike) {
        setHasSetInitialContent(true);
        return;
      }
      
      // Try to parse as Lexical state
      try {
        const state = editor.parseEditorState(contentToUse);
        editor.setEditorState(state);
        setHasSetInitialContent(true);
        return;
      } catch (parseError) {
        console.log('Content is not valid Lexical JSON, treating as plain text');
      }
      
      // Fallback for plain text content
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        const paragraph = $createParagraphNode();
        paragraph.append($createTextNode(String(contentToUse)));
        root.append(paragraph);
      });
      
      setHasSetInitialContent(true);
    } catch (error) {
      console.error('Error setting initial content:', error);
    }
  }, [editor, initialContent, hasSetInitialContent]);

  return null;
}

const RichTextEditor = forwardRef<EditorState, RichTextEditorProps>(
  ({ placeholder, initialContent = '{}', onChange }, ref) => {
    const [editorStateJson, setEditorStateJson] = useState<string>(() => {
      if (!initialContent) return '{}';
      return typeof initialContent === 'string' 
        ? initialContent 
        : JSON.stringify(initialContent);
    });

    const handleChange = useCallback((editorState: EditorState) => {
      editorState.read(() => {
        const json = JSON.stringify(editorState.toJSON());
        setEditorStateJson(json);
        onChange(json);
      });
    }, [onChange]);

    const getInitialEditorState = useCallback((editor: any) => {
      try {
        if (!editorStateJson || editorStateJson.trim() === '{}') {
          return editor.parseEditorState('{"root":{"children":[],"direction":null,"format":"","indent":0,"type":"root","version":1}}');
        }
        return editor.parseEditorState(editorStateJson);
      } catch (error) {
        console.error("Error parsing editor state:", error);
        // Return empty editor state as fallback
        return editor.parseEditorState('{"root":{"children":[],"direction":null,"format":"","indent":0,"type":"root","version":1}}');
      }
    }, [editorStateJson]);

    return (
      <LexicalComposer initialConfig={{ 
        ...editorConfig, 
        editorState: getInitialEditorState 
      }}>
        <InitialContentSetter initialContent={initialContent} />
        <div className='editor-container'>
          <ToolbarPlugin />
          <div className='editor-inner'>
            <OnChangePlugin onChange={handleChange} />
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
  }
);

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;
