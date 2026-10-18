"use client";

import { useState } from "react";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const SYNC_FREQUENCIES = ["Every 15 minutes", "Hourly", "Daily"];

export default function IntegrationsPage() {
  const { integrations, setIntegrationConnected } = useStore();
  const [connecting, setConnecting] = useState<string[]>([]);
  const [manageId, setManageId] = useState<string | null>(null);
  const [syncFrequency, setSyncFrequency] = useState(SYNC_FREQUENCIES[0]);

  const managed = integrations.find((i) => i.id === manageId);

  const connect = (id: string, name: string) => {
    setConnecting((prev) => [...prev, id]);
    setTimeout(() => {
      setIntegrationConnected(id, true);
      setConnecting((prev) => prev.filter((c) => c !== id));
      toast.success(`${name} connected successfully`, {
        description: "Demo integration only",
      });
    }, 1200);
  };

  const disconnect = () => {
    if (!managed) return;
    setIntegrationConnected(managed.id, false);
    toast.success(`${managed.name} disconnected`);
    setManageId(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrations"
        description="Northstar connects the tools your agency already runs on."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {integrations.map((integration) => {
          const isConnecting = connecting.includes(integration.id);
          return (
            <div
              key={integration.id}
              className="flex flex-col rounded-xl border bg-card p-5 shadow-xs transition-shadow hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex size-10 shrink-0 select-none items-center justify-center rounded-lg text-sm font-bold text-white",
                      integration.color
                    )}
                  >
                    {integration.abbr}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{integration.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {integration.description}
                    </p>
                  </div>
                </div>
                <StatusBadge
                  status={integration.connected ? "Connected" : "Not Connected"}
                />
              </div>

              {integration.details ? (
                <ul className="mt-4 space-y-1">
                  {integration.details.map((d) => (
                    <li
                      key={d}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <span className="size-1 rounded-full bg-muted-foreground/50" />
                      {d}
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                {integration.connected && integration.lastSync ? (
                  <p className="text-xs text-muted-foreground">
                    Last sync: {integration.lastSync}
                  </p>
                ) : (
                  <span />
                )}
                {integration.connected ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setManageId(integration.id)}
                  >
                    Manage
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    disabled={isConnecting}
                    onClick={() => connect(integration.id, integration.name)}
                  >
                    {isConnecting ? (
                      <>
                        <RefreshCw className="size-4 animate-spin" />
                        Connecting…
                      </>
                    ) : (
                      "Connect"
                    )}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Manage dialog */}
      <Dialog open={manageId !== null} onOpenChange={(open) => !open && setManageId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage {managed?.name}</DialogTitle>
            <DialogDescription>
              Connection settings for this integration.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sync-frequency">Sync frequency</Label>
              <Select value={syncFrequency} onValueChange={setSyncFrequency}>
                <SelectTrigger id="sync-frequency" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SYNC_FREQUENCIES.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-lg border bg-muted/40 px-3 py-2.5 text-sm">
              <p className="text-xs text-muted-foreground">Connected account</p>
              <p className="font-medium">hello@northstarsocial.com.au</p>
            </div>
            {managed?.lastSync ? (
              <p className="text-xs text-muted-foreground">
                Last synced {managed.lastSync}
              </p>
            ) : null}
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="destructive" onClick={disconnect}>
              Disconnect
            </Button>
            <Button variant="outline" onClick={() => setManageId(null)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
