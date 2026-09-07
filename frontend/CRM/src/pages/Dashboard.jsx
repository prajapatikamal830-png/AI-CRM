import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  CalendarRange,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Target,
  Layers,
  PieChart as PieIcon,
  CalendarClock,
  Trophy,
  Clock,
  AlertTriangle,
  Building2,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { format, isPast } from "date-fns";
import { HeroCard } from "../components/dashboard/HeroCard";
import { AiInsightsCard } from "../components/ai/AiInsightsCard";
import {
  Card,
  SectionHeading,
  Badge,
  Tabs,
  Skeleton,
  Avatar,
} from "../components/ui";
import { analyticsApi, contactsApi, leadsApi, tasksApi } from "../lib/services";
import { currency, shortDate, timeOf } from "../lib/format";
import { STAGE_STYLES, PRIORITY_STYLES } from "../lib/constants";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";

const SOURCE_COLORS = ["#18181b", "#3f3f46", "#71717a", "#a1a1aa", "#d4d4d8", "#e4e4e7"];

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [leads, setLeads] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [range, setRange] = useState("monthly");

  useEffect(() => {
    analyticsApi.overview().then(setData).catch(() => setData(false));
    contactsApi.list().then((res) => setContacts(res.contacts || [])).catch(() => {});
    leadsApi.list().then((res) => setLeads(res.leads || [])).catch(() => {});
    tasksApi.list().then((res) => setTasks(res.tasks || [])).catch(() => {});
  }, []);

  if (data === null) return <DashboardSkeleton />;
  const stats = data?.stats || {};

  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth() - 5, 1);
  const rangeLabel = `${format(start, "dd MMM")} – ${format(today, "dd MMM, yyyy")}`;

  return (
    <div className="space-y-6">
      {/* Title row */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-[2.5rem]">
          Welcome Back, <span className="text-zinc-500">{user?.name?.split(" ")[0]}</span>
        </h1>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-600 shadow-sm sm:flex">
            <CalendarRange className="h-4 w-4 text-zinc-500" />
            {rangeLabel}
          </div>
          <Link
            to="/leads"
            className="brand-gradient brand-gradient-hover inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold text-white shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" /> Add New Lead
          </Link>
        </div>
      </div>

      {/* Balanced 3-column composition */}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        {/* ── Left column ───────────────────────────────── */}
        <div className="space-y-5 lg:col-span-3">
          <HeroCard value={stats.pipelineValue} />

          <Card className="p-5">
            <p className="text-sm text-zinc-500">Weekly Revenue</p>
            <div className="mt-2 flex items-end justify-between gap-2">
              <p className="font-display text-2xl font-bold text-zinc-900">
                {currency(stats.revenueWon, { compact: true })}
              </p>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                <ArrowUpRight className="h-3 w-3" /> 12.8%
              </Badge>
            </div>
          </Card>

          {/* Conversion stat */}
          <Card className="p-6">
            <SectionHeading icon={Target} title="Conversion" subtitle="Win rate" />
            <div className="mt-4 flex items-end gap-2">
              <p className="font-display text-3xl font-bold text-zinc-900">
                {stats.conversionRate ?? 0}
                <span className="text-xl text-zinc-500">%</span>
              </p>
              <Badge className="mb-1 bg-emerald-50 text-emerald-700 border-emerald-200">
                <ArrowUpRight className="h-3 w-3" /> 4.1%
              </Badge>
            </div>
            <p className="mt-1 text-sm text-zinc-500">
              {stats.totalLeads ?? 0} leads · {stats.openTasks ?? 0} open tasks
            </p>
          </Card>

          <UpcomingTasks tasks={tasks} />
          <TopContactsCard contacts={contacts} />
        </div>

        {/* ── Center column ─────────────────────────────── */}
        <div className="space-y-5 lg:col-span-6">
          <Card className="p-6">
            <SectionHeading
              icon={CreditCard}
              title="Pipeline Engagement"
              subtitle="New leads per month"
              action={
                <Tabs
                  value={range}
                  onChange={setRange}
                  tabs={[
                    { value: "monthly", label: "Monthly" },
                    { value: "annually", label: "Annually" },
                  ]}
                />
              }
            />
            <div className="mt-4">
              <EngagementChart trend={data?.trend || []} />
            </div>
          </Card>

          <Card className="p-6">
            <SectionHeading
              title="Lead Activity"
              subtitle="Recent lead movements"
              to="/leads"
            />
            <div className="mt-4">
              <ActivityTable leads={data?.recentLeads || []} />
            </div>
          </Card>

          <PipelineByStage pipeline={data?.pipeline || []} />
        </div>

        {/* ── Right column ──────────────────────────────── */}
        <div className="space-y-5 lg:col-span-3">
          <Card className="p-6">
            <SectionHeading title="Revenue Goal" subtitle="Closed-won total" to="/pipeline" />
            <p className="mt-4 text-center text-sm text-zinc-500">Total Won</p>
            <p className="text-center font-display text-3xl font-bold tracking-tight text-zinc-900">
              {currency(stats.revenueWon)}
            </p>
            <BalanceChart trend={data?.trend || []} />
            <div className="mt-4 flex items-center gap-2">
              <Link
                to="/leads"
                className="brand-gradient brand-gradient-hover inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full text-sm font-semibold text-white shadow-sm transition-all"
              >
                <Plus className="h-4 w-4" /> Add Lead
              </Link>
              <Link
                to="/tasks"
                className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full border border-zinc-200 bg-white text-sm font-medium text-zinc-900 shadow-sm transition-all hover:bg-zinc-50"
              >
                <CheckCircle2 className="h-4 w-4 text-zinc-600" /> Task
              </Link>
            </div>
          </Card>

          <AiInsightsCard />
          <LeadsBySource leads={leads} />
          <TopDeals leads={leads} />
        </div>
      </div>
    </div>
  );
}

