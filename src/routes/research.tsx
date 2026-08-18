import { createFileRoute } from "@tanstack/react-router";
import { Telescope } from "lucide-react";
import { useState } from "react";
import { AiOutputCard } from "@/components/AiOutputCard";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAiTool } from "@/lib/use-ai-tool";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | Workplace AI" },
      {
        name: "description",
        content:
          "Summarise topics or pasted articles into key insights, recommendations and takeaway points for work decisions.",
      },
      { property: "og:title", content: "AI Research Assistant" },
      {
        property: "og:description",
        content: "Topic and article summaries with insights, recommendations and takeaways.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [source, setSource] = useState("");
  const { output, setOutput, loading, run } = useAiTool("research");

  const submit = () =>
    run(
      `Topic or question: ${topic}\n\nSource material (may be empty — then rely on general knowledge and flag uncertainty):\n${source}`,
    );

  return (
    <AppShell
      title="AI Research Assistant"
      subtitle="Summarise a topic or article into insights, recommendations and takeaways you can act on."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
        <section className="surface-card space-y-4 p-5">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic or question</Label>
            <Input
              id="topic"
              placeholder="e.g. Hybrid work policies in financial services"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="source">Article or notes (optional)</Label>
            <Textarea
              id="source"
              rows={10}
              placeholder="Paste an article, report extract or your own notes..."
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </div>
          <Button className="w-full" onClick={submit} disabled={loading}>
            <Telescope className="mr-2 size-4" />
            {loading ? "Researching..." : "Generate research brief"}
          </Button>
        </section>

        <AiOutputCard
          title="Research brief"
          value={output}
          onChange={setOutput}
          onRegenerate={submit}
          loading={loading}
          emptyHint="Enter a topic — and optionally paste source material — to get a summary, insights, recommendations and takeaways."
        />
      </div>
    </AppShell>
  );
}
