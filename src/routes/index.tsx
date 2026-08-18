import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Bot,
  CalendarClock,
  Clock,
  Mail,
  NotebookPen,
  Telescope,
  TrendingUp,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Executive dashboard for the AI Workplace Productivity Assistant: emails, meeting summaries, planning, research and chat in one place.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Automate workplace tasks with AI: emails, meetings, planning, research and chat.",
      },
    ],
  }),
  component: Dashboard,
});

const STATS = [
  { label: "Tasks automated", value: "128", delta: "+18% this week", icon: Zap },
  { label: "Hours saved", value: "36.5", delta: "+4.2 hrs", icon: Clock },
  { label: "Emails drafted", value: "64", delta: "+12 today", icon: Mail },
  { label: "Productivity score", value: "92%", delta: "+6 pts", icon: TrendingUp },
];

const FEATURES = [
  {
    to: "/email",
    title: "Smart Email Generator",
    desc: "Draft polished, on-tone emails in seconds.",
    icon: Mail,
  },
  {
    to: "/meetings",
    title: "Meeting Summarizer",
    desc: "Turn long notes into decisions and action items.",
    icon: NotebookPen,
  },
  {
    to: "/planner",
    title: "AI Task Planner",
    desc: "Prioritised daily and weekly time-blocked plans.",
    icon: CalendarClock,
  },
  {
    to: "/research",
    title: "Research Assistant",
    desc: "Summaries, insights and recommendations.",
    icon: Telescope,
  },
  {
    to: "/chat",
    title: "AI Chatbot",
    desc: "Ask your workplace copilot anything.",
    icon: Bot,
  },
] as const;

const ACTIVITY = [
  { title: "Client follow-up email drafted", tool: "Email Generator", time: "12 min ago" },
  { title: "Q3 roadmap meeting summarised", tool: "Meeting Summarizer", time: "1 hr ago" },
  { title: "Weekly plan generated", tool: "Task Planner", time: "3 hrs ago" },
  { title: "Market research brief created", tool: "Research Assistant", time: "Yesterday" },
];

function Dashboard() {
  return (
    <AppShell
      title="Welcome back, Siphiwo"
      subtitle="Here's your productivity overview and quick access to every AI workspace tool."
    >
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-2xl gradient-primary px-6 py-8 text-primary-foreground shadow-[var(--shadow-elevated)] sm:px-8">
          <div className="relative z-10 max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">
              Workplace copilot
            </p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              Automate the busywork, keep the judgement
            </h2>
            <p className="mt-2 text-sm text-primary-foreground/85">
              Five AI tools built for professionals — drafting, summarising, planning and
              researching, with you reviewing every output.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                to="/email"
                className="inline-flex items-center gap-1.5 rounded-xl bg-card px-4 py-2 text-sm font-semibold text-primary transition-smooth hover:opacity-90"
              >
                Draft an email <ArrowUpRight className="size-4" />
              </Link>
              <Link
                to="/chat"
                className="inline-flex items-center gap-1.5 rounded-xl border border-primary-foreground/40 px-4 py-2 text-sm font-semibold transition-smooth hover:bg-primary-foreground/10"
              >
                Open assistant
              </Link>
            </div>
          </div>
          <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-accent/30 blur-3xl" />
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="surface-card p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
                <s.icon className="size-4 text-primary" />
              </div>
              <p className="mt-3 text-2xl font-bold">{s.value}</p>
              <p className="mt-1 text-xs font-medium text-success">{s.delta}</p>
            </div>
          ))}
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Quick access
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {FEATURES.map((f) => (
                <Link
                  key={f.to}
                  to={f.to}
                  className="surface-card group flex gap-4 p-5 transition-smooth hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl gradient-primary text-primary-foreground">
                    <f.icon className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1 text-sm font-semibold">
                      {f.title}
                      <ArrowUpRight className="size-4 text-muted-foreground transition-smooth group-hover:text-primary" />
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">{f.desc}</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Recent activity
            </h2>
            <div className="surface-card divide-y divide-border">
              {ACTIVITY.map((a) => (
                <div key={a.title} className="px-5 py-4">
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {a.tool} · {a.time}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
