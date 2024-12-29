"use client";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { ScrollArea } from "~/components/ui/scroll-area";

interface PreviewProps {
  markdown: string;
}

export function Preview({ markdown }: PreviewProps) {
  // Clean up extra newlines before tables while preserving other formatting
  const processedMarkdown = markdown.replace(/\n+(\|[^\n]*\|[^\n]*)\n/g, '\n$1\n');

  return (
    <ScrollArea className="h-full">
      <div className="p-4 markdown-preview">
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            table({ node, ...props }) {
              return <table {...props} className="my-4" />;
            },
            td({ node, ...props }) {
              return <td {...props} className="border border-border p-2" />;
            },
            th({ node, ...props }) {
              return <th {...props} className="border border-border p-2 font-bold bg-muted" />;
            }
          }}
        >
          {processedMarkdown}
        </ReactMarkdown>
      </div>
    </ScrollArea>
  );
}