import fs from "fs";
import path from "path";
import type { Customer } from "@/types/call";
import type { Scenario } from "@/types/call";
import { STORE_PHONE } from "@/lib/customers";
import { getSaleDates } from "@/lib/dates";

export function loadSystemPrompt(customer: Customer, scenario?: Scenario): string {
  const promptPath = path.join(process.cwd(), "System_prompt.md");
  let prompt = fs.readFileSync(promptPath, "utf-8");

  const { saleSaturdayDate, saleSundayDate } = getSaleDates();

  prompt = prompt
    .replace(/\{customer_name\}/g, customer.name)
    .replace(/\{store_phone\}/g, STORE_PHONE)
    .replace(/\{sale_saturday_date\}/g, saleSaturdayDate)
    .replace(/\{sale_sunday_date\}/g, saleSundayDate);

  const context = `
# RUNTIME CONTEXT
Customer on file: ${customer.name}
Phone: ${customer.phone}
Address: ${customer.address}
Past purchase: ${customer.pastPurchase} (${customer.lastOrderYear})
`;

  const scenarioHints: Record<Scenario, string> = {
    live: "",
    voicemail:
      "\n# SCENARIO: The call went to voicemail. Follow Step 8 — leave the voicemail script and log voicemail_left. Do not wait for a response.",
    wrong_number:
      "\n# SCENARIO: The answerer says this is the wrong number. Follow Step 7 immediately.",
    bad_timing:
      "\n# SCENARIO: The customer says it is a bad time when you ask for thirty seconds. Follow Step 6.",
  };

  const hint = scenario ? scenarioHints[scenario] : "";

  return prompt + context + hint;
}
