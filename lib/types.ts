// Shared domain types for the Northstar Social demo.
// All data is local mock data — see /data.

export type Platform =
  | "Instagram"
  | "TikTok"
  | "Facebook"
  | "LinkedIn"
  | "YouTube";

export type ContentType =
  | "Instagram Reel"
  | "Instagram Carousel"
  | "Instagram Story"
  | "TikTok"
  | "Facebook Post"
  | "LinkedIn Post"
  | "YouTube Short";

export type ContentStatus =
  | "Idea"
  | "Draft"
  | "Internal Review"
  | "Client Review"
  | "Changes Requested"
  | "Approved"
  | "Scheduled"
  | "Published";

export type LeadStage =
  | "New Lead"
  | "Contacted"
  | "Discovery"
  | "Proposal Sent"
  | "Negotiation"
  | "Won"
  | "Lost";

export type LeadSource =
  | "Referral"
  | "Website"
  | "Instagram"
  | "Facebook"
  | "LinkedIn"
  | "Google"
  | "Event"
  | "Cold Outreach";

export type TaskStatus = "Backlog" | "To Do" | "In Progress" | "Review" | "Done";
export type TaskPriority = "Urgent" | "High" | "Medium" | "Low";
export type ClientStatus = "Active" | "Onboarding" | "Paused" | "At Risk";
export type ProjectStatus = "Planning" | "Active" | "Review" | "Complete" | "On Hold";
export type InvoiceStatus = "Draft" | "Sent" | "Due" | "Paid" | "Overdue";
export type ContractStatus = "Draft" | "Sent" | "Viewed" | "Signed" | "Expired";

export type NotificationCategory =
  | "Approvals"
  | "Comments"
  | "Tasks"
  | "Payments"
  | "Clients"
  | "System";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  initials: string;
  /** tailwind bg class used for the avatar disc, e.g. "bg-indigo-500" */
  color: string;
}

export interface ClientContact {
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  location: string;
  address: string;
  status: ClientStatus;
  /** monthly retainer in AUD, ex GST */
  retainer: number;
  package: string;
  accountManagerId: string;
  contacts: ClientContact[]; // first = primary
  healthScore: number; // 0-100
  startDate: string; // ISO date
  website: string;
  socials: { platform: Platform; handle: string }[];
  /** tailwind gradient classes for the logo/brand tile */
  brandGradient: string;
  logoInitials: string;
  nextMeeting?: { title: string; date: string };
  notes: string;
}

export interface LeadActivity {
  id: string;
  type: "note" | "email" | "call" | "meeting" | "task" | "stage";
  text: string;
  date: string;
  actorId: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: LeadSource;
  service: string;
  /** estimated monthly value in AUD */
  value: number;
  stage: LeadStage;
  ownerId: string;
  lastContact: string;
  nextAction: string;
  nextActionDate: string;
  expectedClose: string;
  createdAt: string;
  daysInStage: number;
  notes: string;
  activities: LeadActivity[];
}

export interface ProjectMilestone {
  name: string;
  date: string;
  done: boolean;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  status: ProjectStatus;
  progress: number; // 0-100
  managerId: string;
  teamIds: string[];
  startDate: string;
  dueDate: string;
  priority: TaskPriority;
  description: string;
  milestones: ProjectMilestone[];
  deliverablesDone: number;
  deliverablesTotal: number;
}

export interface Subtask {
  title: string;
  done: boolean;
}

export interface TaskComment {
  authorId: string;
  text: string;
  date: string;
}

export interface Task {
  id: string;
  title: string;
  clientId?: string;
  projectId?: string;
  contentId?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  dueDate: string;
  tags: string[];
  description: string;
  subtasks: Subtask[];
  comments: TaskComment[];
  /** true = never shown in the client portal */
  internal: boolean;
}

export interface ContentVersion {
  number: number;
  date: string;
  status: "Current" | "Approved" | "Changes requested" | "Superseded";
  note: string;
}

