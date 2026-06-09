"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { clearOutcomes, getStoredOutcomes } from "@/lib/storage";
import type { CallOutcome, Disposition } from "@/types/call";

const statGroups: {
  label: string;
  dispositions: Disposition[];
  color: string;
}[] = [
  {
    label: "Booked",
    dispositions: ["booked"],
    color: "bg-green-500",
  },
  {
    label: "Interested / Callback",
    dispositions: ["interested_callback", "callback"],
    color: "bg-blue-500",
  },
  {
    label: "Not Interested",
    dispositions: ["not_interested"],
    color: "bg-gray-400",
  },
  {
    label: "Do Not Call",
    dispositions: ["do_not_call"],
    color: "bg-red-500",
  },
  {
    label: "Other",
    dispositions: [
      "voicemail_left",
      "wrong_number",
      "no_answer",
      "transferred_to_human",
    ],
    color: "bg-purple-500",
  },
];

export default function DashboardPage() {
  const [outcomes, setOutcomes] = useState<CallOutcome[]>([]);

  useEffect(() => {
    setOutcomes(getStoredOutcomes());
  }, []);

  const refresh = () => setOutcomes(getStoredOutcomes());

  const handleClear = () => {
    if (confirm("Clear all stored outcomes?")) {
      clearOutcomes();
      setOutcomes([]);
    }
  };

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy">
              Campaign Dashboard
            </h1>
            <p className="text-navy/60 mt-1">
              Outcomes from simulated outbound calls
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={refresh} variant="ghost" size="sm">
              Refresh
            </Button>
            <Button onClick={handleClear} variant="secondary" size="sm">
              Clear All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {statGroups.map((group) => {
            const count = outcomes.filter((o) =>
              group.dispositions.includes(o.disposition)
            ).length;
            return (
              <div
                key={group.label}
                className="bg-white rounded-2xl p-6 border border-navy/10 shadow-sm"
              >
                <div
                  className={`w-3 h-3 rounded-full ${group.color} mb-3`}
                />
                <p className="text-3xl font-bold text-navy">{count}</p>
                <p className="text-sm text-navy/50">{group.label}</p>
              </div>
            );
          })}
        </div>

        {outcomes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-navy/10 p-16 text-center">
            <p className="text-navy/40 text-lg mb-2">No calls logged yet</p>
            <p className="text-navy/30 text-sm">
              Run a call in the simulator and save the outcome
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-navy/10 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="text-left px-6 py-4 font-semibold">
                    Customer
                  </th>
                  <th className="text-left px-6 py-4 font-semibold">
                    Disposition
                  </th>
                  <th className="text-left px-6 py-4 font-semibold">Notes</th>
                  <th className="text-left px-6 py-4 font-semibold">
                    Messages
                  </th>
                  <th className="text-left px-6 py-4 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody>
                {outcomes.map((o, i) => (
                  <tr
                    key={o.id}
                    className={i % 2 === 0 ? "bg-white" : "bg-cream/50"}
                  >
                    <td className="px-6 py-4 font-medium text-navy">
                      {o.customerName}
                    </td>
                    <td className="px-6 py-4">
                      <Badge disposition={o.disposition} />
                    </td>
                    <td className="px-6 py-4 text-navy/70 max-w-xs truncate">
                      {o.notes}
                    </td>
                    <td className="px-6 py-4 text-navy/50">
                      {o.messageCount}
                    </td>
                    <td className="px-6 py-4 text-navy/50 text-xs">
                      {new Date(o.endedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
