"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const PREFS = [
  {
    key: "approvals",
    label: "Approvals",
    description: "When a client approves content or requests changes.",
  },
  {
    key: "comments",
    label: "Comments",
    description: "New comments on content, tasks and projects.",
  },
  {
    key: "tasks",
    label: "Task assignments",
    description: "When a task is assigned to you or its due date changes.",
  },
  {
    key: "payments",
    label: "Payments",
    description: "Invoice payments, overdue reminders and MYOB sync issues.",
  },
  {
    key: "digest",
    label: "Weekly digest",
    description: "A Monday-morning summary of every client's week.",
  },
];

export default function NotificationSettingsPage() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    approvals: true,
    comments: true,
    tasks: true,
    payments: true,
    digest: false,
  });

  const toggle = (key: string, label: string, on: boolean) => {
    setPrefs((prev) => ({ ...prev, [key]: on }));
    toast.success(`${label} notifications ${on ? "on" : "off"}`);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <p className="text-xs text-muted-foreground">
            Choose what lands in your inbox and notification centre.
          </p>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {PREFS.map((p) => (
              <li key={p.key} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{p.label}</p>
                  <p className="text-xs text-muted-foreground">{p.description}</p>
                </div>
                <Switch
                  checked={prefs[p.key]}
                  onCheckedChange={(on) => toggle(p.key, p.label, on)}
                  aria-label={p.label}
                />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
