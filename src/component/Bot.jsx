// import React, { useState, useRef, useEffect } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import ReactMarkdown from "react-markdown";

// function Bot() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [mode, setMode] = useState("normal");

//   const endRef = useRef(null);

//   useEffect(() => {
//     endRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSubmit = async () => {
//     if (!input.trim()) return;

//     setLoading(true);
//     setError(null);

//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_API_URL}/bot/v1/message`,
//         {
//           text: input,
//           mode: mode
//         }
//       );

//       const botText = response.data.botMessage;

//       if (!botText) {
//         setLoading(false);
//         setError("No response from AI");
//         return;
//       }

//       // Add user + empty bot message
//       setMessages(prev => [
//         ...prev,
//         { text: input, sender: "user" },
//         { text: "", sender: "bot" }
//       ]);

//       setInput("");

//       // Streaming effect
//       let index = 0;

//       const interval = setInterval(() => {
//         index++;

//         setMessages(prev => {
//           const updated = [...prev];

//           updated[updated.length - 1] = {
//             ...updated[updated.length - 1],
//             text: botText.slice(0, index)
//           };

//           return updated;
//         });

//         if (index >= botText.length) {
//           clearInterval(interval);
//           setLoading(false);
//         }
//       }, 15);

//     } catch (err) {
//       console.error(err);
//       setLoading(false);
//       setError("AI is currently unavailable");
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       handleSubmit();
//     }
//   };

//   return (
//     <div className="flex h-screen bg-[#0f172a] text-white">

//       {/* Sidebar */}
//       <div className="w-64 bg-[#020617] border-r border-white/10 p-4 hidden md:flex flex-col">
//         <h2 className="text-lg font-semibold mb-4">🤖 BotSpoof</h2>

//         <button className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-sm mb-3">
//           + New Chat
//         </button>

//         <div className="text-gray-400 text-sm mt-4">
//           <p>Recent chats</p>
//         </div>
//       </div>

//       {/* Main */}
//       <div className="flex-1 flex flex-col">

//         {/* Header */}
//         <div className="p-4 border-b border-white/10 flex justify-between">
//           <h1 className="font-semibold">BotSpoof AI</h1>

//           <div className="flex gap-2">
//             {["normal", "interview", "coding"].map(m => (
//               <button
//                 key={m}
//                 onClick={() => setMode(m)}
//                 className={`px-3 py-1 rounded-full text-sm ${
//                   mode === m
//                     ? "bg-green-500 text-black"
//                     : "bg-white/10 text-gray-300"
//                 }`}
//               >
//                 {m}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Chat Area */}
//         <div className="flex-1 overflow-y-auto">

//           {error && (
//             <div className="text-red-400 text-center mt-3">{error}</div>
//           )}

//           {messages.length === 0 ? (
//             <div className="text-center mt-32">
//               <h1 className="text-4xl font-bold">BotSpoof AI</h1>
//               <p className="text-gray-400 mt-2">
//                 Ask anything. Learn everything.
//               </p>
//             </div>
//           ) : (
//             messages.map((msg, idx) => (
//               <motion.div
//                 key={idx}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="flex gap-3 px-6 py-4"
//               >
//                 {/* Avatar */}
//                 <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10">
//                   {msg.sender === "user" ? "🧑" : "🤖"}
//                 </div>

//                 {/* Message */}
//                 <div className="flex-1">
//                   <p className="text-xs text-gray-400 mb-1">
//                     {msg.sender === "user" ? "You" : "BotSpoof"}
//                   </p>

//                   <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
  
//                     <div className="prose prose-invert max-w-none text-sm">
//                       <ReactMarkdown
//                         components={{
//                           p: ({children}) => <p className="text-sm leading-relaxed">{children}</p>,
//                           code: ({children}) => (
//                             <code className="bg-black/30 px-1 py-0.5 rounded">
//                               {children}
//                             </code>
//                           )
//                         }}
//                       >
//                         {msg.text}
//                       </ReactMarkdown>
//                     </div>

//                     {loading && idx === messages.length - 1 && (
//                       <span className="animate-pulse">|</span>
//                     )}
//                   </div>

//                   <button
//                     onClick={() => navigator.clipboard.writeText(msg.text)}
//                     className="text-xs text-gray-500 mt-1"
//                   >
//                     Copy
//                   </button>
//                 </div>
//               </motion.div>
//             ))
//           )}

//           <div ref={endRef} />
//         </div>

//         {/* Input */}
//         <div className="p-4 border-t border-white/10 bg-[#020617]">
//           <div className="max-w-3xl mx-auto">

//             <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
//               <textarea
//                 rows={1}
//                 className="flex-1 bg-transparent outline-none resize-none text-white"
//                 placeholder="Send a message..."
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={handleKeyPress}
//               />

//               <button
//                 onClick={handleSubmit}
//                 disabled={loading}
//                 className="ml-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-black"
//               >
//                 Send
//               </button>
//             </div>

//             <p className="text-xs text-gray-500 text-center mt-2">
//               AI may produce incorrect responses
//             </p>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Bot;