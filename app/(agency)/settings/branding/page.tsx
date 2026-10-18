"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Globe, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";

const ACCENTS = [
  { name: "Indigo", className: "bg-indigo-500" },
  { name: "Violet", className: "bg-violet-500" },
  { name: "Sky", className: "bg-sky-500" },
  { name: "Emerald", className: "bg-emerald-500" },
  { name: "Rose", className: "bg-rose-500" },
];

function UploadTile({ label, hint }: { label: string; hint: string }) {
  return (
    <button
      type="button"
      onClick={() => toast.success(`${label} uploaded — demo only`)}
      className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-6 text-center transition-colors hover:border-primary/40 hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Upload className="size-5 text-muted-foreground" />
      <span className="text-sm font-medium">{label}</span>
      <span className="text-xs text-muted-foreground">{hint}</span>
    </button>
  );
}

export default function BrandingSettingsPage() {
  const [accent, setAccent] = useState("Indigo");

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Portal branding</CardTitle>
          <p className="text-xs text-muted-foreground">
            What your clients see when they log in to their portal.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <UploadTile label="Agency logo" hint="SVG or PNG, min 240px wide" />
            <UploadTile label="Portal logo" hint="Shown in the portal header" />
          </div>

          <div className="space-y-2">
            <Label>Accent colour</Label>
            <div className="flex items-center gap-2">
              {ACCENTS.map((a) => (
                <button
                  key={a.name}
                  type="button"
                  aria-label={`${a.name} accent`}
                  onClick={() => {
                    setAccent(a.name);
                    toast.success("Accent colour updated — demo only");
                  }}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring",
                    a.className,
                    accent === a.name && "ring-2 ring-ring ring-offset-2 ring-offset-background"
                  )}
                >
                  {accent === a.name ? <Check className="size-4 text-white" /> : null}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="portal-name">Portal name</Label>
              <Input id="portal-name" defaultValue="Northstar Client Portal" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sender-name">Email sender name</Label>
              <Input id="sender-name" defaultValue="Northstar Social" />
            </div>
          </div>

          <div className="flex justify-end border-t pt-4">
            <Button onClick={() => toast.success("Branding updated")}>
              Save changes
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom domain</CardTitle>
          <p className="text-xs text-muted-foreground">
            Serve the client portal from your own domain.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/40 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <Globe className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                clients.northstarsocial.com.au
              </span>
            </div>
            <StatusBadge status="Connected" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            DNS verified 12 Aug 2026
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
