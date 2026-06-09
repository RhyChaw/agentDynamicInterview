import type { Disposition } from "@/types/call";

const dispositionStyles: Record<Disposition, string> = {
  booked: "bg-green-100 text-green-800 border-green-200",
  interested_callback: "bg-blue-100 text-blue-800 border-blue-200",
  callback: "bg-blue-100 text-blue-800 border-blue-200",
  not_interested: "bg-gray-100 text-gray-700 border-gray-200",
  do_not_call: "bg-red-100 text-red-800 border-red-200",
  voicemail_left: "bg-purple-100 text-purple-800 border-purple-200",
  wrong_number: "bg-orange-100 text-orange-800 border-orange-200",
  no_answer: "bg-yellow-100 text-yellow-800 border-yellow-200",
  transferred_to_human: "bg-indigo-100 text-indigo-800 border-indigo-200",
};

const dispositionLabels: Record<Disposition, string> = {
  booked: "Booked",
  interested_callback: "Interested",
  callback: "Callback",
  not_interested: "Not Interested",
  do_not_call: "Do Not Call",
  voicemail_left: "Voicemail",
  wrong_number: "Wrong Number",
  no_answer: "No Answer",
  transferred_to_human: "Transferred",
};

export function Badge({ disposition }: { disposition: Disposition }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${dispositionStyles[disposition]}`}
    >
      {dispositionLabels[disposition]}
    </span>
  );
}
