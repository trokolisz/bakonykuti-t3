"use client";

import { useCallback, useRef } from "react";
import { Textarea } from "~/components/ui/textarea";
import { Toolbar } from "./toolbar";
import { formatText } from "./utils/format";

interface EditorFormProps {
  markdown: string;
  onChange: (value: string) => void;
  name?: string;  // Add optional name prop
}

export function EditorForm({ markdown, onChange, name = 'markdown' }: EditorFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFormat = useCallback((format: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    
    const newText = selectedText ? formatText(selectedText, format) : format;
    
    const newMarkdown = 
      markdown.substring(0, start) + 
      newText + 
      markdown.substring(end);
    
    onChange(newMarkdown);
    
    // Restore focus and selection
    textarea.focus();
    const newPosition = start + newText.length;
    textarea.setSelectionRange(newPosition, newPosition);
  }, [markdown, onChange]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center bg-muted px-2 rounded-t-lg border-b">
        <Toolbar onFormat={handleFormat} />
      </div>
      <div className="flex-1 h-full p-4">
        <Textarea
          ref={textareaRef}
          value={markdown}
          onChange={(e) => onChange(e.target.value)}
          name={name}
          id={name}
          className="w-full h-full min-h-[500px] resize-y font-mono"
          placeholder="Enter markdown here..."
        />
      </div>
    </div>
  );
}