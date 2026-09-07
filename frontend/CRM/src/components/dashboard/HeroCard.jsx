import { Wifi } from "lucide-react";
import { Card, SectionHeading } from "../ui";
import { currency } from "../../lib/format";

export function HeroCard({ value = 0, label = "Pipeline value" }) {
  return (
    <Card className="p-6">
      <SectionHeading title="Pipeline Goal" subtitle="Total deal value" to="/pipeline" />

      <div className="relative mt-5 overflow-hidden rounded-2xl bg-zinc-900 p-5 text-white shadow-md">
        <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-zinc-700/30 blur-2xl" />

        <div className="relative flex items-start justify-between">
          <span className="font-display text-lg font-extrabold tracking-tight">
            AI CRM
          </span>
          <Wifi className="h-6 w-6 rotate-90 opacity-90 text-zinc-400" />
        </div>

        <p className="relative mt-6 text-sm text-zinc-400">{label}</p>
        <p className="relative mt-1 font-display text-3xl font-bold tracking-tight text-white">
          {currency(value)}
        </p>

        <div className="relative mt-6 flex items-center justify-between text-sm">
          <span className="tracking-[0.2em] text-zinc-400">•••• PIPELINE</span>
          <span className="text-zinc-400 font-medium">LIVE</span>
        </div>
      </div>
    </Card>
  );
}
