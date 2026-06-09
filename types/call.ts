export type Disposition =
  | "booked"
  | "interested_callback"
  | "callback"
  | "not_interested"
  | "do_not_call"
  | "voicemail_left"
  | "wrong_number"
  | "no_answer"
  | "transferred_to_human";

export type Scenario = "live" | "voicemail" | "wrong_number" | "bad_timing";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  pastPurchase: string;
  lastOrderYear: number;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ToolLogEntry {
  name: string;
  input: Record<string, unknown>;
  result: Record<string, unknown>;
  timestamp: string;
}

export interface CallOutcome {
  id: string;
  customerId: string;
  customerName: string;
  disposition: Disposition;
  notes: string;
  appointmentDetails?: {
    day: string;
    window: string;
    address: string;
  };
  startedAt: string;
  endedAt: string;
  messageCount: number;
}

export interface ChatResponse {
  reply: string;
  outcome?: {
    disposition: Disposition;
    notes: string;
    appointmentDetails?: CallOutcome["appointmentDetails"];
  };
  toolLog: ToolLogEntry[];
  callEnded: boolean;
}