function PipelineByStage({ pipeline, className }) {
  const maxValue = Math.max(...pipeline.map((s) => s.value), 1);
  const totalValue = pipeline.reduce((sum, s) => sum + s.value, 0);

  return (
    <Card className={cn("p-6", className)}>
      <SectionHeading
        icon={Layers}
        title="Pipeline by Stage"
        subtitle="Deal value across each stage"
        to="/pipeline"
      />
      <div className="mt-5 space-y-4">
        {pipeline.map((s) => {
          const style = STAGE_STYLES[s.stage] || STAGE_STYLES.New;
          const pct = totalValue ? Math.round((s.value / totalValue) * 100) : 0;
          return (
            <div key={s.stage}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium text-zinc-800">
                  <span className={cn("h-2.5 w-2.5 rounded-full", style.dot)} />
                  {s.stage}
                  <span className="text-zinc-400">· {s.count}</span>
                </span>
                <span className="font-semibold text-zinc-900">
                  {currency(s.value, { compact: true })}
                  <span className="ml-1.5 text-xs font-normal text-zinc-400">{pct}%</span>
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-zinc-100 border border-zinc-200/60">
                <div
                  className={cn("h-full rounded-full transition-all duration-500", style.bar)}
                  style={{ width: `${Math.max((s.value / maxValue) * 100, 2)}%` }}
                />
              </div>
            </div>
          );
        })}
        {pipeline.length === 0 && (
          <p className="py-6 text-center text-sm text-zinc-400">No pipeline data yet.</p>
        )}
      </div>
    </Card>
  );
}

