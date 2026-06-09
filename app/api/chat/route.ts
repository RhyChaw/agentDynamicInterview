import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { agentTools } from "@/lib/agent/claude-tools";
import { loadSystemPrompt } from "@/lib/agent/load-prompt";
import { executeTool, getSessionOutcome } from "@/lib/agent/tools";
import { getCustomer } from "@/lib/customers";
import { CLAUDE_MODEL, getClaudeClient } from "@/lib/claude";
import type { Message, Scenario, ToolLogEntry } from "@/types/call";

const MAX_TOOL_LOOPS = 6;

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sessionId,
      customerId,
      messages,
      scenario = "live",
      isOpening = false,
    } = body as {
      sessionId: string;
      customerId: string;
      messages: Message[];
      scenario?: Scenario;
      isOpening?: boolean;
    };

    const customer = getCustomer(customerId);
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 400 });
    }

    const system = loadSystemPrompt(customer, scenario);
    const client = getClaudeClient();

    const anthropicMessages: Anthropic.MessageParam[] = isOpening
      ? [
          {
            role: "user",
            content:
              "[CALL CONNECTED — the customer's phone is ringing and they have just picked up. Begin Step 1 of the call flow now.]",
          },
        ]
      : messages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

    const toolLog: ToolLogEntry[] = [];
    let callEnded = false;
    let reply = "";
    let loopCount = 0;

    while (loopCount < MAX_TOOL_LOOPS) {
      loopCount++;

      const response = await client.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 400,
        system,
        messages: anthropicMessages,
        tools: agentTools,
      });

      const textBlocks = response.content.filter(
        (b): b is Anthropic.TextBlock => b.type === "text"
      );
      const toolBlocks = response.content.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
      );

      if (textBlocks.length > 0) {
        reply = textBlocks.map((b) => b.text).join("\n").trim();
      }

      if (toolBlocks.length === 0) {
        break;
      }

      anthropicMessages.push({ role: "assistant", content: response.content });

      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const tool of toolBlocks) {
        const input = tool.input as Record<string, unknown>;
        const { result, log, callEnded: ended } = executeTool(
          sessionId,
          tool.name,
          input
        );
        toolLog.push(log);
        if (ended) callEnded = true;

        toolResults.push({
          type: "tool_result",
          tool_use_id: tool.id,
          content: JSON.stringify(result),
        });
      }

      anthropicMessages.push({ role: "user", content: toolResults });

      if (callEnded) break;
    }

    const outcome = getSessionOutcome(sessionId);

    return NextResponse.json({
      reply,
      outcome: outcome
        ? {
            disposition: outcome.disposition,
            notes: outcome.notes,
            appointmentDetails: outcome.appointmentDetails,
          }
        : undefined,
      toolLog,
      callEnded,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
