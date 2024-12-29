import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Image, 
  Link, 
  Heading2,
  type LucideIcon 
} from "lucide-react";

interface ToolbarItem {
  icon: LucideIcon;
  label: string;
  format: string;
}

export const toolbarItems: ToolbarItem[] = [
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