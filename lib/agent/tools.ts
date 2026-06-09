import type { Disposition, ToolLogEntry } from "@/types/call";
import { getSaleDates } from "@/lib/dates";

interface BookedAppointment {
  day: string;
  window: string;
  address: string;
  customer_name: string;
  phone: string;
}

interface SessionState {
  bookedAppointments: BookedAppointment[];
  lastOutcome?: {
    disposition: Disposition;
    notes: string;
    appointmentDetails?: { day: string; window: string; address: string };
  };
}

const sessions = new Map<string, SessionState>();

function getSession(sessionId: string): SessionState {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, { bookedAppointments: [] });
  }
  return sessions.get(sessionId)!;
}

export function checkAvailability(day: string): { windows: string[] } {
  const { saturdayISO, sundayISO } = getSaleDates();
  if (day === saturdayISO || day === sundayISO) {
    return { windows: ["10:00-12:00", "13:00-15:00", "15:00-17:00"] };
  }
  return { windows: ["10:00-12:00", "14:00-16:00"] };
}

export function executeTool(
  sessionId: string,
  name: string,
  input: Record<string, unknown>
): { result: Record<string, unknown>; log: ToolLogEntry; callEnded: boolean } {
  const session = getSession(sessionId);
  const timestamp = new Date().toISOString();

  if (name === "check_availability") {
    const day = input.day as string;
    const result = checkAvailability(day);
    return {
      result,
      log: { name, input, result, timestamp },
      callEnded: false,
    };
  }

  if (name === "book_appointment") {
    const appointment: BookedAppointment = {
      day: input.day as string,
      window: input.window as string,
      address: input.address as string,
      customer_name: input.customer_name as string,
      phone: input.phone as string,
    };
    session.bookedAppointments.push(appointment);
    const result = {
      success: true,
      confirmation: `Appointment booked for ${appointment.day} ${appointment.window}`,
    };
    return {
      result,
      log: { name, input, result, timestamp },
      callEnded: false,
    };
  }

  if (name === "log_outcome") {
    const disposition = input.disposition as Disposition;
    const notes = input.notes as string;
    const lastBooked = session.bookedAppointments.at(-1);

    session.lastOutcome = {
      disposition,
      notes,
      appointmentDetails: lastBooked
        ? {
            day: lastBooked.day,
            window: lastBooked.window,
            address: lastBooked.address,
          }
        : undefined,
    };

    const result = { logged: true, disposition, notes };
    return {
      result,
      log: { name, input, result, timestamp },
      callEnded: true,
    };
  }

  return {
    result: { error: `Unknown tool: ${name}` },
    log: { name, input, result: { error: `Unknown tool: ${name}` }, timestamp },
    callEnded: false,
  };
}

export function getSessionOutcome(sessionId: string) {
  return getSession(sessionId).lastOutcome;
}
