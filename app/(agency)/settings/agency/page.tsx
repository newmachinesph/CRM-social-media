"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useStore } from "@/lib/store";

export default function AgencySettingsPage() {
  const { presentationMode, setPresentationMode, resetDemo } = useStore();

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Agency details</CardTitle>
          <p className="text-xs text-muted-foreground">
            Shown on invoices, contracts and the client portal.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="agency-name">Agency name</Label>
              <Input id="agency-name" defaultValue="Northstar Social" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agency-abn">ABN</Label>
              <Input id="agency-abn" defaultValue="64 612 908 334" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="agency-address">Address</Label>
              <Input
                id="agency-address"
                defaultValue="Level 3, 52 Foveaux Street, Surry Hills NSW 2010"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agency-timezone">Timezone</Label>
              <Select defaultValue="Australia/Sydney (AEST)">
                <SelectTrigger id="agency-timezone" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Australia/Sydney (AEST)">
                    Australia/Sydney (AEST)
                  </SelectItem>
                  <SelectItem value="Australia/Brisbane (AEST)">
                    Australia/Brisbane (AEST)
                  </SelectItem>
                  <SelectItem value="Australia/Perth (AWST)">
                    Australia/Perth (AWST)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="agency-currency">Currency</Label>
              <Select defaultValue="AUD">
                <SelectTrigger id="agency-currency" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AUD">AUD — Australian Dollar</SelectItem>
                  <SelectItem value="NZD">NZD — New Zealand Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end border-t pt-4">
            <Button onClick={() => toast.success("Agency details updated")}>
              Save changes
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Demo workspace</CardTitle>
          <p className="text-xs text-muted-foreground">
            Controls for showing Northstar off in the best light.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Presentation mode</p>
              <p className="text-xs text-muted-foreground">
                Hides demo-only controls while presenting to a client.
              </p>
            </div>
            <Switch
              checked={presentationMode}
              onCheckedChange={(on) => {
                setPresentationMode(on);
                toast.success(
                  on ? "Presentation mode on" : "Presentation mode off"
                );
              }}
              aria-label="Presentation mode"
            />
          </div>

          {!presentationMode ? (
            <div className="flex items-center justify-between gap-4 border-t pt-4">
              <div>
                <p className="text-sm font-medium">Reset demo data</p>
                <p className="text-xs text-muted-foreground">
                  Restores every client, task and approval to its starting state.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  resetDemo();
                  toast.success("Demo data reset");
                }}
              >
                Reset Demo Data
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