export interface ContentComment {
  id: string;
  /** team member id, or null when authored by the client contact */
  authorId: string | null;
  authorName: string;
  /** video timestamp in seconds, when feedback is pinned to the timeline */
  timestamp?: number;
  text: string;
  date: string;
}

export interface ContentMetrics {
  reach: number;
  likes: number;
  comments: number;
  shares: number;
}

export interface ContentItem {
  id: string;
  title: string;
  clientId: string;
  projectId?: string;
  campaign: string;
  platform: Platform;
  type: ContentType;
  status: ContentStatus;
  ownerId: string;
  scheduledDate: string; // ISO datetime
  publishedDate?: string;
  caption: string;
  hashtags: string[];
  version: number;
  versions: ContentVersion[];
  comments: ContentComment[];
  metrics?: ContentMetrics;
  /** tailwind gradient for the media placeholder */
  thumbGradient: string;
  /** short label shown on the placeholder, e.g. "Reel · 0:42" */
  isVideo: boolean;
  durationSec?: number;
}

export interface InvoiceLineItem {
  description: string;
  amount: number;
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  gst: number;
  total: number;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  status: InvoiceStatus;
  myobSynced: boolean;
  periodLabel: string; // e.g. "August Social Media Management"
}

export interface Contract {
  id: string;
  title: string;
  clientId: string;
  /** contract value in AUD/month */
  value: number;
  createdDate: string;
  sentDate?: string;
  viewedDate?: string;
  signedDate?: string;
  status: ContractStatus;
  signerName?: string;
  signerRole?: string;
  termMonths: number;
}

export type FileKind = "png" | "jpg" | "pdf" | "mp4" | "mov" | "svg" | "docx" | "zip";

export interface FileItem {
  id: string;
  name: string;
  clientId: string;
  folder:
    | "Brand Assets"
    | "Campaigns"
    | "Raw Content"
    | "Approved Content"
    | "Contracts"
    | "Reports"
    | "Uploaded Content";
  kind: FileKind;
  /** human readable, e.g. "4.2 MB" */
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  /** true when the client uploaded it via the portal */
  fromClient: boolean;
}

export interface NotificationItem {
  id: string;
  category: NotificationCategory;
  text: string;
  detail?: string;
  date: string;
  read: boolean;
  href?: string;
}

export interface ActivityItem {
  id: string;
  actor: string; // display name (team member or client contact)
  action: string; // e.g. `approved "Spring Collection Reel"`
  clientId?: string;
  date: string;
  icon: "approve" | "upload" | "create" | "payment" | "comment" | "status" | "meeting";
}

export interface Automation {
  id: string;
  name: string;
  trigger: string;
  condition?: string;
  actions: string[];
  enabled: boolean;
  lastRun?: string;
  runCount: number;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  details?: string[];
  connected: boolean;
  lastSync?: string;
  /** tailwind bg class for the icon tile */
  color: string;
  abbr: string;
}

export interface Message {
  from: "client" | "agency";
  authorName: string;
  text: string;
  date: string;
}

export interface Conversation {
  id: string;
  contactName: string;
  clientId: string;
  subject: string;
  messages: Message[];
  unread: boolean;
  viaGmail: boolean;
}

export interface OnboardingStep {
  label: string;
  done: boolean;
}

export interface OnboardingRecord {
  clientId: string;
  startedDate: string;
  steps: OnboardingStep[];
}

export interface MonthlyReportPoint {
  month: string; // "Mar", "Apr", ...
  reach: number;
  impressions: number;
  engagement: number;
  followers: number;
  posts: number;
  linkClicks: number;
  leads: number;
}

export interface ClientReport {
  clientId: string;
  monthly: MonthlyReportPoint[];
  platformSplit: { platform: Platform; value: number }[];
  topContentIds: string[];
}

/** Which experience the demo is currently showing. */
export type WorkspaceId = "agency" | "abc-fitness" | "harbour-dental" | "solace-skin";
