export function formatText(text: string, format: string): string {
  // Handle lists (both ordered and unordered)
  if (format === "- " || format === "1. ") {
    return text
      .split('\n')
      .map((line, index) => {
        if (!line.trim()) return line;
        if (format === "1. ") {
          return `${index + 1}. ${line}`;
        }
        return `- ${line}`;
      })
      .join('\n');
  }

  // Handle blockquotes
  if (format === "> ") {
    return text
      .split('\n')
      .map(line => line.trim() ? `> ${line}` : line)
      .join('\n');
  }

  // Handle code blocks
  if (format === "```\ncode\n```") {
    return "```\n" + text + "\n```";
  }

  // Handle headings
  if (format === "## ") {
    return text
      .split('\n')
      .map(line => line.trim() ? `## ${line}` : line)
      .join('\n');
  }

  // Handle inline formatting (bold, italic)
  const placeholder = "text";
  const selectedText = text.trim();
  
  // Check if text is already formatted
  if (format === "**text**" && text.startsWith("**") && text.endsWith("**")) {
    return text.slice(2, -2); // Remove formatting
  }
  if (format === "*text*" && text.startsWith("*") && text.endsWith("*")) {
    return text.slice(1, -1); // Remove formatting
  }

  return format.replace(placeholder, selectedText);
}