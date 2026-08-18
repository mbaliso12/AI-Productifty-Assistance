import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { generateAiContent } from "./ai.functions";
import type { ToolKind } from "./ai-prompts";

export function useAiTool(kind: ToolKind) {
  const generate = useServerFn(generateAiContent);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async (prompt: string) => {
    if (!prompt.trim()) {
      toast.error("Please fill in the required details first.");
      return;
    }
    setLoading(true);
    try {
      const result = await generate({ data: { kind, prompt } });
      setOutput(result.text);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "AI request failed.");
    } finally {
      setLoading(false);
    }
  };

  return { output, setOutput, loading, run };
}
