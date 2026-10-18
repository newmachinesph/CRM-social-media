"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Plus,
  Receipt,
  Upload,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { clientById } from "@/data/clients";
import { member } from "@/data/users";
import { projects } from "@/data/projects";
import { files } from "@/data/files";
import { activities } from "@/data/activities";
import { reportByClientId } from "@/data/reports";
import { useStore } from "@/lib/store";
import { aud } from "@/lib/format";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ClientLogo } from "@/components/shared/client-logo";
import { UserAvatar } from "@/components/shared/user-avatar";
import { EmptyState } from "@/components/shared/empty-state";
import { OverviewTab } from "@/components/clients/overview-tab";
import {
  ActivityTab,
  ContentTab,
  ContractsTab,
  FilesTab,
  InvoicesTab,
  ProjectsTab,
  ReportsTab,
  TasksTab,
} from "@/components/clients/profile-tabs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ClientProfilePage() {
  const { id } = useParams<{ id: string }>();
  const store = useStore();
  const client = clientById[id];

  if (!client) {
    return (
      <EmptyState
        icon={<Users className="size-5" />}
        title="Client not found"
        description="This client doesn't exist — it may have been archived."
        action={
          <Button asChild variant="outline">
            <Link href="/clients">Back to clients</Link>
          </Button>
        }
      />
    );
  }

  const am = member(client.accountManagerId);
  const clientProjects = projects.filter((p) => p.clientId === client.id);
  const clientContent = store.content.filter((c) => c.clientId === client.id);
  const clientTasks = store.tasks.filter((t) => t.clientId === client.id);
  const clientFiles = files.filter((f) => f.clientId === client.id);
  const clientInvoices = store.invoices.filter((i) => i.clientId === client.id);
  const clientContracts = store.contracts.filter((c) => c.clientId === client.id);
  const clientActivities = activities.filter((a) => a.clientId === client.id);
  const report = reportByClientId[client.id];

  const awaitingApproval = clientContent.filter((c) => c.status === "Client Review");
  const openTasks = clientTasks.filter((t) => t.status !== "Done").slice(0, 3);
  const recentInvoices = clientInvoices.slice(0, 3);

  const demoToast = (title: string) =>
    toast.success(title, { description: "Demo only — nothing was changed." });

  return (
    <div>
      <Link
        href="/clients"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Clients
      </Link>

      <PageHeader
        title={
          <span className="flex items-center gap-4">
            <ClientLogo client={client} size="xl" />
            <span>
              <span className="flex flex-wrap items-center gap-2">
                {client.name}
                <StatusBadge status={client.status} />
              </span>
              <span className="mt-1 block text-sm font-normal text-muted-foreground">
                {client.package} · {aud(client.retainer)}/month
              </span>
            </span>
          </span>
        }
        actions={
          <>
            <span className="mr-1 hidden items-center gap-2 sm:flex">
              <UserAvatar member={am} size="sm" />
              <span className="text-sm">
                <span className="block leading-tight">{am.name}</span>
                <span className="block text-xs text-muted-foreground">Account manager</span>
              </span>
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Client actions">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => demoToast("Edit client")}>
                  Edit client
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => demoToast("Account paused")}>
                  Pause account
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => demoToast("Client archived")}
                >
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/inbox">
              <MessageSquare className="size-4" />
              Message Client
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={() => demoToast("Content draft created")}>
            <Plus className="size-4" />
            Create Content
          </Button>
          <Button variant="outline" size="sm" onClick={() => demoToast("Task created")}>
            <Pencil className="size-4" />
            Create Task
          </Button>
          <Button variant="outline" size="sm" onClick={() => demoToast("File uploaded")}>
            <Upload className="size-4" />
            Upload File
          </Button>
          <Button variant="outline" size="sm" onClick={() => demoToast("Invoice drafted")}>
            <Receipt className="size-4" />
            Create Invoice
          </Button>
        </div>
      </PageHeader>

      <Tabs defaultValue="overview">
        <div className="overflow-x-auto thin-scroll">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
        </div>

        <div className="mt-4">
          <TabsContent value="overview">
            <OverviewTab
              client={client}
              awaitingApproval={awaitingApproval}
              recentInvoices={recentInvoices}
              openTasks={openTasks}
              activities={clientActivities}
            />
          </TabsContent>
          <TabsContent value="projects">
            <ProjectsTab projects={clientProjects} />
          </TabsContent>
          <TabsContent value="content">
            <ContentTab content={clientContent} />
          </TabsContent>
          <TabsContent value="tasks">
            <TasksTab tasks={clientTasks} />
          </TabsContent>
          <TabsContent value="files">
            <FilesTab files={clientFiles} />
          </TabsContent>
          <TabsContent value="invoices">
            <InvoicesTab invoices={clientInvoices} />
          </TabsContent>
          <TabsContent value="contracts">
            <ContractsTab contracts={clientContracts} />
          </TabsContent>
          <TabsContent value="reports">
            <ReportsTab report={report} />
          </TabsContent>
          <TabsContent value="activity">
            <ActivityTab activities={clientActivities} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
