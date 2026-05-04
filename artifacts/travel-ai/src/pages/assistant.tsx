import React, { useState, useEffect, useRef } from "react";
import { useAiChat, useGetChatHistory } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Assistant() {
  const [input, setInput] = useState("");
  const queryClient = useQueryClient();
  const { data: history, isLoading } = useGetChatHistory({});
  const chatMutation = useAiChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, chatMutation.isPending]);

  const handleSend = () => {
    if (!input.trim()) return;
    const msg = input;
    setInput("");
    chatMutation.mutate(
      { data: { message: msg } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getChatHistory"] });
        },
      }
    );
  };

  const suggestions = [
    "Book a flight to NYC next week",
    "What are the visa requirements for Japan?",
    "Show me hotels near my next meeting",
    "What should I pack for London in November?",
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-100px)] flex flex-col pb-6">
      <div className="flex-none mb-6">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Bot className="h-8 w-8 text-primary" /> Voyage Assistant
        </h1>
        <p className="text-muted-foreground mt-1">Your 24/7 corporate travel concierge.</p>
      </div>

      <Card className="flex-1 bg-card border-card-border flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px] pointer-events-none" />

        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
          {/* Welcome Message */}
          <div className="flex gap-4 max-w-[80%]">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center shrink-0">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="bg-muted/50 p-4 rounded-2xl rounded-tl-sm border border-border">
              <p className="text-sm">Hello. I'm your AI travel assistant. I can help you book flights, manage itinerary changes, answer policy questions, or handle disruptions. How can I assist you today?</p>
            </div>
          </div>

          {isLoading && (
            <div className="flex gap-4 max-w-[80%]">
              <div className="h-8 w-8 rounded bg-muted flex items-center justify-center shrink-0 animate-pulse" />
              <div className="bg-muted/50 p-4 rounded-2xl rounded-tl-sm border border-border w-48 h-12 animate-pulse" />
            </div>
          )}

          {history?.map((msg) => (
            <div key={msg.id} className={`flex gap-4 max-w-[80%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}>
              <div className={`h-8 w-8 rounded flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"}`}>
                {msg.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
              </div>
              <div className={`p-4 rounded-2xl border ${msg.role === "user" ? "bg-primary/20 border-primary/30 rounded-tr-sm" : "bg-muted/50 border-border rounded-tl-sm"}`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {chatMutation.isPending && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 max-w-[80%]"
            >
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center shrink-0">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="bg-muted/50 p-4 rounded-2xl rounded-tl-sm border border-border flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm text-muted-foreground animate-pulse">Thinking...</span>
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="flex-none p-4 bg-background border-t border-border z-10 relative">
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setInput(s)}
                className="text-xs bg-muted hover:bg-muted/80 text-muted-foreground px-3 py-1.5 rounded-full border border-border transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Ask me anything about your travel..."
              className="bg-muted/50 border-border h-12"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || chatMutation.isPending}
              className="h-12 w-12 px-0 bg-primary hover:bg-primary/90 shrink-0"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
