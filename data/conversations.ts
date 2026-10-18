import type { Conversation } from "@/lib/types";

export const conversations: Conversation[] = [
  {
    id: "conv-sarah",
    contactName: "Sarah Mitchell",
    clientId: "abc-fitness",
    subject: "Father's Day reel — Version 3",
    unread: true,
    viaGmail: true,
    messages: [
      {
        from: "agency",
        authorName: "Olivia Chen",
        text: "Hi Sarah, Version 3 of the Father's Day reel is up — we've enlarged the opening text and added the giveaway end card. Would love your sign-off so we can lock in the 31 Aug launch.",
        date: "2026-08-26T08:45",
      },
      {
        from: "client",
        authorName: "Sarah Mitchell",
        text: "Hi Olivia, Version 3 looks great. I've left a comment — just about to hit approve. Also keen to talk September boosting budget at Thursday's catch-up.",
        date: "2026-08-26T09:08",
      },
    ],
  },
  {
    id: "conv-isabelle",
    contactName: "Isabelle Fontaine",
    clientId: "solace-skin",
    subject: "Spring Skin Reset carousel",
    unread: true,
    viaGmail: true,
    messages: [
      {
        from: "client",
        authorName: "Isabelle Fontaine",
        text: "Loving the direction, but can we keep pricing to the final slide only? Feels too salesy up front. Everything else is gorgeous.",
        date: "2026-08-25T15:50",
      },
      {
        from: "agency",
        authorName: "Olivia Chen",
        text: "Completely agree — Mia's reworking the layout now. Updated version with you Thursday.",
        date: "2026-08-25T16:32",
      },
    ],
  },
  {
    id: "conv-grace",
    contactName: "Grace Lam",
    clientId: "harbour-dental",
    subject: "New practice photography",
    unread: false,
    viaGmail: true,
    messages: [
      {
        from: "client",
        authorName: "Grace Lam",
        text: "Hi James, just uploaded the new practice photos from Tuesday's shoot to the portal. The reception ones came out really well!",
        date: "2026-08-25T14:20",
      },
      {
        from: "agency",
        authorName: "James Park",
        text: "These are great, Grace — the natural light in reception is perfect for the September carousels. We'll work them into the whitening offer creative too.",
        date: "2026-08-25T15:02",
      },
    ],
  },
  {
    id: "conv-marcus",
    contactName: "Marcus Webb",
    clientId: "atlas-property",
    subject: "September recording day",
    unread: false,
    viaGmail: true,
    messages: [
      {
        from: "agency",
        authorName: "Chloe Martin",
        text: "Hi Marcus, locking in Thursday 3 Sep, 9–11am at the studio for the September market update. Topics: spring listing surge, rate cut impact, and suburb spotlight #4. Run sheet to follow.",
        date: "2026-08-25T10:12",
      },
      {
        from: "client",
        authorName: "Marcus Webb",
        text: "Works for me. Can we add 5 minutes on the new off-the-plan project in Westmead? Board wants it mentioned.",
        date: "2026-08-25T13:47",
      },
    ],
  },
  {
    id: "conv-emma",
    contactName: "Emma Richardson",
    clientId: "bondi-wellness",
    subject: "Onboarding — brand guidelines",
    unread: false,
    viaGmail: true,
    messages: [
      {
        from: "agency",
        authorName: "Olivia Chen",
        text: "Hi Emma, welcome aboard! Logo pack came through perfectly. Last two things before kickoff: brand guidelines PDF and Instagram admin access. Then we're all set for Monday.",
        date: "2026-08-24T09:30",
      },
      {
        from: "client",
        authorName: "Emma Richardson",
        text: "Thanks Olivia! Guidelines coming tomorrow — our designer is just updating the colour section. I'll sort Instagram access tonight.",
        date: "2026-08-24T18:05",
      },
    ],
  },
  {
    id: "conv-steve",
    contactName: "Steve Callahan",
    clientId: "coastal-kitchens",
    subject: "Catch-up this week",
    unread: false,
    viaGmail: true,
    messages: [
      {
        from: "agency",
        authorName: "James Park",
        text: "Hi Steve, keen to grab 30 minutes this week to walk through August results and where we take things next quarter. Does Thursday 3pm work?",
        date: "2026-08-24T11:20",
      },
      {
        from: "client",
        authorName: "Steve Callahan",
        text: "Thursday 3 works. Fair warning — I want to talk about whether this is still worth it for us.",
        date: "2026-08-25T07:58",
      },
    ],
  },
  {
    id: "conv-nick",
    contactName: "Nick Aleksandrov",
    clientId: "ember-hospitality",
    subject: "Renewal + Cinder launch",
    unread: false,
    viaGmail: true,
    messages: [
      {
        from: "client",
        authorName: "Nick Aleksandrov",
        text: "Renewal agreement looks fine — legal is giving it a once-over and I'll sign this week. Separately: Cinder brief looks strong. Freya will coordinate the venue side.",
        date: "2026-08-24T10:20",
      },
      {
        from: "agency",
        authorName: "Chloe Martin",
        text: "Perfect. Once it's signed we'll lock the September shoot dates for Cinder. Thanks Nick.",
        date: "2026-08-24T10:55",
      },
    ],
  },
  {
    id: "conv-elena",
    contactName: "Elena Kovács",
    clientId: "lumiere-jewellery",
    subject: "Lookbook shoot — props",
    unread: false,
    viaGmail: true,
    messages: [
      {
        from: "client",
        authorName: "Elena Kovács",
        text: "For the shoot — I'd love raw silk instead of velvet for the flat lays. I can courier fabric samples to the studio Monday.",
        date: "2026-08-25T17:12",
      },
      {
        from: "agency",
        authorName: "Mia Thompson",
        text: "Raw silk will photograph beautifully with the gold. Send the samples over and I'll test them under the lighting rig before Friday.",
        date: "2026-08-25T17:40",
      },
    ],
  },
];
