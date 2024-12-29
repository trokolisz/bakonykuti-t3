"use client";

import { type ChangeEvent, useEffect } from "react";
import { EditorForm } from "./editor-form";
import { Preview } from "./preview";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable";
import { Card } from "~/components/ui/card";
import { useEditorHistory } from "./hooks/use-editor-history";

const initialMarkdown = `# Welcome to the Markdown Editor!

## Features

1. **Bold** and *italic* text
2. Lists (ordered and unordered)
3. [Links](https://example.com)

This is a paragraph with an empty line above and below.

4. Code blocks with syntax highlighting:

\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\``;

interface MarkdownEditorProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ name, value, onChange }: MarkdownEditorProps) {
  const { text, setText, undo, redo } = useEditorHistory(value);

  // Sync external value changes
  useEffect(() => {
    if (value !== text) {
      setText(value);
    }
  }, [value]);

  // Notify parent of changes
  useEffect(() => {
    if (text !== value) {
      onChange(text);
    }
  }, [text, value, onChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
        } else if (e.key === 'y') {
          e.preventDefault();
          redo();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <Card className="min-h-[500px]">
      <input type="hidden" name={name} value={text} />
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full rounded-lg"
      >
        <ResizablePanel defaultSize={50}>
          <EditorForm 
            name={'markdown'}
            markdown={text} 
            onChange={setText} 
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel className="markdown" defaultSize={50}>
          <Preview markdown={text} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </Card>
  );
}