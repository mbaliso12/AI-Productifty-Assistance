import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";
import { LANGUAGE_INSTRUCTION, SYSTEM_PROMPTS, type ToolKind } from "./ai-prompts";

const Input = z.object({
  kind: z.enum([
    "email",
    "meeting",
    "planner",
    "research",
    "document",
    "career",
    "motivation",
    "rewrite",
  ]),
  prompt: z.string().min(1).max(40000),
  languageLabel: z.string().max(40).optional(),
});

export const generateAiContent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured. Missing API key.");

    const { createLovableAiGatewayProvider, CHAT_MODEL } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);

    try {
      const result = streamText({
        model: gateway(CHAT_MODEL),
        system:
          SYSTEM_PROMPTS[data.kind as ToolKind] +
          LANGUAGE_INSTRUCTION(data.languageLabel ?? "English"),
        prompt: data.prompt,
      });
      return { text: await result.text };
    } catch (error) {
      const status = (error as { statusCode?: number; status?: number })?.statusCode ??
        (error as { status?: number })?.status;
      if (status === 429) throw new Error("Rate limit reached. Please try again in a moment.");
      if (status === 402)
        throw new Error("AI credits exhausted. Add credits in Lovable to keep generating.");
      throw new Error(
        error instanceof Error ? error.message : "The AI request failed. Please try again.",
      );
    }
  });
