"use client";

import { type ChangeEvent, useEffect, useState } from "react";
import { EditorForm } from "./editor-form";
import { Preview } from "./preview";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable";
import { Card } from "~/components/ui/card";
import { useEditorHistory } from "./hooks/use-editor-history";
import { Skeleton } from "~/components/ui/skeleton";

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

function MarkdownEditorContent({ name, value, onChange }: MarkdownEditorProps) {
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
    <div className="h-[600px]">
      <input type="hidden" name={name} value={text} />
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full rounded-none"
      >
        <ResizablePanel defaultSize={50}>
          <div className="h-full border-r">
            <EditorForm 
              name={'markdown'}
              markdown={text} 
              onChange={setText} 
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel className="markdown bg-muted/30" defaultSize={50}>
          <div className="h-full p-4 overflow-auto">
            <Preview markdown={text} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export function MarkdownEditor(props: MarkdownEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-[600px] space-y-3">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  return <MarkdownEditorContent {...props} />;
}