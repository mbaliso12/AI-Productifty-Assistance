import { createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { useState } from "react";
import { AiOutputCard } from "@/components/AiOutputCard";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAiTool } from "@/lib/use-ai-tool";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | Workplace AI" },
      {
        name: "description",
        content:
          "Generate professional workplace emails with a chosen tone, then edit, copy and regenerate the draft.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "AI-drafted professional emails with formal, friendly or persuasive tone.",
      },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Formal", "Friendly", "Persuasive"] as const;

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [points, setPoints] = useState("");
  const [tone, setTone] = useState<(typeof TONES)[number]>("Formal");
  const { output, setOutput, loading, run } = useAiTool("email");

  const submit = () =>
    run(
      `Recipient: ${recipient}\nPurpose: ${purpose}\nKey points:\n${points}\nTone: ${tone}\n\nWrite the email.`,
    );

  return (
    <AppShell
      title="Smart Email Generator"
      subtitle="Describe the message and let AI draft a professional email you can edit before sending."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
        <section className="surface-card space-y-4 p-5">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              placeholder="e.g. Thandi Nkosi, Head of Operations"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Input
              id="purpose"
              placeholder="e.g. Request a project deadline extension"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="points">Key points</Label>
            <Textarea
              id="points"
              rows={6}
              placeholder={"One point per line\n- Delay caused by vendor\n- New date: 30 Sept"}
              value={points}
              onChange={(e) => setPoints(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Tone</Label>
            <div className="grid grid-cols-3 gap-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={
                    t === tone
                      ? "rounded-xl gradient-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
                      : "rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground transition-smooth hover:border-primary hover:text-foreground"
                  }
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <Button className="w-full" onClick={submit} disabled={loading}>
            <Send className="mr-2 size-4" />
            {loading ? "Generating..." : "Generate email"}
          </Button>
        </section>

        <AiOutputCard
          title="Generated email"
          value={output}
          onChange={setOutput}
          onRegenerate={submit}
          loading={loading}
          emptyHint="Fill in the recipient, purpose and key points, then generate a draft. You can edit it in place before copying."
        />
      </div>
    </AppShell>
  );
}
