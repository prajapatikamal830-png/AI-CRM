import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  Users,
  Contact2,
  KanbanSquare,
  StickyNote,
  CalendarCheck,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/leads", label: "Leads", icon: Users },
  { to: "/contacts", label: "Contacts", icon: Contact2 },
  { to: "/pipeline", label: "Pipeline", icon: KanbanSquare },
  { to: "/notes", label: "Notes", icon: StickyNote },
  { to: "/tasks", label: "Follow-ups", icon: CalendarCheck },
];

function RailLink({ to, label, icon: Icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      title={label}
      className={({ isActive }) =>
        cn(
          "group relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200",
          isActive
            ? "bg-zinc-900 text-white shadow-sm"
            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
        )
      }
    >
      <Icon className="h-5 w-5" />
      <span className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-900 shadow-md opacity-0 transition group-hover:opacity-100 lg:block">
        {label}
      </span>
    </NavLink>
  );
}

export function IconRail() {
  const { logout } = useAuth();

  return (
    <aside className="flex h-full flex-col items-center justify-center gap-3 rounded-full border border-zinc-200/80 bg-white/90 px-2.5 py-6 shadow-sm backdrop-blur-xl">
      <nav className="flex flex-col items-center gap-2.5">
        {NAV.map((item) => (
          <RailLink key={item.to} {...item} />
        ))}
      </nav>

      <div className="my-1 h-px w-6 bg-zinc-200" />

      <RailLink to="/settings" label="Settings" icon={Settings} />
      <button
        onClick={logout}
        title="Log out"
        className="flex h-11 w-11 items-center justify-center rounded-2xl text-zinc-600 transition-all hover:bg-rose-50 hover:text-rose-600"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </aside>
  );
}
