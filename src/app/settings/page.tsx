import { AdminShell } from "@/components/AdminShell";

const settings = [
  {
    group: "Delivery SLA",
    items: [
      { label: "Default SLA", value: "≤ 45 minutes" },
      { label: "Express SLA", value: "≤ 30 minutes" },
      { label: "Unassigned alert", value: "After 10 minutes" },
      { label: "Late ETA alert", value: "ETA drift > 8 min" },
    ],
  },
  {
    group: "Proof of delivery",
    items: [
      { label: "Default POD", value: "OTP + photo" },
      { label: "OTP length", value: "4 digits" },
      { label: "Photo required for COD", value: "On" },
      { label: "Geofence to complete", value: "150m (planned)" },
    ],
  },
  {
    group: "Dispatch",
    items: [
      { label: "Auto-dispatch", value: "Off (manual board)" },
      { label: "Max concurrent jobs / rider", value: "3" },
      { label: "Prefer same zone", value: "On" },
      { label: "Batch multi-stop", value: "Off" },
    ],
  },
  {
    group: "Payments",
    items: [
      { label: "Currency", value: "UGX" },
      { label: "COD enabled", value: "On" },
      { label: "Rider payout", value: "Weekly · Mobile money" },
      { label: "Merchant settlement", value: "Daily / weekly by account" },
    ],
  },
  {
    group: "Notifications",
    items: [
      { label: "Customer track SMS / WhatsApp", value: "On" },
      { label: "Rider push on assign", value: "On" },
      { label: "Dispatcher critical alerts", value: "On" },
      { label: "Failed delivery → Issues", value: "Auto-create" },
    ],
  },
  {
    group: "Coverage",
    items: [
      { label: "City", value: "Kampala" },
      { label: "Zones", value: "Central · East · North · South" },
      { label: "Surge when critical", value: "Up to 1.35×" },
    ],
  },
];

export default function SettingsPage() {
  return (
    <AdminShell crumbs={[{ label: "Care & insights" }, { label: "Settings" }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-text">
          Settings
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Ops configuration preview — wire to backend when ready
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {settings.map((section) => (
          <div
            key={section.group}
            className="overflow-hidden border-y border-border bg-bg"
          >
            <div className="border-b border-border px-5 py-3 text-sm font-semibold text-text">
              {section.group}
            </div>
            <ul>
              {section.items.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center justify-between gap-4 border-b border-border-subtle px-5 py-3.5 last:border-0"
                >
                  <span className="text-sm text-text-muted">{item.label}</span>
                  <span className="text-right text-sm font-medium text-text">
                    {item.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
