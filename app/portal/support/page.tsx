"use client";

import { useState } from "react";
import { CalendarDays, Mail, MessageSquare, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { client } from "@/data/clients";
import { member } from "@/data/users";
import { useStore, workspaceClientId } from "@/lib/store";

const SLOTS = ["Thu 28 Aug 10:00", "Thu 28 Aug 14:30", "Fri 29 Aug 09:00"];

const FAQS = [
  {
    q: "How do approvals work?",
    a: "When content is ready for your review, it appears in your Approvals queue and you'll get an email. Approve it in one click, or leave a comment and we'll turn changes around within one business day.",
  },
  {
    q: "When do you publish?",
    a: "Everything is scheduled at the times your audience is most active, agreed in your monthly content plan. You can see exactly what's going out and when in your content calendar.",
  },
  {
    q: "How do I share new photos or footage?",
    a: "Head to Files and use the Upload button — anything you add lands with the team straight away. For big video files, we'll send you a dedicated upload link.",
  },
  {
    q: "How does billing work?",
    a: "Your retainer is invoiced monthly in advance, with payment due within 14 days. Invoices live in your portal and sync automatically with our accounting system.",
  },
];

export default function PortalSupportPage() {
  const { workspace } = useStore();
  const portalClient = client(workspaceClientId(workspace));
  const am = member(portalClient.accountManagerId);
  const amFirstName = am.name.split(" ")[0];

  const [messageOpen, setMessageOpen] = useState(false);
  const [meetingOpen, setMeetingOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const sendMessage = () => {
    setMessageOpen(false);
    setSubject("");
    setBody("");
    toast.success("Message sent", {
      description: `${amFirstName} will get back to you within one business day — demo only`,
    });
  };

  const bookSlot = (slot: string) => {
    setMeetingOpen(false);
    toast.success("Meeting booked — calendar invite sent (demo)", {
      description: `${slot} with ${am.name}`,
    });
  };

  return (
    <div>
      <PageHeader title="Need something?" description="We're here to help." />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          {/* Account manager */}
          <div className="rounded-xl border bg-card p-6 text-center shadow-xs">
            <UserAvatar member={am} size="xl" className="mx-auto" />
            <h2 className="mt-3 text-base font-semibold">{am.name}</h2>
            <p className="text-sm text-muted-foreground">Account Director</p>
            <div className="mt-4 space-y-1.5 text-sm">
              <p>
                <a
                  href={`mailto:${am.email}`}
                  className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail className="size-3.5" /> {am.email}
                </a>
              </p>
              <p className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Phone className="size-3.5" /> (02) 8065 4400
              </p>
            </div>
            <div className="mt-5 flex justify-center gap-2">
              <Button onClick={() => setMessageOpen(true)}>
                <MessageSquare className="size-4" /> Send Message
              </Button>
              <Button variant="outline" onClick={() => setMeetingOpen(true)}>
                <CalendarDays className="size-4" /> Book Meeting
              </Button>
            </div>
          </div>

          {/* Contact card */}
          <div className="rounded-xl border bg-card p-5 text-sm shadow-xs">
            <p className="font-medium">Prefer email?</p>
            <p className="mt-1 text-muted-foreground">
              hello@northstarsocial.com.au · (02) 8065 4400
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="rounded-xl border bg-card p-5 shadow-xs lg:col-span-2">
          <h2 className="mb-1 px-1 text-sm font-semibold">Quick answers</h2>
          <Accordion type="single" collapsible>
            {FAQS.map((faq) => (
              <AccordionItem key={faq.q} value={faq.q}>
                <AccordionTrigger className="text-sm">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* Send message */}
      <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Message {amFirstName}</DialogTitle>
            <DialogDescription>
              We usually reply within one business day.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="msg-subject">Subject</Label>
              <Input
                id="msg-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What's it about?"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="msg-body">Message</Label>
              <Textarea
                id="msg-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Tell us what you need…"
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button disabled={!subject.trim() || !body.trim()} onClick={sendMessage}>
              <Send className="size-4" /> Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Book meeting */}
      <Dialog open={meetingOpen} onOpenChange={setMeetingOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Book a meeting</DialogTitle>
            <DialogDescription>
              Pick a time that suits you — {amFirstName} will send a calendar invite.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {SLOTS.map((slot) => (
              <Button
                key={slot}
                variant="outline"
                className="w-full justify-start"
                onClick={() => bookSlot(slot)}
              >
                <CalendarDays className="size-4" /> {slot}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
