import type Anthropic from "@anthropic-ai/sdk";

export const agentTools: Anthropic.Tool[] = [
  {
    name: "check_availability",
    description:
      "Check open appointment windows for a given day. Always call this before offering times.",
    input_schema: {
      type: "object" as const,
      properties: {
        day: {
          type: "string",
          description: "Date in YYYY-MM-DD format",
        },
      },
      required: ["day"],
    },
  },
  {
    name: "book_appointment",
    description:
      "Book a free in-home measure appointment and trigger confirmation text.",
    input_schema: {
      type: "object" as const,
      properties: {
        day: { type: "string", description: "Date in YYYY-MM-DD format" },
        window: {
          type: "string",
          description: "Time window e.g. 10:00-12:00",
        },
        address: { type: "string" },
        customer_name: { type: "string" },
        phone: { type: "string" },
      },
      required: ["day", "window", "address", "customer_name", "phone"],
    },
  },
  {
    name: "log_outcome",
    description:
      "Log the final call outcome. Call this on every exit path before ending.",
    input_schema: {
      type: "object" as const,
      properties: {
        disposition: {
          type: "string",
          enum: [
            "booked",
            "interested_callback",
            "callback",
            "not_interested",
            "do_not_call",
            "voicemail_left",
            "wrong_number",
            "no_answer",
            "transferred_to_human",
          ],
        },
        notes: {
          type: "string",
          description: "1-2 sentence summary for Priya",
        },
      },
      required: ["disposition", "notes"],
    },
  },
];
