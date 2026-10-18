import type { Invoice, InvoiceLineItem, InvoiceStatus } from "@/lib/types";

function inv(
  num: number,
  clientId: string,
  periodLabel: string,
  lineItems: InvoiceLineItem[],
  issueDate: string,
  dueDate: string,
  status: InvoiceStatus,
  paidDate?: string,
  myobSynced = true
): Invoice {
  const subtotal = lineItems.reduce((s, li) => s + li.amount, 0);
  const gst = Math.round(subtotal * 0.1);
  return {
    id: `inv-${num}`,
    number: `INV-2026-${num}`,
    clientId,
    lineItems,
    subtotal,
    gst,
    total: subtotal + gst,
    issueDate,
    dueDate,
    paidDate,
    status,
    myobSynced,
    periodLabel,
  };
}

export const invoices: Invoice[] = [
  // ── September (issued late Aug) ──
  inv(1052, "solace-skin", "September Content & Growth Plus", [
    { description: "Monthly Content & Growth Plus retainer", amount: 6800 },
  ], "2026-08-25", "2026-09-08", "Sent"),
  inv(1051, "atlas-property", "September Full Service Social", [
    { description: "Monthly Full Service Social retainer", amount: 7500 },
    { description: "September recording day — studio hire", amount: 450 },
  ], "2026-08-25", "2026-09-08", "Sent"),
  inv(1050, "ember-hospitality", "September Full Service Social", [
    { description: "Monthly Full Service Social retainer", amount: 9500 },
  ], "2026-08-25", "2026-09-08", "Sent"),
  inv(1049, "abc-fitness", "September Social Media Management", [
    { description: "Monthly Social Media Management", amount: 4500 },
    { description: "Content Production", amount: 1000 },
  ], "2026-08-26", "2026-09-01", "Due"),

  // ── August ──
  inv(1048, "abc-fitness", "August Social Media Management", [
    { description: "Monthly Social Media Management", amount: 4500 },
    { description: "Content Production", amount: 1000 },
  ], "2026-08-01", "2026-08-14", "Paid", "2026-08-26"),
  inv(1047, "lumiere-jewellery", "August Content & Growth Plus", [
    { description: "Monthly Content & Growth Plus retainer", amount: 8200 },
    { description: "Lookbook moodboard + creative direction", amount: 600 },
  ], "2026-08-01", "2026-08-14", "Paid", "2026-08-12"),
  inv(1046, "ember-hospitality", "August Full Service Social", [
    { description: "Monthly Full Service Social retainer", amount: 9500 },
    { description: "Chef's Table series production", amount: 1200 },
  ], "2026-08-01", "2026-08-14", "Paid", "2026-08-13"),
  inv(1045, "solace-skin", "August Content & Growth Plus", [
    { description: "Monthly Content & Growth Plus retainer", amount: 6800 },
  ], "2026-08-01", "2026-08-14", "Paid", "2026-08-11"),
  inv(1044, "atlas-property", "August Full Service Social", [
    { description: "Monthly Full Service Social retainer", amount: 7500 },
  ], "2026-08-01", "2026-08-14", "Paid", "2026-08-08"),
  inv(1043, "harbour-dental", "August Social Essentials", [
    { description: "Monthly Social Essentials retainer", amount: 4200 },
  ], "2026-08-01", "2026-08-14", "Paid", "2026-08-14"),
  inv(1042, "bondi-wellness", "Onboarding deposit", [
    { description: "Onboarding deposit — first month retainer", amount: 5900 },
    { description: "Onboarding & strategy setup", amount: 1500 },
  ], "2026-08-18", "2026-08-25", "Paid", "2026-08-20"),
  inv(1041, "coastal-kitchens", "August Social Essentials", [
    { description: "Monthly Social Essentials retainer", amount: 4800 },
  ], "2026-08-01", "2026-08-14", "Overdue"),

  // ── July ──
  inv(1040, "ember-hospitality", "July Full Service Social", [
    { description: "Monthly Full Service Social retainer", amount: 9500 },
  ], "2026-07-01", "2026-07-14", "Paid", "2026-07-10"),
  inv(1039, "lumiere-jewellery", "July Content & Growth Plus", [
    { description: "Monthly Content & Growth Plus retainer", amount: 8200 },
  ], "2026-07-01", "2026-07-14", "Paid", "2026-07-09"),
  inv(1038, "atlas-property", "July Full Service Social", [
    { description: "Monthly Full Service Social retainer", amount: 7500 },
  ], "2026-07-01", "2026-07-14", "Paid", "2026-07-07"),
  inv(1037, "solace-skin", "July Content & Growth Plus", [
    { description: "Monthly Content & Growth Plus retainer", amount: 6800 },
  ], "2026-07-01", "2026-07-14", "Paid", "2026-07-16"),
  inv(1036, "abc-fitness", "July Social Media Management", [
    { description: "Monthly Social Media Management", amount: 4500 },
    { description: "Content Production", amount: 1000 },
  ], "2026-07-01", "2026-07-14", "Paid", "2026-07-11"),
  inv(1035, "harbour-dental", "July Social Essentials", [
    { description: "Monthly Social Essentials retainer", amount: 4200 },
  ], "2026-07-01", "2026-07-14", "Paid", "2026-07-13"),
  inv(1034, "coastal-kitchens", "July Social Essentials", [
    { description: "Monthly Social Essentials retainer", amount: 4800 },
  ], "2026-07-01", "2026-07-14", "Paid", "2026-07-28"),

  // ── June ──
  inv(1033, "ember-hospitality", "June Full Service Social", [
    { description: "Monthly Full Service Social retainer", amount: 9500 },
    { description: "Winter menu shoot", amount: 900 },
  ], "2026-06-01", "2026-06-14", "Paid", "2026-06-12"),
  inv(1032, "abc-fitness", "June Social Media Management", [
    { description: "Monthly Social Media Management", amount: 4500 },
    { description: "Content Production", amount: 1000 },
  ], "2026-06-01", "2026-06-14", "Paid", "2026-06-10"),
  inv(1031, "lumiere-jewellery", "June Content & Growth Plus", [
    { description: "Monthly Content & Growth Plus retainer", amount: 8200 },
  ], "2026-06-01", "2026-06-14", "Paid", "2026-06-08"),

  // ── Drafts ──
  inv(1053, "harbour-dental", "September Social Essentials", [
    { description: "Monthly Social Essentials retainer", amount: 4200 },
  ], "2026-08-26", "2026-09-09", "Draft", undefined, false),
  inv(1054, "coastal-kitchens", "September Social Essentials", [
    { description: "Monthly Social Essentials retainer", amount: 4800 },
  ], "2026-08-26", "2026-09-09", "Draft", undefined, false),
];

export const invoiceById = Object.fromEntries(invoices.map((i) => [i.id, i]));
export const invoiceByNumber = Object.fromEntries(invoices.map((i) => [i.number, i]));
