"use client";

// src/app/ai-tutor/AiTutorClient.tsx
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, RotateCcw, Lightbulb, BookOpen, Loader2 } from "lucide-react";
import { FormulaRenderer } from "@/components/physics/FormulaRenderer";

interface Message {
  id:      string;
  role:    "user" | "assistant";
  content: string;
  ts:      Date;
}

const QUICK_PROMPTS = [
  "Explain Newton's Second Law simply",
  "Why does a heavier object not fall faster?",
  "What is the difference between KE and PE?",
  "How does a transformer work?",
  "Explain wave-particle duality",
  "What is entropy in simple terms?",
];

const SYSTEM_PROMPT = `You are PhysicsBondhu (Physics Friend), an expert physics tutor for students from SSC to university level. You explain physics concepts clearly, step-by-step.

Rules:
1. Always explain in a friendly, encouraging tone
2. For problems, NEVER just give the answer — guide step-by-step
3. Use LaTeX for formulas (wrap in $...$ for inline, $$...$$ for block)
4. Give real-world examples to build intuition
5. If a student seems stuck, give a hint rather than the full solution
6. Keep responses concise but complete — aim for clarity over length
7. Respond in English. If the student writes in Bengali, respond in Bengali.
8. After solving, always check: "Does this make physical sense?"
9. Point out common misconceptions when relevant`;

function parseContent(text: string) {
  // Split on $...$ and $$...$$ for formula rendering
  const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g);
  return parts.map((part, i) => {
    if (part.startsWith("$$") && part.endsWith("$$")) {
      return <div key={i} className="my-2 overflow-x-auto">
        <FormulaRenderer latex={part.slice(2, -2).trim()} block />
      </div>;
    }
    if (part.startsWith("$") && part.endsWith("$")) {
      return <FormulaRenderer key={i} latex={part.slice(1, -1).trim()} />;
    }
    // Handle **bold** and newlines
    return <span key={i}>{part.split("\n").map((line, j) => (
      <span key={j}>
        {line.split(/(\*\*[^*]+\*\*)/).map((seg, k) =>
          seg.startsWith("**") && seg.endsWith("**")
            ? <strong key={k}>{seg.slice(2, -2)}</strong>
            : <span key={k}>{seg}</span>
        )}
        {j < part.split("\n").length - 1 && <br />}
      </span>
    ))}</span>;
  });
}

export function AiTutorClient() {
  const [messages,  setMessages]  = useState<Message[]>([]);
  const [input,     setInput]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    setError(null);

    const userMsg: Message = {
      id: Date.now().toString(), role: "user", content: text.trim(), ts: new Date(),
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model:      "claude-sonnet-4-6",
          max_tokens: 1000,
          system:     SYSTEM_PROMPT,
          messages:   newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      const text = data.content?.map((b: any) => b.text ?? "").join("") ?? "No response";

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(), role: "assistant", content: text, ts: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setError(err.message ?? "Failed to get response. Please try again.");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [messages, loading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-bg)" }}>
      {/* Header */}
      <div className="border-b px-4 py-4 flex items-center justify-between"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: "linear-gradient(135deg, #0090f010, #7c4ef510)", border: "1px solid rgba(0,144,240,0.2)" }}>
            🤖
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
              AI Physics Tutor
            </p>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              Powered by Claude · Always learning with you
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={() => setMessages([])}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors hover:bg-[var(--color-surface-2)]"
            style={{ color: "var(--color-text-muted)" }}>
            <RotateCcw size={12} /> New Chat
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-3xl mx-auto w-full">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 space-y-6"
          >
            <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl"
              style={{ background: "linear-gradient(135deg, rgba(0,144,240,0.1), rgba(124,78,245,0.1))", border: "1px solid rgba(0,144,240,0.2)" }}>
              ⚛️
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold"
                style={{ color: "var(--color-text-primary)" }}>
                Hello! I am your Physics Tutor.
              </h2>
              <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
                Ask me anything about physics — I will explain concepts, solve problems step-by-step, and help you understand deeply.
              </p>
            </div>

            {/* Quick prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
              {QUICK_PROMPTS.map((prompt) => (
                <button key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="flex items-start gap-2 p-3 rounded-xl border text-left text-sm transition-all hover:scale-[1.01]"
                  style={{ background: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
                  <Lightbulb size={14} style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: 1 }} />
                  {prompt}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm ${
                msg.role === "user" ? "" : ""
              }`}
                style={{
                  background: msg.role === "user"
                    ? "linear-gradient(135deg, #0090f0, #7c4ef5)"
                    : "var(--color-surface-2)",
                  border: msg.role === "assistant" ? "1px solid var(--color-border)" : "none",
                }}>
                {msg.role === "user"
                  ? <User size={14} color="white" />
                  : <Bot size={14} style={{ color: "var(--color-primary)" }} />
                }
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm"
                }`}
                style={{
                  background:  msg.role === "user" ? "linear-gradient(135deg, #0090f0, #7c4ef5)" : "var(--color-surface)",
                  color:       msg.role === "user" ? "#fff" : "var(--color-text-primary)",
                  border:      msg.role === "assistant" ? "1px solid var(--color-border)" : "none",
                }}
              >
                {msg.role === "assistant"
                  ? <div className="space-y-1">{parseContent(msg.content)}</div>
                  : msg.content
                }
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
              <Bot size={14} style={{ color: "var(--color-primary)" }} />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm border flex items-center gap-2"
              style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
              <Loader2 size={14} className="animate-spin" style={{ color: "var(--color-primary)" }} />
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>Thinking...</span>
            </div>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <div className="px-4 py-3 rounded-xl text-sm"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444" }}>
            ⚠️ {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t px-4 py-4"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        <div className="max-w-3xl mx-auto flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about any physics concept, formula, or problem..."
              rows={1}
              className="w-full px-4 py-3 rounded-2xl border text-sm outline-none resize-none"
              style={{
                background:  "var(--color-surface-2)",
                borderColor: "var(--color-border)",
                color:       "var(--color-text-primary)",
                maxHeight:   "120px",
              }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
              }}
              onFocus={(e) => { (e.target as HTMLElement).style.borderColor = "var(--color-primary)"; }}
              onBlur={(e)  => { (e.target as HTMLElement).style.borderColor = "var(--color-border)"; }}
            />
          </div>
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all hover:scale-105 disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #0090f0, #7c4ef5)" }}
          >
            <Send size={16} color="white" />
          </button>
        </div>
        <p className="text-xs text-center mt-2" style={{ color: "var(--color-text-muted)" }}>
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
