import ReactMarkdown from "react-markdown";

// import { pages } from "~/server/db/schema";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";



interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        a: ({ node, ...props }) => (
          <a {...props} target="_blank" rel="noopener noreferrer" />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
export default MarkdownRenderer;
