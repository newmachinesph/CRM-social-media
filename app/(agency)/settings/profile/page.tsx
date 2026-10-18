"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserAvatar } from "@/components/shared/user-avatar";
import { member } from "@/data/users";

export default function ProfileSettingsPage() {
  const olivia = member("olivia");

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <p className="text-xs text-muted-foreground">
            How you appear to your team and clients.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <UserAvatar member={olivia} size="xl" />
            <div>
              <p className="text-sm font-medium">{olivia.name}</p>
              <p className="text-xs text-muted-foreground">{olivia.role}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => toast.success("Photo upload — demo only")}
              >
                Change photo
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Full name</Label>
              <Input id="profile-name" defaultValue={olivia.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input id="profile-email" type="email" defaultValue={olivia.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-role">Role</Label>
              <Input id="profile-role" defaultValue={olivia.role} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-phone">Phone</Label>
              <Input id="profile-phone" type="tel" defaultValue="0412 908 334" />
            </div>
          </div>

          <div className="flex justify-end border-t pt-4">
            <Button onClick={() => toast.success("Profile updated")}>
              Save changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
