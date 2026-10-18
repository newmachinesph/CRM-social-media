import type { ClientReport } from "@/lib/types";

export const reports: ClientReport[] = [
  {
    clientId: "abc-fitness",
    monthly: [
      { month: "Mar", reach: 98400, impressions: 142300, engagement: 6.1, followers: 12480, posts: 14, linkClicks: 820, leads: 18 },
      { month: "Apr", reach: 104200, impressions: 151800, engagement: 6.4, followers: 12910, posts: 15, linkClicks: 940, leads: 22 },
      { month: "May", reach: 112800, impressions: 166400, engagement: 6.8, followers: 13460, posts: 16, linkClicks: 1010, leads: 26 },
      { month: "Jun", reach: 121500, impressions: 178200, engagement: 7.1, followers: 14080, posts: 15, linkClicks: 1120, leads: 24 },
      { month: "Jul", reach: 155700, impressions: 224600, engagement: 7.4, followers: 15220, posts: 17, linkClicks: 1340, leads: 31 },
      { month: "Aug", reach: 184320, impressions: 268900, engagement: 8.2, followers: 16510, posts: 16, linkClicks: 1580, leads: 38 },
    ],
    platformSplit: [
      { platform: "Instagram", value: 58 },
      { platform: "TikTok", value: 27 },
      { platform: "Facebook", value: 15 },
    ],
    topContentIds: ["five-exercises-stop", "studio-tour-surry-hills", "trainer-qa-protein", "meal-prep-carousel"],
  },
  {
    clientId: "solace-skin",
    monthly: [
      { month: "Mar", reach: 44200, impressions: 68100, engagement: 5.2, followers: 8340, posts: 12, linkClicks: 410, leads: 12 },
      { month: "Apr", reach: 48900, impressions: 74800, engagement: 5.5, followers: 8720, posts: 13, linkClicks: 460, leads: 14 },
      { month: "May", reach: 53800, impressions: 82600, engagement: 5.9, followers: 9180, posts: 13, linkClicks: 520, leads: 15 },
      { month: "Jun", reach: 61400, impressions: 94200, engagement: 6.1, followers: 9740, posts: 14, linkClicks: 610, leads: 19 },
      { month: "Jul", reach: 72600, impressions: 108900, engagement: 6.6, followers: 10480, posts: 15, linkClicks: 720, leads: 21 },
      { month: "Aug", reach: 89200, impressions: 131400, engagement: 7.1, followers: 11390, posts: 16, linkClicks: 890, leads: 27 },
    ],
    platformSplit: [
      { platform: "TikTok", value: 48 },
      { platform: "Instagram", value: 46 },
      { platform: "Facebook", value: 6 },
    ],
    topContentIds: ["ingredient-deep-dive", "treatment-room-tour", "client-glow-up"],
  },
  {
    clientId: "harbour-dental",
    monthly: [
      { month: "Mar", reach: 18200, impressions: 27400, engagement: 3.8, followers: 3120, posts: 10, linkClicks: 240, leads: 9 },
      { month: "Apr", reach: 19800, impressions: 29800, engagement: 4.0, followers: 3260, posts: 10, linkClicks: 260, leads: 10 },
      { month: "May", reach: 21400, impressions: 32600, engagement: 4.2, followers: 3410, posts: 11, linkClicks: 290, leads: 12 },
      { month: "Jun", reach: 23600, impressions: 35800, engagement: 4.4, followers: 3590, posts: 11, linkClicks: 320, leads: 13 },
      { month: "Jul", reach: 26800, impressions: 40200, engagement: 4.7, followers: 3810, posts: 12, linkClicks: 370, leads: 16 },
      { month: "Aug", reach: 30400, impressions: 45900, engagement: 5.0, followers: 4080, posts: 12, linkClicks: 430, leads: 19 },
    ],
    platformSplit: [
      { platform: "Instagram", value: 62 },
      { platform: "Facebook", value: 38 },
    ],
    topContentIds: ["patient-journey-invisalign", "kids-first-visit"],
  },
  {
    clientId: "atlas-property",
    monthly: [
      { month: "Mar", reach: 52600, impressions: 84200, engagement: 4.1, followers: 9840, posts: 13, linkClicks: 680, leads: 21 },
      { month: "Apr", reach: 55800, impressions: 89600, engagement: 4.3, followers: 10120, posts: 13, linkClicks: 720, leads: 23 },
      { month: "May", reach: 58200, impressions: 93800, engagement: 4.4, followers: 10460, posts: 14, linkClicks: 760, leads: 24 },
      { month: "Jun", reach: 61800, impressions: 99400, engagement: 4.6, followers: 10790, posts: 14, linkClicks: 810, leads: 27 },
      { month: "Jul", reach: 66400, impressions: 107200, engagement: 4.8, followers: 11240, posts: 15, linkClicks: 890, leads: 30 },
      { month: "Aug", reach: 72800, impressions: 118600, engagement: 5.1, followers: 11820, posts: 15, linkClicks: 980, leads: 34 },
    ],
    platformSplit: [
      { platform: "LinkedIn", value: 44 },
      { platform: "Instagram", value: 38 },
      { platform: "Facebook", value: 18 },
    ],
    topContentIds: ["sydney-market-update-aug", "auction-day-reel"],
  },
  {
    clientId: "lumiere-jewellery",
    monthly: [
      { month: "Mar", reach: 68400, impressions: 104800, engagement: 5.8, followers: 21400, posts: 14, linkClicks: 1240, leads: 0 },
      { month: "Apr", reach: 72800, impressions: 112400, engagement: 6.0, followers: 22180, posts: 14, linkClicks: 1330, leads: 0 },
      { month: "May", reach: 79200, impressions: 122800, engagement: 6.3, followers: 23040, posts: 15, linkClicks: 1480, leads: 0 },
      { month: "Jun", reach: 84600, impressions: 131600, engagement: 6.5, followers: 23980, posts: 15, linkClicks: 1590, leads: 0 },
      { month: "Jul", reach: 91800, impressions: 143200, engagement: 6.9, followers: 25120, posts: 16, linkClicks: 1780, leads: 0 },
      { month: "Aug", reach: 99400, impressions: 156800, engagement: 7.2, followers: 26480, posts: 16, linkClicks: 1960, leads: 0 },
    ],
    platformSplit: [
      { platform: "Instagram", value: 68 },
      { platform: "TikTok", value: 32 },
    ],
    topContentIds: ["atelier-process-reel", "stacking-guide-carousel"],
  },
  {
    clientId: "ember-hospitality",
    monthly: [
      { month: "Mar", reach: 88200, impressions: 138400, engagement: 5.4, followers: 31200, posts: 18, linkClicks: 1420, leads: 0 },
      { month: "Apr", reach: 92600, impressions: 146200, engagement: 5.6, followers: 32180, posts: 18, linkClicks: 1510, leads: 0 },
      { month: "May", reach: 96800, impressions: 152800, engagement: 5.7, followers: 33240, posts: 19, linkClicks: 1580, leads: 0 },
      { month: "Jun", reach: 101400, impressions: 161400, engagement: 5.9, followers: 34460, posts: 19, linkClicks: 1690, leads: 0 },
      { month: "Jul", reach: 108600, impressions: 174200, engagement: 6.2, followers: 35980, posts: 20, linkClicks: 1840, leads: 0 },
      { month: "Aug", reach: 117200, impressions: 189400, engagement: 6.5, followers: 37640, posts: 20, linkClicks: 2010, leads: 0 },
    ],
    platformSplit: [
      { platform: "Instagram", value: 52 },
      { platform: "TikTok", value: 34 },
      { platform: "Facebook", value: 14 },
    ],
    topContentIds: ["ember-chefs-table", "tallow-winter-menu"],
  },
  {
    clientId: "coastal-kitchens",
    monthly: [
      { month: "Mar", reach: 12800, impressions: 19400, engagement: 3.4, followers: 2840, posts: 9, linkClicks: 160, leads: 6 },
      { month: "Apr", reach: 13600, impressions: 20800, engagement: 3.5, followers: 2920, posts: 9, linkClicks: 170, leads: 7 },
      { month: "May", reach: 13100, impressions: 20100, engagement: 3.3, followers: 2980, posts: 8, linkClicks: 150, leads: 5 },
      { month: "Jun", reach: 12400, impressions: 18900, engagement: 3.1, followers: 3020, posts: 8, linkClicks: 140, leads: 4 },
      { month: "Jul", reach: 11800, impressions: 17800, engagement: 2.9, followers: 3050, posts: 7, linkClicks: 120, leads: 4 },
      { month: "Aug", reach: 11200, impressions: 16900, engagement: 2.8, followers: 3080, posts: 6, linkClicks: 110, leads: 3 },
    ],
    platformSplit: [
      { platform: "Instagram", value: 64 },
      { platform: "Facebook", value: 36 },
    ],
    topContentIds: ["coastal-reno-reveal"],
  },
];

export const reportByClientId = Object.fromEntries(reports.map((r) => [r.clientId, r]));
