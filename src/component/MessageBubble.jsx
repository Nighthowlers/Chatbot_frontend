import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { Copy } from "lucide-react";
import { useState } from "react";

function MessageBubble({ msg, isLast, loading }) {
  const [copied, setCopied] = useState(false);

  const isUser = msg.sender === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 px-6 py-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-sm">
          🤖
        </div>
      )}

      {/* Message */}
      <div
        className={`max-w-[75%] rounded-2xl p-3 border ${
          isUser
            ? "bg-blue-500 text-black border-blue-400"
            : "bg-white/5 border-white/10 text-white"
        }`}
      >
        {/* Markdown Content */}
        <div className="prose prose-invert max-w-none text-sm">
          <ReactMarkdown
            components={{
              p: ({ children }) => (
                <p className="leading-relaxed">{children}</p>
              ),
              code: ({ inline, children }) => (
                <code
                  className={`${
                    inline
                      ? "bg-black/30 px-1 py-0.5 rounded"
                      : "block bg-black/40 p-3 rounded-lg overflow-x-auto"
                  }`}
                >
                  {children}
                </code>
              ),
            }}
          >
            {msg.text}
          </ReactMarkdown>
        </div>

        {/* Typing cursor */}
        {loading && isLast && !isUser && (
          <span className="animate-pulse ml-1">|</span>
        )}

        {/* Copy Button */}
        {!isUser && msg.text && (
          <button
            onClick={handleCopy}
            className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-white"
          >
            <Copy size={14} />
            {copied ? "Copied ✓" : "Copy"}
          </button>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-black text-sm">
          U
        </div>
      )}
    </motion.div>
  );
}

export default MessageBubble;