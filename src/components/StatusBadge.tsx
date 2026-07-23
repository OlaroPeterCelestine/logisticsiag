import { cn } from "@/lib/cn";
import type { DeliveryStatus, RiderStatus } from "@/lib/types";
import { riderStatusLabel, statusLabel } from "@/lib/data";

const deliveryStyles: Record<DeliveryStatus, string> = {
  pending: "bg-text-dim/20 text-text-muted",
  assigned: "bg-blue/15 text-blue",
  picked_up: "bg-accent-muted text-accent",
  in_transit: "bg-accent-muted text-accent",
  delivered: "bg-green-muted text-green",
  failed: "bg-red-muted text-red",
  cancelled: "bg-red-muted text-red",
};

const riderStyles: Record<RiderStatus, string> = {
  online: "bg-green-muted text-green",
  on_delivery: "bg-accent-muted text-accent",
  offline: "bg-text-dim/20 text-text-muted",
  break: "bg-blue/15 text-blue",
};

export function DeliveryStatusBadge({ status }: { status: DeliveryStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        deliveryStyles[status],
      )}
    >
      {statusLabel(status)}
    </span>
  );
}

export function RiderStatusBadge({ status }: { status: RiderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        riderStyles[status],
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "online"
            ? "bg-green"
            : status === "on_delivery"
              ? "bg-accent"
              : status === "break"
                ? "bg-blue"
                : "bg-text-dim",
        )}
      />
      {riderStatusLabel(status)}
    </span>
  );
}
