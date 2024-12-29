"use client";

import { ToolbarButton } from "./toolbar-button";
import { toolbarItems } from "./toolbar-items";

interface ToolbarProps {
  onFormat: (format: string) => void;
}

export function Toolbar({ onFormat }: ToolbarProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {toolbarItems.map((item) => (
        <ToolbarButton
          key={item.label}
          icon={item.icon}
          label={item.label}
          onClick={() => onFormat(item.format)}
        />
      ))}
    </div>
  );
}