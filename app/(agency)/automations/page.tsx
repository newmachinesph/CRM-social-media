"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Plus, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/shared/page-header";
import { useStore } from "@/lib/store";
import { timeAgo } from "@/lib/format";

const TRIGGERS = [
  "Deal moves to Won",
  "Client approves content",
  "Invoice overdue by 3 days",
  "1st of month",
  "Content in review 3+ days",
];

const CONDITIONS = ["Any client", "Specific client", "Value over $5,000"];

const ACTIONS = [
  "Notify account manager",
  "Send welcome email",
  "Create onboarding checklist",
  "Generate agreement",
  "Send payment reminder",
  "Add content to scheduling queue",
  "Create revision task",
];

export default function AutomationsPage() {
  const { automations, toggleAutomation } = useStore();
  const [builderOpen, setBuilderOpen] = useState(false);
  const [trigger, setTrigger] = useState(TRIGGERS[0]);
  const [condition, setCondition] = useState(CONDITIONS[0]);
  const [actions, setActions] = useState<string[]>([ACTIONS[0]]);

  const setAction = (index: number, value: string) =>
    setActions((prev) => prev.map((a, i) => (i === index ? value : a)));

  const removeAction = (index: number) =>
    setActions((prev) => prev.filter((_, i) => i !== index));

  const createAutomation = () => {
    toast.success("Automation created — demo only");
    setBuilderOpen(false);
    setTrigger(TRIGGERS[0]);
    setCondition(CONDITIONS[0]);
    setActions([ACTIONS[0]]);
  };

  const onToggle = (id: string, name: string, enabled: boolean) => {
    toggleAutomation(id);
    toast.success(enabled ? "Automation disabled" : "Automation enabled", {
      description: name,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Automations"
        description="Let the busywork run itself."
        actions={
          <Button onClick={() => setBuilderOpen(true)}>
            <Plus className="size-4" />
            New Automation
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {automations.map((a) => (
          <div
            key={a.id}
            className="flex flex-col rounded-xl border bg-card p-5 shadow-xs transition-shadow hover:shadow-sm"
          >
            <p className="text-sm font-semibold uppercase tracking-wide">{a.name}</p>

            <div className="mt-3 flex items-start gap-2 rounded-lg bg-muted/60 px-3 py-2.5">
              <Zap className="mt-0.5 size-4 shrink-0 text-amber-500" />
              <p className="text-sm">
                <span className="text-muted-foreground">When:</span> {a.trigger}
              </p>
            </div>

            {a.condition ? (
              <p className="mt-2 px-1 text-sm">
                <span className="text-muted-foreground">If:</span> {a.condition}
              </p>
            ) : null}

            <ul className="mt-3 flex-1 space-y-1.5 px-1">
              {a.actions.map((action) => (
                <li key={action} className="flex items-start gap-2 text-sm">
                  <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  {action}
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <Switch
                checked={a.enabled}
                onCheckedChange={() => onToggle(a.id, a.name, a.enabled)}
                aria-label={`${a.enabled ? "Disable" : "Enable"} ${a.name}`}
              />
              <p className="text-xs text-muted-foreground">
                Ran {a.runCount} times
                {a.lastRun ? ` · last ${timeAgo(a.lastRun)}` : ""}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Builder */}
      <Sheet open={builderOpen} onOpenChange={setBuilderOpen}>
        <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>New automation</SheetTitle>
            <SheetDescription>
              Pick a trigger, an optional condition and the actions to run.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 space-y-6 px-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                When
              </Label>
              <Select value={trigger} onValueChange={setTrigger}>
                <SelectTrigger className="w-full" aria-label="Trigger">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TRIGGERS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                If <span className="font-normal normal-case">(optional)</span>
              </Label>
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger className="w-full" aria-label="Condition">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONDITIONS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Then
              </Label>
              <div className="space-y-2">
                {actions.map((action, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Select value={action} onValueChange={(v) => setAction(i, v)}>
                      <SelectTrigger className="w-full" aria-label={`Action ${i + 1}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ACTIONS.map((a) => (
                          <SelectItem key={a} value={a}>
                            {a}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {actions.length > 1 ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Remove action ${i + 1}`}
                        onClick={() => removeAction(i)}
                      >
                        <X className="size-4" />
                      </Button>
                    ) : null}
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActions((prev) => [...prev, ACTIONS[0]])}
              >
                <Plus className="size-4" />
                Add Action
              </Button>
            </div>
          </div>

          <SheetFooter>
            <Button onClick={createAutomation}>Create automation</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
