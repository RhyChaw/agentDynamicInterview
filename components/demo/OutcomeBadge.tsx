import { Badge } from "@/components/ui/Badge";
import type { Disposition } from "@/types/call";

export function OutcomeBadge({
  disposition,
}: {
  disposition?: Disposition;
}) {
  if (!disposition) {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border bg-gray-50 text-gray-500 border-gray-200">
        In Progress
      </span>
    );
  }
  return <Badge disposition={disposition} />;
}
