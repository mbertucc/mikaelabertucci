import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { X, Send, MessageSquare, Loader2, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Organized by topic so we can rotate contextually
const questionSets = {
  initial: [
    "What's your biggest weakness?",
    "Tell me about a project that failed",
    "Why should we hire you over someone with a tech background?",
    "What would your last manager say about you?",
  ],
  aiFramework: [
    "How do you use AI in your daily work?",
    "What does your AI framework actually save you?",
    "Shall I share more details about my AI framework?",
  ],
  projects: [
    "Tell me about the STRR project",
    "What was your hardest project?",
    "How do you handle complex projects?",
  ],
  leadership: [
    "What's your approach to team leadership?",
    "How do you build high-performing teams?",
    "Tell me about a team transformation you led",
  ],
  role: [
    "What makes you different from other Product Owners?",
    "How do you manage 3 registries at once?",
    "What's your product strategy approach?",
  ],
  results: [
    "What concrete results have you delivered?",
    "Can you share specific metrics?",
    "What would you do in your first 90 days?",
  ],
};

// Pick suggestions based on what hasn't been asked yet
function getNextSuggestions(askedQuestions: Set<string>, messageCount: number): string[] {
  const allSets = Object.values(questionSets);

  // First load: show initial set
  if (messageCount <= 1) {
    return questionSets.initial;
  }

  // Collect all unanswered questions across all sets
  const unanswered: string[] = [];
  for (const set of allSets) {
    for (const q of set) {
      if (!askedQuestions.has(q)) {
        unanswered.push(q);
      }
    }
  }

  if (unanswered.length === 0) return [];

  // Pick up to 3 from different categories to keep variety
  const picked: string[] = [];
  const usedSets = new Set<number>();

  for (let i = 0; i < allSets.length && picked.length < 3; i++) {
    const setIdx = (messageCount + i) % allSets.length;
    if (usedSets.has(setIdx)) continue;
    const available = allSets[setIdx].filter((q) => !askedQuestions.has(q));
    if (available.length > 0) {
      picked.push(available[0]);
      usedSets.add(setIdx);
    }
  }

  return picked;
}

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
}

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "Burning the midnight oil? I respect that. 🌙";
  if (hour < 12) return "Good morning! ☀️ Coffee in hand, let's talk.";
  if (hour < 17) return "Good afternoon! What can I help you with?";
  if (hour < 21) return "Good evening! 🌆 Still getting things done — I like your energy.";
  return "Working late? Same. Let's make it count. 🌙";
}

const INITIAL_GREETING: Message = {
  role: "assistant",
  content:
    `${getTimeGreeting()}\n\nI'm Mikaela. I build environments where people genuinely want to show up and do great work — and I use AI to cut through the noise so my teams can focus on what actually matters.\n\nI lead with clarity, ship with velocity, and I'm not afraid to be direct about what I bring to the table.\n\nWhat would you like to know?`,
};

