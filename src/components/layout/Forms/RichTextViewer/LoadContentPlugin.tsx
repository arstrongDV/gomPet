import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, ReactNode } from "react";

interface LoadContentPluginProps {
  content: any;
  renderNode?: (node: any, index: number) => ReactNode;
}

export function LoadContentPlugin({ content, renderNode }: LoadContentPluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!content) return;
    console.log(content)
    editor.update(() => {
      let parsedState;

      if (typeof content === "string") {
        parsedState = editor.parseEditorState(content);
      } else {
        parsedState = editor.parseEditorState(JSON.stringify(content));
      }

      editor.setEditorState(parsedState);
    });
  }, [content, editor]);

  return null;
}