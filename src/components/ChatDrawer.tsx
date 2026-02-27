import { useState, useRef, useEffect } from "react";
import { X, Send, MessageSquare } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestedQuestions = [
  "What's your biggest weakness?",
  "Tell me about a project that failed",
  "Why did you leave Quantum Labs?",
  "What would your last manager say about you?",
];

const mockResponses: Record<string, string> = {
  "What's your biggest weakness?":
    "I tend to over-engineer solutions early on. I've gotten better at shipping MVPs first, but my instinct is still to design for scale before we've validated the idea. I counterbalance this by timboxing my design phase and forcing myself to write a one-pager before any code.",
  "Tell me about a project that failed":
    "At TechFlow, I led an ambitious attempt to build a real-time analytics dashboard from scratch instead of using an existing solution. We spent 3 months building something that Metabase could have handled in a week. The lesson: not-invented-here syndrome is real, and sometimes the best engineering decision is choosing not to build.",
  "Why did you leave Quantum Labs?":
    "I haven't left yet — I'm currently exploring what's next. The honest reason: I've accomplished what I set out to do (the migration is complete, the team is strong), and I'm looking for the next big technical challenge. I want to be somewhere I'm slightly scared of the problem.",
  "What would your last manager say about you?":
    "They'd probably say I'm the person they trust to figure out ambiguous problems, but that I sometimes need to be reminded to celebrate wins instead of immediately moving to the next thing. They once told me: 'You're great at building systems, and you need to get equally good at building yourself up.'",
};

const getResponse = (msg: string): string => {
  const lower = msg.toLowerCase();
  for (const [key, val] of Object.entries(mockResponses)) {
    if (lower.includes(key.toLowerCase().slice(0, 20))) return val;
  }
  return "That's a great question. In a production version, this would connect to an AI model trained on my experience, projects, and perspectives. For now, try one of the suggested questions to see how this works!";
};

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatDrawer = ({ isOpen, onClose }: ChatDrawerProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey! I'm Mikaela's AI representative. Ask me anything about her experience, projects, or working style. I'll give you honest answers — including the uncomfortable ones.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;

    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: getResponse(msg) }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card border-l border-border flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-body font-semibold text-foreground">Ask AI About Mikaela</p>
              <p className="text-xs text-muted-foreground font-body">Honest answers, always</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm font-body leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-secondary text-secondary-foreground rounded-bl-md"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-secondary px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length <= 2 && (
          <div className="px-4 pb-3 flex flex-wrap gap-2">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="px-3 py-1.5 text-xs font-body text-muted-foreground bg-secondary rounded-full border border-border/50 hover:text-foreground hover:border-primary/30 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-3 bg-secondary rounded-xl text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:brightness-110 transition-all disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatDrawer;
