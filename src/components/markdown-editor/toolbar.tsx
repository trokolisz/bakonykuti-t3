"use client";

import { Button } from "~/components/ui/button";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger,
  TooltipProvider 
} from "~/components/ui/tooltip";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Image, 
  Link, 
  Heading2
} from "lucide-react";

interface ToolbarProps {
  onFormat: (format: string) => void;
}

const tools = [
  { icon: Bold, label: "Bold", format: "**text**" },
  { icon: Italic, label: "Italic", format: "*text*" },
  { icon: Heading2, label: "Heading", format: "## " },
  { icon: List, label: "Bullet List", format: "- " },
  { icon: ListOrdered, label: "Numbered List", format: "1. " },
  { icon: Quote, label: "Quote", format: "> " },
  { icon: Code, label: "Code Block", format: "```\ncode\n```" },
  { icon: Image, label: "Image", format: "![alt text](url)" },
  { icon: Link, label: "Link", format: "[text](url)" },
];

export function Toolbar({ onFormat }: ToolbarProps) {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-1 p-2 bg-muted rounded-t-lg border-b">
        {tools.map((tool) => (
          <Tooltip key={tool.label}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFormat(tool.format)}
                className="h-8 w-8 p-0"
              >
                <tool.icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tool.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}