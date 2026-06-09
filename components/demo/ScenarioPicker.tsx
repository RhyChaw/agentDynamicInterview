import type { Scenario } from "@/types/call";

const scenarios: { value: Scenario; label: string; desc: string }[] = [
  { value: "live", label: "Live Answer", desc: "Normal outbound call" },
  { value: "voicemail", label: "Voicemail", desc: "No answer — leave message" },
  {
    value: "wrong_number",
    label: "Wrong Number",
    desc: "Not the customer",
  },
  { value: "bad_timing", label: "Bad Timing", desc: "Customer is busy" },
];

interface ScenarioPickerProps {
  value: Scenario;
  onChange: (s: Scenario) => void;
  disabled?: boolean;
}

export function ScenarioPicker({
  value,
  onChange,
  disabled,
}: ScenarioPickerProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-navy/50 uppercase tracking-wider">
        Scenario
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Scenario)}
        disabled={disabled}
        className="w-full bg-white border border-navy/10 rounded-xl px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-maple/50 disabled:opacity-50"
      >
        {scenarios.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label} — {s.desc}
          </option>
        ))}
      </select>
    </div>
  );
}