const ChatDrawer = ({ isOpen, onClose, initialMessage }: ChatDrawerProps) => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_GREETING]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingInitial, setPendingInitial] = useState<string | null>(null);
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && initialMessage) {
      setPendingInitial(initialMessage);
    }
  }, [isOpen, initialMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(
    async (text?: string) => {
      const msg = text || input.trim();
      if (!msg || isLoading) return;

      // Track asked questions for suggestion rotation
      setAskedQuestions((prev) => new Set(prev).add(msg));

      const userMsg: Message = { role: "user", content: msg };
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setInput("");
      setIsLoading(true);

      try {
        const resp = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ messages: newMessages }),
          }
        );

        if (!resp.ok || !resp.body) {
          throw new Error("Stream failed");
        }

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let assistantContent = "";

        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let newlineIdx: number;
          while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
            let line = buffer.slice(0, newlineIdx);
            buffer = buffer.slice(newlineIdx + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") break;
            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                assistantContent += content;
                const final = assistantContent;
                setMessages((prev) =>
                  prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: final } : m
                  )
                );
              }
            } catch {
              buffer = line + "\n" + buffer;
              break;
            }
          }
        }
      } catch (e) {
        console.error("Chat error:", e);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I had trouble responding. Please try again.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, input, isLoading]
  );

  useEffect(() => {
    if (pendingInitial && !isLoading) {
      handleSend(pendingInitial);
      setPendingInitial(null);
    }
  }, [pendingInitial, handleSend, isLoading]);

  const suggestions = useMemo(
    () => getNextSuggestions(askedQuestions, messages.length),
    [askedQuestions, messages.length]
  );

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card border-l border-border flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-body font-semibold text-foreground">
                Ask AI About Mikaela
              </p>
              <p className="text-xs text-muted-foreground font-body">
                Brutally honest answers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-card"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm font-body leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted/20 text-foreground rounded-bl-md"
                }`}
              >
                {msg.role === "assistant" ? (
                  <AssistantMessage content={msg.content} />
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex justify-start">
              <div className="bg-muted/20 px-4 py-3 rounded-2xl rounded-bl-md">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions — always visible when not loading */}
        {!isLoading && suggestions.length > 0 && (
          <div className="px-4 pb-3 flex flex-wrap gap-2">
            {suggestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="px-3 py-1.5 text-xs font-body text-foreground bg-card border border-border hover:text-primary-foreground hover:bg-primary hover:border-primary/30 transition-colors rounded-full"
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
              className="flex-1 px-4 py-3 bg-card border border-border rounded-xl text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
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

/* Renders assistant markdown with callout boxes for brutal honesty statements */
const CALLOUT_PATTERNS = [
  /I[''\u2019]m probably not your person/i,
  /not your person/i,
  /underutilizing my/i,
  /built for teams moving toward/i,
  /built for high-velocity/i,
  /If you want a Product Owner who spends/i,
];

function AssistantMessage({ content }: { content: string }) {
  const segments = useMemo(() => {
    const lines = content.split("\n");
    const result: { type: "md" | "callout"; text: string }[] = [];
    let currentMd: string[] = [];

    const flushMd = () => {
      if (currentMd.length > 0) {
        result.push({ type: "md", text: currentMd.join("\n") });
        currentMd = [];
      }
    };

    for (const line of lines) {
      if (CALLOUT_PATTERNS.some((p) => p.test(line))) {
        flushMd();
        result.push({ type: "callout", text: line });
      } else {
        currentMd.push(line);
      }
    }
    flushMd();
    return result;
  }, [content]);

  return (
    <div className="chat-markdown space-y-3">
      {segments.map((seg, i) =>
        seg.type === "callout" ? (
          <div
            key={i}
            className="flex items-start gap-2 rounded-lg border border-[hsl(var(--amber-warm)/0.3)] bg-[hsl(var(--amber-warm)/0.1)] text-foreground text-xs leading-relaxed"
          >
            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[hsl(var(--amber-warm))]" />
            <span>{seg.text}</span>
          </div>
        ) : (
          <ReactMarkdown
            key={i}
            components={{
              h3: ({ children }) => (
                <h3 className="text-xs font-semibold uppercase tracking-wider text-primary mt-3 mb-1.5">
                  {children}
                </h3>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-foreground">
                  {children}
                </strong>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-outside ml-4 space-y-1">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-outside ml-4 space-y-1">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-sm leading-relaxed">{children}</li>
              ),
              code: ({ children, className }) => {
                const isBlock = className?.includes("language-");
                return isBlock ? (
                  <pre className="bg-background/50 rounded-md p-2 overflow-x-auto text-xs my-2">
                    <code>{children}</code>
                  </pre>
                ) : (
                  <code className="bg-background/50 text-primary px-1 py-0.5 rounded text-xs font-mono">
                    {children}
                  </code>
                );
              },
              p: ({ children }) => (
                <p className="leading-relaxed mb-2 last:mb-0">{children}</p>
              ),
            }}
          >
            {seg.text}
          </ReactMarkdown>
        )
      )}
    </div>
  );
}

export default ChatDrawer;
