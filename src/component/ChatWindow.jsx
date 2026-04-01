import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send } from "lucide-react";
import MessageBubble from "./MessageBubble";

function ChatWindow({ mode }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const containerRef = useRef(null);

  // ✅ Detect scroll position
  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    const nearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 100;

    setIsAtBottom(nearBottom);
  };

  // Backend URL (fallback to production when VITE_API_URL is not set)
  const API_URL = import.meta.env.VITE_API_URL || "https://chatbot-backend-mrnh.onrender.com";

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input.trim();
    setLoading(true);
    setError("");git 

    const userMessage = { sender: "user", text: userText };
    setMessages((prev) => [...prev, userMessage, { sender: "assistant", text: "", id: "pending" }]);
    setInput("");

    try {
      const response = await axios.post(`${API_URL}/bot/v1/message`, {
        text: userText,
        mode: mode
      });

      const botText = response.data?.botMessage;
      console.log("API Response received:", { botText, fullData: response.data });
      
      if (!botText) {
        throw new Error("Empty response from backend");
      }

      setLoading(false);
      setIsStreaming(true);

      // Stream the response character by character
      let charIndex = 0;
      console.log("Starting stream with text length:", botText.length);
      
      const streamInterval = setInterval(() => {
        charIndex++;
        console.log("Streaming char:", charIndex);
        
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === "pending"
              ? { ...msg, text: botText.slice(0, charIndex) }
              : msg
          )
        );

        if (charIndex >= botText.length) {
          console.log("Stream complete");
          clearInterval(streamInterval);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === "pending"
                ? { sender: "assistant", text: botText }
                : msg
            )
          );
          setIsStreaming(false);
        }
      }, 15);

    } catch (err) {
      console.error("ChatWindow sendMessage error:", err);
      setError("Failed to fetch response from backend. Check server status and CORS.");
      setMessages((prev) => prev.filter((msg) => !(msg.sender === "assistant" && msg.id === "pending")));
      setLoading(false);
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ✅ Auto scroll ONLY if at bottom
  useEffect(() => {
    if (isAtBottom) {
      containerRef.current?.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col relative h-0 min-h-0">

      {/* Chat Area */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-6 py-10 min-h-0"
      >
        {error && (
          <div className="text-red-400 text-center mb-4">{error}</div>
        )}

        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">

            <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-6">
              ✨
            </div>

            <h1 className="text-3xl font-semibold mb-3">
              How can I help you today?
            </h1>

            <p className="text-gray-400 max-w-xl">
              Ask for code, brainstorm ideas, or refine responses.
            </p>

          </div>
        ) : (
            messages.map((msg, i) => (
            <MessageBubble
                key={i}
                msg={msg}
                isLast={i === messages.length - 1}
                loading={isStreaming && msg.sender === "assistant" && i === messages.length - 1}
            />
            ))
        )}
      </div>

      {/* Scroll to bottom button */}
      {!isAtBottom && (
        <button
          onClick={() =>
            containerRef.current.scrollTo({
              top: containerRef.current.scrollHeight,
              behavior: "smooth",
            })
          }
          className="absolute bottom-24 right-6 bg-white/10 px-3 py-1 rounded-full text-xs"
        >
          ↓ New Messages
        </button>
      )}

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-[#020617]">
        <div className="max-w-3xl mx-auto flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3">

          <textarea
            className="flex-1 bg-transparent outline-none resize-none"
            placeholder="Send a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            rows={1}
          />

          <button
            onClick={sendMessage}
            disabled={loading || isStreaming || !input.trim()}
            className="ml-2 flex items-center justify-center p-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-blue-500 disabled:hover:to-blue-600 shadow-lg hover:shadow-blue-500/50 active:scale-95"
            title={input.trim() ? "Send message (Enter)" : "Type a message to send"}
          >
            {loading || isStreaming ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>

        </div>
      </div>

    </div>
  );
}

export default ChatWindow;