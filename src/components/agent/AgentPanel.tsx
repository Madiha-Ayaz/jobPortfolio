import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAgent } from '../../context/useAgent';

const QUICK_ACTIONS = [
  { label: 'Show Projects', icon: '??', action: 'show me your projects' },
  { label: 'Go to About', icon: '??', action: 'go to about' },
  { label: 'Open Contact', icon: '??', action: 'open contact' },
  { label: 'Toggle Theme', icon: '??', action: 'toggle theme' },
  { label: 'Read Blog', icon: '??', action: 'show blog' },
  { label: 'Where am I?', icon: '??', action: 'where am i' },
];

const TOOL_LABELS: Record<string, string> = {
  navigate: 'Navigate',
  scrollTo: 'Scroll',
  openProject: 'Open project',
  openBlogPost: 'Open post',
  highlightElement: 'Highlight',
  openContactForm: 'Contact',
  toggleTheme: 'Theme',
};

export default function AgentPanel() {
  const { messages, sendMessage, isThinking, toggleListening, isListening, currentLocation, setIsOpen, setIsVisible, clearMessages } = useAgent();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;
    const text = input;
    setInput('');
    await sendMessage(text);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      transition={{ type: 'spring', damping: 20 }}
      className="fixed bottom-32 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-10rem)] bg-slate-900/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
    >
      <div className="flex items-center justify-between p-4 border-b border-purple-500/20 bg-gradient-to-r from-purple-900/50 to-indigo-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg">??</div>
          <div>
            <h3 className="text-white font-semibold text-sm">Portfolio Agent</h3>
            <p className="text-purple-300 text-xs">On: {currentLocation}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={clearMessages} className="w-7 h-7 rounded-full hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center text-sm" title="Clear chat">?</button>
          <button onClick={() => setIsVisible(false)} className="w-7 h-7 rounded-full hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center text-sm" title="Hide orb">-</button>
          <button onClick={() => setIsOpen(false)} className="w-7 h-7 rounded-full hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center text-sm" title="Close">?</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-sm' : 'bg-slate-800/80 text-slate-100 rounded-bl-sm border border-slate-700'}`}>
              <p>{msg.text}</p>
              {msg.toolCalls && msg.toolCalls.length > 0 && (
                <div className="mt-2 pt-2 border-t border-white/20 flex flex-wrap gap-1">
                  {msg.toolCalls.map((tc, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-white/20 rounded-full">? {TOOL_LABELS[tc.name]}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-slate-800/80 border border-slate-700 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 py-2 border-t border-purple-500/20 flex gap-2 overflow-x-auto">
        {QUICK_ACTIONS.map((qa) => (
          <button
            key={qa.label}
            onClick={() => sendMessage(qa.action)}
            disabled={isThinking}
            className="flex-shrink-0 px-3 py-1.5 text-xs bg-slate-800/60 hover:bg-slate-700/60 text-slate-200 rounded-full border border-slate-700 transition-colors disabled:opacity-50"
          >
            <span className="mr-1">{qa.icon}</span>{qa.label}
          </button>
        ))}
      </div>

      <div className="p-3 border-t border-purple-500/20 bg-slate-900/50 flex gap-2">
        <button
          onClick={toggleListening}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}
          title={isListening ? 'Stop listening' : 'Voice input'}
        >
          ??
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask me to navigate, open projects..."
          disabled={isThinking}
          className="flex-1 bg-slate-800 text-white placeholder-slate-400 px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={isThinking || !input.trim()}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center disabled:opacity-50 hover:scale-105 transition-transform"
          title="Send"
        >
          ?
        </button>
      </div>
    </motion.div>
  );
}
