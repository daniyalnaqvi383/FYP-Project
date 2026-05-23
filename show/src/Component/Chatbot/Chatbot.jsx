import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot } from "lucide-react";
import axios from "axios";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Salam! 👋 Main aapka 'Me.' fashion assistant hoon. Aaj main aapki kya madad kar sakta hoon?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom functionality
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    
    // 1. User ka message screen par add karein
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      // 2. Backend API call
      const res = await axios.post("http://localhost:8030/api/chat", { message: userMessage });
      
      if (res.data.success) {
        // 3. Bot ka reply screen par add karein
        setMessages((prev) => [...prev, { sender: "bot", text: res.data.reply }]);
      }
    } catch (error) {
      console.error("Chatbot frontend error:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Sorry, facing some connection limits. Please try again!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* 🟢 CHAT FLOATING TOGGLE BUBBLE */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#C19A6B] hover:bg-[#a37f55] text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        >
          <MessageSquare size={24} className="group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {/* 🔵 MAIN CHAT WINDOW INTERFACE */}
      {isOpen && (
        <div className="bg-white w-[340px] sm:w-[380px] h-[480px] rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all duration-300">
          
          {/* HEADER BAR LAYER */}
          <div className="bg-black text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-[#C19A6B] p-1.5 rounded-lg text-white">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-none">Me. Assistant</h3>
                <span className="text-[10px] text-green-400 font-medium mt-1 inline-block">Online</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition">
              <X size={18} />
            </button>
          </div>

          {/* MESSAGES LOG VIEWPORT CONTAINER */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-black text-white rounded-tr-none"
                      : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Three Dots Loading Animation Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-2.5 flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-[#C19A6B] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-1.5 h-1.5 bg-[#C19A6B] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-1.5 h-1.5 bg-[#C19A6B] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* INPUT FORM BOUNDARY DISPATCH SECTION */}
          <form onSubmit={handleSendMessage} className="p-3 border-t bg-white flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about sizing, sales, styling..."
              className="w-full bg-gray-50 text-xs sm:text-sm border border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C19A6B] text-black"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-black hover:bg-zinc-800 text-white p-2.5 rounded-xl transition disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </form>
          
        </div>
      )}
    </div>
  );
}