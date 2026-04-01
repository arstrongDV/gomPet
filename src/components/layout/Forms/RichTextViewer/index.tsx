"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, ReactNode } from "react";
import type { JSX } from "react";

import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-python";

import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { ParagraphNode, TextNode } from "lexical";

import style from './RichTextViewer.module.scss';

interface Props {
  content: any;
  size?: "small" | "medium" | "large"; // new prop
}

type LexicalEditorStateShape = {
  root: {
    children: any[];
    direction: null | string;
    format: string;
    indent: number;
    type: "root";
    version: number;
  };
};

const createPlainTextEditorState = (text: string): LexicalEditorStateShape => ({
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text,
            type: "text",
            version: 1,
          },
        ],
        direction: null,
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: null,
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
});

const toEditorStateString = (content: unknown): string | null => {
  if (content == null) {
    return null;
  }

  if (typeof content === "string") {
    const trimmed = content.trim();
    if (!trimmed) {
      return null;
    }

    try {
      const parsed = JSON.parse(trimmed);
      if (parsed?.root && Array.isArray(parsed.root.children)) {
        return trimmed;
      }
      if (Array.isArray(parsed?.children)) {
        return JSON.stringify({
          root: { ...createPlainTextEditorState("").root, children: parsed.children },
        });
      }
    } catch {
      return JSON.stringify(createPlainTextEditorState(trimmed));
    }

    return JSON.stringify(createPlainTextEditorState(trimmed));
  }

  if (typeof content === "object") {
    const value = content as Record<string, any>;

    if (value.root && Array.isArray(value.root.children)) {
      return JSON.stringify(value);
    }

    if (Array.isArray(value.children)) {
      return JSON.stringify({
        root: { ...createPlainTextEditorState("").root, children: value.children },
      });
    }
  }

  return null;
};

// Plugin to load Lexical editor state
export function LoadContentPlugin({ content }: { content: any }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const editorState = toEditorStateString(content);
    if (!editorState) return;

    editor.update(() => {
      try {
        const parsedState = editor.parseEditorState(editorState);
        editor.setEditorState(parsedState);
      } catch (error) {
        console.error("Failed to parse rich text content:", error);
      }
    });
  }, [content, editor]);

  return null;
}

// Node renderer
const renderNode = (node: any, index: number): ReactNode => {
  if (!node) return null;

  const alignmentClass =
    node.format === "center" ? style.alignCenter
    : node.format === "right" ? style.alignRight
    : node.format === "justify" ? style.alignJustify
    : style.alignLeft;

  // Text formatting
  if (node.type === "text") {
    let element: React.ReactNode = node.text;
    if (node.format & 1) element = <strong key={index}>{element}</strong>;
    if (node.format & 2) element = <em key={index}>{element}</em>;
    if (node.format & 4) element = <u key={index}>{element}</u>;
    if (node.format & 8) element = <s key={index} className={style.strikethrough}>{element}</s>;
    if (node.format & 16) element = <code className={style.inlineCode}>{element}</code>;
    return element;
  }

  // Paragraph
  if (node.type === "paragraph") {
    return (
      <p key={index} className={alignmentClass}>
        {node.children?.map((c: any, i: number) => renderNode(c, i))}
      </p>
    );
  }

  // Heading
  if (node.type === "heading") {
    const Tag = `h${node.tag || 2}` as keyof JSX.IntrinsicElements;
    return (
      <Tag key={index} className={`${style.heading} ${alignmentClass}`}>
        {node.children?.map((c: any, i: number) => renderNode(c, i))}
      </Tag>
    );
  }

  // Link
  if (node.type === "link") {
    return (
      <a key={index} href={node.url} target="_blank" rel="noopener noreferrer" className={style.link}>
        {node.children?.map((c: any, i: number) => renderNode(c, i))}
      </a>
    );
  }

  // Quote
  if (node.type === "quote") {
    return <blockquote key={index} className={style.blockquote}>{node.children?.map((c: any, i: number) => renderNode(c, i))}</blockquote>;
  }

  // List
  if (node.type === "list") {
    const Tag = node.listType === "bullet" ? "ul" : "ol";
    return <Tag key={index} className={style.list}>{node.children?.map((c: any, i: number) => renderNode(c, i))}</Tag>;
  }

  if (node.type === "listitem") {
    return <li key={index} className={style.listItem}>{node.children?.map((c: any, i: number) => renderNode(c, i))}</li>;
  }

  // Code block
  if (node.type === "code") {
    const codeString = node.children?.map((c: any) => c.text).join("\n") || "";
    const lang = node.language || "plaintext";
    const grammar = Prism.languages[lang] || Prism.languages.plaintext;
    const highlighted = Prism.highlight(codeString, grammar, lang);

    return (
      <div key={index} className={style.codeBlock}>
        <pre>
          <code dangerouslySetInnerHTML={{ __html: highlighted }} />
        </pre>
        {lang !== "plaintext" && <span className={style.codeLanguage}>{lang}</span>}
      </div>
    );
  }

  if (node.children) {
    return <div key={index}>{node.children.map((c: any, i: number) => renderNode(c, i))}</div>;
  }

  return null;
};

// Main viewer component
export default function RichTextViewer({ content, size = "medium" }: Props) {
  if (!content) return null;

  const sizeClass = 
    size === "small" ? style.smallText 
    : size === "large" ? style.largeText 
    : style.mediumText;

  return (
    <LexicalComposer
      initialConfig={{
        namespace: "Viewer",
        editable: false,
        nodes: [
          HeadingNode, QuoteNode, ListNode, ListItemNode,
          LinkNode, CodeNode, CodeHighlightNode, ParagraphNode, TextNode
        ],
        onError(error) { console.error(error); },
      }}
    >
      <RichTextPlugin
        contentEditable={<ContentEditable className={`${style.richTextContainer} ${sizeClass}`} />}
        placeholder={null}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <LoadContentPlugin content={content} />
    </LexicalComposer>
  );
}
