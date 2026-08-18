import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings | Workplace AI" },
      {
        name: "description",
        content:
          "Manage your workspace profile, AI output preferences and responsible AI review settings.",
      },
      { property: "og:title", content: "Workspace Settings" },
      {
        property: "og:description",
        content: "Profile, AI preferences and responsible AI controls.",
      },
    ],
  }),
  component: SettingsPage,
});

const TOGGLES = [
  {
    label: "Always show review reminder",
    desc: "Prompt me to verify AI output before sharing it externally.",
  },
  { label: "Concise responses", desc: "Prefer shorter, more direct AI answers." },
  { label: "Include action items", desc: "Append suggested next steps to generated content." },
];

function SettingsPage() {
  return (
    <AppShell title="Settings" subtitle="Workspace profile and AI assistant preferences.">
      <div className="grid gap-6 md:grid-cols-2">
        <section className="surface-card space-y-4 p-5">
          <h2 className="text-sm font-semibold">Profile</h2>
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" defaultValue="Siphiwo Mbaliso" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" defaultValue="Workspace Owner" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Work email</Label>
            <Input id="email" type="email" defaultValue="siphiwo@company.com" />
          </div>
        </section>

        <section className="surface-card space-y-4 p-5">
          <h2 className="text-sm font-semibold">AI preferences</h2>
          {TOGGLES.map((t, i) => (
            <div key={t.label} className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{t.label}</p>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
              </div>
              <Switch defaultChecked={i !== 1} />
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
