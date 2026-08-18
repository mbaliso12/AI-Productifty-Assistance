import { Check, Copy, Loader2, RefreshCw, Sparkle } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  title: string;
  value: string;
  onChange: (next: string) => void;
  onRegenerate: () => void;
  loading?: boolean;
  emptyHint: string;
};

export function AiOutputCard({
  title,
  value,
  onChange,
  onRegenerate,
  loading,
  emptyHint,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section className="surface-card flex min-h-[320px] flex-col">
      <header className="flex flex-wrap items-center gap-2 border-b border-border px-5 py-3">
        <h2 className="mr-auto text-sm font-semibold">{title}</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEditing((e) => !e)}
          disabled={!value}
        >
          {editing ? "Preview" : "Edit"}
        </Button>
        <Button variant="ghost" size="sm" onClick={copy} disabled={!value}>
          {copied ? <Check className="mr-1.5 size-4" /> : <Copy className="mr-1.5 size-4" />}
          {copied ? "Copied" : "Copy"}
        </Button>
        <Button variant="secondary" size="sm" onClick={onRegenerate} disabled={loading}>
          <RefreshCw className="mr-1.5 size-4" />
          Regenerate
        </Button>
      </header>

      <div className="flex-1 p-5">
        {loading && !value ? (
          <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="size-6 animate-spin text-primary" />
            <p className="text-sm">Generating with Lovable AI...</p>
          </div>
        ) : !value ? (
          <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-3 text-center text-muted-foreground">
            <Sparkle className="size-6 text-accent" />
            <p className="max-w-sm text-sm">{emptyHint}</p>
          </div>
        ) : editing ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[320px] resize-y font-mono text-sm"
          />
        ) : (
          <article className="markdown-body max-w-none">
            <ReactMarkdown>{value}</ReactMarkdown>
          </article>
        )}
      </div>
    </section>
  );
}
