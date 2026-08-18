import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Gavel, ListChecks, Timer, Wand2 } from "lucide-react";
import { useMemo, useState } from "react";
import { AiOutputCard } from "@/components/AiOutputCard";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAiTool } from "@/lib/use-ai-tool";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | Workplace AI" },
      {
        name: "description",
        content:
          "Paste long meeting notes and get a concise summary with decisions, action items, deadlines and key discussion points.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      {
        property: "og:description",
        content: "Turn raw meeting notes into decisions, action items and deadlines.",
      },
    ],
  }),
  component: MeetingsPage,
});

const SECTIONS = [
  { key: "Summary", icon: Wand2 },
  { key: "Key Discussion Points", icon: ListChecks },
  { key: "Decisions Made", icon: Gavel },
  { key: "Action Items", icon: CheckCircle2 },
  { key: "Deadlines", icon: Timer },
] as const;

function extractSection(markdown: string, heading: string) {
  const pattern = new RegExp(`##\\s*${heading}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`, "i");
  return markdown.match(pattern)?.[1]?.trim() ?? "";
}

function MeetingsPage() {
  const [notes, setNotes] = useState("");
  const { output, setOutput, loading, run } = useAiTool("meeting");

  const submit = () => run(`Meeting notes:\n${notes}`);

  const cards = useMemo(
    () =>
      SECTIONS.map((s) => ({ ...s, body: extractSection(output, s.key) })).filter((s) => s.body),
    [output],
  );

  return (
    <AppShell
      title="Meeting Notes Summarizer"
      subtitle="Turn messy notes into a structured record of what was decided and what happens next."
    >
      <div className="space-y-6">
        <section className="surface-card space-y-3 p-5">
          <Label htmlFor="notes">Meeting notes</Label>
          <Textarea
            id="notes"
            rows={10}
            placeholder="Paste the full transcript or your raw notes here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <Button onClick={submit} disabled={loading}>
            <Wand2 className="mr-2 size-4" />
            {loading ? "Summarising..." : "Summarise meeting"}
          </Button>
        </section>

        {cards.length > 0 && (
          <section className="grid gap-4 md:grid-cols-2">
            {cards.map((c) => (
              <div key={c.key} className="surface-card p-5">
                <div className="mb-2 flex items-center gap-2">
                  <c.icon className="size-4 text-primary" />
                  <h3 className="text-sm font-semibold">{c.key}</h3>
                </div>
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-muted-foreground">
                  {c.body}
                </pre>
              </div>
            ))}
          </section>
        )}

        <AiOutputCard
          title="Full summary"
          value={output}
          onChange={setOutput}
          onRegenerate={submit}
          loading={loading}
          emptyHint="Paste your meeting notes above to extract a summary, decisions, action items and deadlines."
        />
      </div>
    </AppShell>
  );
}
