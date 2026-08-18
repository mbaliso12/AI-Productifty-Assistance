import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Bot,
  CalendarClock,
  ChevronLeft,
  LayoutDashboard,
  Mail,
  Menu,
  Moon,
  NotebookPen,
  Search,
  Settings,
  ShieldAlert,
  Sun,
  Telescope,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import logo from "@/assets/logo.png";
import { RESPONSIBLE_AI_DISCLAIMER } from "@/lib/ai-prompts";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/meetings", label: "Meeting Summarizer", icon: NotebookPen },
  { to: "/planner", label: "Task Planner", icon: CalendarClock },
  { to: "/research", label: "Research Assistant", icon: Telescope },
  { to: "/chat", label: "AI Chatbot", icon: Bot },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function useTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("awpa-theme");
    const isDark = stored === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      window.localStorage.setItem("awpa-theme", next ? "dark" : "light");
      return next;
    });
  };

  return { dark, toggle };
}

function SidebarContent({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
      {NAV.map((item) => {
        const active = pathname === item.to;
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-smooth hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              active &&
                "bg-sidebar-primary text-sidebar-primary-foreground shadow-[var(--shadow-glow)] hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
              collapsed && "justify-center px-2",
            )}
            title={collapsed ? item.label : undefined}
          >
            <Icon className="size-[18px] shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const { dark, toggle } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col bg-sidebar transition-smooth lg:flex",
          collapsed ? "w-[76px]" : "w-64",
        )}
      >
        <div className="flex items-center gap-3 border-b border-sidebar-border px-4 py-4">
          <img src={logo} alt="" width={32} height={32} className="size-8 shrink-0" />
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-sidebar-foreground">
                Workplace AI
              </p>
              <p className="truncate text-[11px] text-sidebar-foreground/60">
                Productivity Assistant
              </p>
            </div>
          )}
        </div>
        <SidebarContent collapsed={collapsed} />
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="m-3 flex items-center justify-center gap-2 rounded-xl border border-sidebar-border py-2 text-xs font-medium text-sidebar-foreground/70 transition-smooth hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <ChevronLeft className={cn("size-4 transition-smooth", collapsed && "rotate-180")} />
          {!collapsed && "Collapse"}
        </button>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex h-full w-72 flex-col bg-sidebar shadow-[var(--shadow-elevated)]">
            <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-4">
              <div className="flex items-center gap-3">
                <img src={logo} alt="" width={32} height={32} className="size-8" />
                <p className="text-sm font-semibold text-sidebar-foreground">Workplace AI</p>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-1.5 text-sidebar-foreground/70 hover:bg-sidebar-accent"
              >
                <X className="size-5" />
              </button>
            </div>
            <SidebarContent collapsed={false} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 glass-panel border-b">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-foreground transition-smooth hover:bg-secondary lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="size-5" />
            </button>

            <div className="relative hidden max-w-md flex-1 md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search tasks, emails, notes..."
                className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-sm outline-none transition-smooth placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/25"
              />
            </div>

            <div className="ml-auto flex items-center gap-1.5">
              <button
                onClick={toggle}
                aria-label="Toggle theme"
                className="rounded-xl p-2 text-muted-foreground transition-smooth hover:bg-secondary hover:text-foreground"
              >
                {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
              </button>
              <button
                aria-label="Notifications"
                className="relative rounded-xl p-2 text-muted-foreground transition-smooth hover:bg-secondary hover:text-foreground"
              >
                <Bell className="size-5" />
                <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
              </button>
              <div className="ml-1 flex items-center gap-2 rounded-xl border border-border bg-card py-1 pl-1 pr-3">
                <span className="grid size-8 place-items-center rounded-lg gradient-primary text-xs font-semibold text-primary-foreground">
                  SM
                </span>
                <span className="hidden text-left sm:block">
                  <span className="block text-xs font-semibold leading-tight">Siphiwo M.</span>
                  <span className="block text-[11px] leading-tight text-muted-foreground">
                    Workspace Owner
                  </span>
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            {children}

            <aside className="mt-10 rounded-xl border border-border bg-secondary/60 p-4">
              <div className="flex gap-3">
                <ShieldAlert className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold">Responsible AI Disclaimer</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {RESPONSIBLE_AI_DISCLAIMER}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
