import { useState, useRef, useEffect, useMemo } from "react";
import { X, Send, MessageSquare, Loader2, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestedQuestions = [
  "What's your biggest weakness?",
  "Tell me about a project that failed",
  "Why should we hire you over someone with a tech background?",
  "What would your last manager say about you?",
];

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
}

const ChatDrawer = ({ isOpen, onClose, initialMessage }: ChatDrawerProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey! I'm Mikaela's AI representative. Ask me anything about her experience, skills, or working style. I'll give you honest answers — including the uncomfortable ones.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingInitial, setPendingInitial] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && initialMessage) {
      setPendingInitial(initialMessage);
    }
  }, [isOpen, initialMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || isLoading) return;

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

      // Add empty assistant message
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
                prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: final } : m))
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
        { role: "assistant", content: "Sorry, I had trouble responding. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger initial message after handleSend is available
  useEffect(() => {
    if (pendingInitial && !isLoading) {
      handleSend(pendingInitial);
      setPendingInitial(null);
    }
  }, [pendingInitial]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card border-l border-border flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-body font-semibold text-foreground">Ask AI About Mikaela</p>
              <p className="text-xs text-muted-foreground font-body">Brutally honest answers</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-card">
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
              <div className="bg-secondary px-4 py-3 rounded-2xl rounded-bl-md">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
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
                className="px-3 py-1.5 text-xs font-body text-secondary-foreground bg-secondary rounded-full border border-border/50 hover:text-primary-foreground hover:bg-primary hover:border-primary/30 transition-colors"
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
              className="flex-1 px-4 py-3 bg-secondary rounded-xl text-sm font-body text-secondary-foreground placeholder:text-secondary-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
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
                <strong className="font-semibold text-foreground">{children}</strong>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-outside ml-4 space-y-1">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-outside ml-4 space-y-1">{children}</ol>
              ),
              li: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,
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
              p: ({ children }) => <p className="leading-relaxed mb-2 last:mb-0">{children}</p>,
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