function LeadsBySource({ leads }) {
  const grouped = leads.reduce((acc, l) => {
    const key = l.source || "Other";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const dataset = Object.entries(grouped).map(([name, value]) => ({ name, value }));

  return (
    <Card className="p-6">
      <SectionHeading icon={PieIcon} title="Leads by Source" subtitle="Where leads come from" />
      {dataset.length === 0 ? (
        <p className="py-10 text-center text-sm text-zinc-400">No leads yet.</p>
      ) : (
        <div className="mt-2 flex items-center gap-4">
          <div className="relative h-36 w-36 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataset}
                  dataKey="value"
                  innerRadius={44}
                  outerRadius={66}
                  paddingAngle={3}
                  stroke="none"
                >
                  {dataset.map((_, i) => (
                    <Cell key={i} fill={SOURCE_COLORS[i % SOURCE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip unit=" leads" />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-xl font-bold text-zinc-900">{leads.length}</span>
              <span className="text-[11px] text-zinc-500">leads</span>
            </div>
          </div>
          <ul className="flex-1 space-y-1.5">
            {dataset.map((d, i) => (
              <li key={d.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-zinc-600">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: SOURCE_COLORS[i % SOURCE_COLORS.length] }}
                  />
                  {d.name}
                </span>
                <span className="font-medium text-zinc-900">{d.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

function UpcomingTasks({ tasks }) {
  const upcoming = tasks
    .filter((t) => t.status !== "Completed")
    .sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    })
    .slice(0, 4);

  return (
    <Card className="flex flex-col p-6">
      <SectionHeading
        icon={CalendarClock}
        title="Upcoming Follow-ups"
        subtitle="Don't let these slip"
        to="/tasks"
      />
      {upcoming.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-400">You're all caught up 🎉</p>
      ) : (
        <ul className="mt-4 space-y-2.5">
          {upcoming.map((t) => {
            const overdue = t.dueDate && isPast(new Date(t.dueDate));
            return (
              <li key={t._id} className="flex items-start gap-3 rounded-2xl border border-zinc-100 bg-zinc-50/60 p-3 transition-all hover:bg-zinc-100/80">
                <span
                  className={cn(
                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border",
                    overdue ? "bg-rose-50 text-rose-600 border-rose-200" : "bg-zinc-200/60 text-zinc-700 border-zinc-300/60"
                  )}
                >
                  {overdue ? (
                    <AlertTriangle className="h-3.5 w-3.5" />
                  ) : (
                    <Clock className="h-3.5 w-3.5" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-900">{t.title}</p>
                  <p className={cn("text-xs", overdue ? "text-rose-600" : "text-zinc-500")}>
                    {t.dueDate ? shortDate(t.dueDate) : "No due date"}
                    {t.relatedLead?.name ? ` · ${t.relatedLead.name}` : ""}
                  </p>
                </div>
                <Badge className={PRIORITY_STYLES[t.priority]}>{t.priority}</Badge>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

function TopDeals({ leads }) {
  const deals = [...leads]
    .filter((l) => l.status !== "Won" && l.status !== "Lost")
    .sort((a, b) => (b.value || 0) - (a.value || 0))
    .slice(0, 5);

  return (
    <Card className="flex flex-col p-6">
      <SectionHeading icon={Trophy} title="Top Open Deals" subtitle="Biggest active opportunities" to="/leads" />
      {deals.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-400">No open deals yet.</p>
      ) : (
        <ul className="mt-4 space-y-2.5">
          {deals.map((l, i) => {
            const style = STAGE_STYLES[l.status] || STAGE_STYLES.New;
            return (
              <li key={l._id} className="flex items-center gap-3 rounded-2xl border border-zinc-100 bg-zinc-50/60 p-3 transition-all hover:bg-zinc-100/80">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-semibold text-zinc-800">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-900">{l.name}</p>
                  <p className="flex items-center gap-1 truncate text-xs text-zinc-500">
                    <Building2 className="h-3 w-3" /> {l.company || "—"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-zinc-900">
                    {currency(l.value, { compact: true })}
                  </p>
                  <span className={cn("text-[11px] font-medium", style.badge, "bg-transparent px-0")}>
                    {l.status}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

function EngagementChart({ trend }) {
  const counts = trend.map((t) => t.leads);
  const max = Math.max(...counts, 1);
  const maxIndex = counts.indexOf(max);
  const prev = maxIndex > 0 ? counts[maxIndex - 1] : 0;
  const growth = prev > 0 ? Math.round(((max - prev) / prev) * 1000) / 10 : 17.8;

  const renderPeak = (props) => {
    const { x, y, width, index } = props;
    if (index !== maxIndex) return null;
    const cx = x + width / 2;
    return (
      <g>
        <circle cx={cx} cy={y} r={5} fill="#18181b" stroke="#ffffff" strokeWidth={2} />
        <rect x={cx - 26} y={y - 34} width={52} height={22} rx={11} fill="#18181b" />
        <text x={cx} y={y - 19} textAnchor="middle" fontSize="11" fontWeight="700" fill="#ffffff">
          +{growth}%
        </text>
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={trend} barCategoryGap="28%" margin={{ top: 30 }}>
        <CartesianGrid vertical={false} stroke="#e4e4e7" strokeDasharray="4 4" />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#71717a", fontSize: 12 }}
          dy={6}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#71717a", fontSize: 12 }}
          width={30}
          tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
        />
        <Tooltip cursor={{ fill: "#f4f4f5" }} content={<ChartTooltip unit=" leads" />} />
        <Bar dataKey="leads" radius={[14, 14, 14, 14]} maxBarSize={42} label={renderPeak}>
          {trend.map((t, i) => (
            <Cell key={i} fill={i === maxIndex ? "#18181b" : "#e4e4e7"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function BalanceChart({ trend }) {
  return (
    <ResponsiveContainer width="100%" height={120}>
      <AreaChart data={trend} margin={{ top: 14, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="balance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#18181b" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#18181b" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip content={<ChartTooltip prefix="$" />} />
        <Area type="monotone" dataKey="won" stroke="#18181b" strokeWidth={2} fill="url(#balance)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function ChartTooltip({ active, payload, label, prefix = "", unit = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-3.5 py-2.5 shadow-md">
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className="text-sm font-semibold text-zinc-900">
        {prefix}
        {Number(payload[0].value).toLocaleString()}
        {unit}
      </p>
    </div>
  );
}

function ActivityTable({ leads }) {
  if (!leads.length)
    return <p className="py-10 text-center text-sm text-zinc-400">No recent activity yet.</p>;

  return (
    <div className="space-y-2">
      {leads.map((l) => {
        const style = STAGE_STYLES[l.status] || STAGE_STYLES.New;
        return (
          <div
            key={l.id}
            className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-3.5 transition-all duration-200 hover:bg-zinc-100/80 hover:border-zinc-300"
          >
            <div className="flex items-center gap-3">
              <Avatar name={l.name} size="sm" />
              <div>
                <p className="font-medium text-zinc-900">{l.name}</p>
                <p className="text-xs text-zinc-500">{l.company || "—"}</p>
              </div>
            </div>
            <div className="hidden text-xs text-zinc-500 sm:block">
              {shortDate(l.updatedAt)} · {timeOf(l.updatedAt)}
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-700">
              <span className={cn("h-2 w-2 rounded-full", style.dot)} />
              {l.status}
            </span>
            <div className="text-right font-semibold text-zinc-900">
              {currency(l.value)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TopContactsCard({ contacts }) {
  const top = contacts.slice(0, 4);
  const overflow = Math.max(contacts.length - top.length, 0);

  return (
    <Card className="p-6">
      <SectionHeading title="Top Contacts" subtitle="Your key relationships" to="/contacts" />
      {contacts.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-400">No contacts yet.</p>
      ) : (
        <div className="mt-5 flex items-center justify-between">
          <div className="flex -space-x-3">
            {top.map((c) => (
              <Avatar
                key={c._id}
                name={c.name}
                src={c.avatar}
                size="md"
                className="ring-2 ring-white"
              />
            ))}
            {overflow > 0 && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white ring-2 ring-white">
                +{overflow}
              </div>
            )}
          </div>
          <Link
            to="/contacts"
            className="text-sm font-medium text-zinc-900 hover:underline"
          >
            View all
          </Link>
        </div>
      )}
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-80 rounded-2xl" />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-3">
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-24 rounded-3xl" />
        </div>
        <div className="space-y-5 lg:col-span-6">
          <Skeleton className="h-80 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
        </div>
        <div className="space-y-5 lg:col-span-3">
          <Skeleton className="h-56 rounded-3xl" />
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-32 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
