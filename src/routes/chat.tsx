import { useChat } from "@ai-sdk/react";
import { createFileRoute } from "@tanstack/react-router";
import { DefaultChatTransport } from "ai";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot | Workplace AI" },
      {
        name: "description",
        content:
          "Chat with your workplace AI assistant about emails, meetings, planning, research and day-to-day work questions.",
      },
      { property: "og:title", content: "Workplace AI Chatbot" },
      {
        property: "og:description",
        content: "An interactive workplace copilot for everyday professional questions.",
      },
    ],
  }),
  component: ChatPage,
});

const SUGGESTIONS = [
  "Draft a polite nudge for an overdue invoice",
  "How do I structure a project status update?",
  "Give me an agenda for a 30-minute retro",
];

function ChatPage() {
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status } = useChat({
    transport,
    onError: (error) => toast.error(error.message || "The assistant could not respond."),
  });
  const [input, setInput] = useState("");
  const busy = status === "submitted" || status === "streaming";

  const send = (text: string) => {
    if (!text.trim() || busy) return;
    void sendMessage({ text: text.trim() });
    setInput("");
  };

  return (
    <AppShell
      title="AI Chatbot"
      subtitle="Your interactive workplace assistant — ask anything about your work day."
    >
      <div className="surface-card flex h-[62vh] min-h-[460px] flex-col overflow-hidden">
        <Conversation className="flex-1">
          <ConversationContent className="gap-4">
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<img src={logo} alt="" width={48} height={48} className="size-12" />}
                title="Workplace assistant ready"
                description="Ask a question or pick a starter below."
              >
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-smooth hover:border-primary hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </ConversationEmptyState>
            ) : (
              messages.map((message) => {
                const text = message.parts
                  .map((part) => (part.type === "text" ? part.text : ""))
                  .join("");
                return (
                  <Message key={message.id} from={message.role}>
                    <MessageContent
                      className={
                        message.role === "user"
                          ? "group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground"
                          : "bg-transparent px-0 text-foreground"
                      }
                    >
                      <MessageResponse>{text}</MessageResponse>
                    </MessageContent>
                  </Message>
                );
              })
            )}
            {status === "submitted" && (
              <Shimmer className="px-1 text-sm">Thinking...</Shimmer>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="border-t border-border p-3">
          <PromptInput
            onSubmit={(_message, event) => {
              event.preventDefault();
              send(input);
            }}
          >
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your workplace assistant..."
            />
            <PromptInputFooter className="justify-end">
              <PromptInputSubmit status={status} disabled={!input.trim() && !busy} />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </AppShell>
  );
}
