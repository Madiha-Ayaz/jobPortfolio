// This file has been deprecated. The single agentic chatbot is now
// in src/components/agent/AgentOrb.tsx + AgentPanel.tsx and uses
// the OpenRouter API (with fallback to local pattern matching).
export {};


type Message = {
  sender: "user" | "bot";
  text: string;
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          sender: "bot",
          text: "Hello! I'm your Gemini-powered AI assistant. How can I help you today?",
        },
      ]);
    }
  }, [isOpen, messages.length]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInput("");
    setIsLoading(true);

    try {
      console.log('Sending message to /api/chat...');
      
      const resp = await fetch('http://localhost:3001/api/chat', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      console.log('Response status:', resp.status);

      if (!resp.ok) {
        const errorText = await resp.text();
        console.error('Error response:', errorText);
        throw new Error(`Server error: ${resp.status}`);
      }

      const data = await resp.json();
      console.log('Response data:', data);
      
      const botText = data?.reply || "(no reply)";
      setMessages((prev) => [...prev, { sender: "bot", text: botText }]);
    } catch (e: any) {
      console.error("Chat error:", e);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Error: " + (e?.message || "Failed to connect. Please make sure the server is running."),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-16 h-16 bg-accent text-white rounded-full shadow-xl flex items-center justify-center transition hover:scale-110 z-50 ${
          isOpen ? "hidden" : "block"
        }`}
      >
        <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8" />
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[calc(100%-3rem)] max-w-sm h-[70vh] max-h-[500px] bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col z-50">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-6 h-6 text-accent" />
              <h3 className="text-lg font-bold text-white">AI Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <XMarkIcon className="w-6 h-6 text-gray-400 hover:text-white" />
            </button>
          </div>

          <div
            ref={chatRef}
            className="flex-1 p-4 overflow-y-auto space-y-4 text-white"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                    msg.sender === "user"
                      ? "bg-accent text-white rounded-br-none"
                      : "bg-gray-700 text-gray-100 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 px-4 py-2 rounded-2xl">
                  <span className="text-accent animate-pulse">Typing…</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-700">
            <div className="relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask me anything..."
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-full pr-12 focus:ring-2 focus:ring-accent outline-none"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent w-9 h-9 rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-dark transition-colors"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
