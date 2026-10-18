import type { FileItem, FileKind } from "@/lib/types";

let n = 0;
function f(
  clientId: string,
  folder: FileItem["folder"],
  name: string,
  kind: FileKind,
  size: string,
  uploadedAt: string,
  uploadedBy: string,
  fromClient = false
): FileItem {
  n += 1;
  return { id: `file-${n}`, name, clientId, folder, kind, size, uploadedAt, uploadedBy, fromClient };
}

export const files: FileItem[] = [
  // ── ABC Fitness ──
  f("abc-fitness", "Brand Assets", "ABC-Fitness-Logo-Primary.svg", "svg", "84 KB", "2025-11-05", "Sarah Mitchell", true),
  f("abc-fitness", "Brand Assets", "ABC-Fitness-Logo-White.png", "png", "312 KB", "2025-11-05", "Sarah Mitchell", true),
  f("abc-fitness", "Brand Assets", "ABC-Brand-Guidelines-2026.pdf", "pdf", "6.8 MB", "2025-11-08", "Sarah Mitchell", true),
  f("abc-fitness", "Brand Assets", "Colour-Palette.pdf", "pdf", "420 KB", "2025-11-08", "Mia Thompson"),
  f("abc-fitness", "Brand Assets", "Gym-Interior-Photography-Pack.zip", "zip", "184 MB", "2026-08-06", "Ethan Walsh"),
  f("abc-fitness", "Campaigns", "Fathers-Day-Campaign-Brief.docx", "docx", "96 KB", "2026-08-10", "Olivia Chen"),
  f("abc-fitness", "Campaigns", "Spring-Launch-Concepts.pdf", "pdf", "12.4 MB", "2026-08-13", "Mia Thompson"),
  f("abc-fitness", "Raw Content", "FD-Challenge-Raw-Takes.mov", "mov", "1.2 GB", "2026-08-18", "Ethan Walsh"),
  f("abc-fitness", "Raw Content", "Studio-Tour-Broll.mp4", "mp4", "860 MB", "2026-08-03", "Ethan Walsh"),
  f("abc-fitness", "Raw Content", "Member-Interviews-Nina.mov", "mov", "2.1 GB", "2026-08-21", "Ethan Walsh"),
  f("abc-fitness", "Approved Content", "Morning-Workout-Reel-V2-Final.mp4", "mp4", "64 MB", "2026-08-21", "Ethan Walsh"),
  f("abc-fitness", "Approved Content", "5-Exercises-Final.mp4", "mp4", "72 MB", "2026-08-08", "Ethan Walsh"),
  f("abc-fitness", "Approved Content", "Spring-Challenge-Carousel-Slides.png", "png", "8.6 MB", "2026-08-24", "Mia Thompson"),
  f("abc-fitness", "Contracts", "ABC-Fitness-SMM-Agreement-Signed.pdf", "pdf", "1.1 MB", "2026-08-18", "Olivia Chen"),
  f("abc-fitness", "Reports", "ABC-Fitness-July-Report.pdf", "pdf", "3.4 MB", "2026-08-04", "Chloe Martin"),
  f("abc-fitness", "Reports", "ABC-Fitness-June-Report.pdf", "pdf", "3.1 MB", "2026-07-03", "Chloe Martin"),

  // ── Harbour Dental ──
  f("harbour-dental", "Brand Assets", "Harbour-Dental-Logo.svg", "svg", "58 KB", "2026-02-18", "Grace Lam", true),
  f("harbour-dental", "Brand Assets", "Practice-Photography-2026.zip", "zip", "96 MB", "2026-08-25", "Grace Lam", true),
  f("harbour-dental", "Brand Assets", "Harbour-Brand-Guide.pdf", "pdf", "4.2 MB", "2026-02-20", "Grace Lam", true),
  f("harbour-dental", "Campaigns", "Invisalign-Campaign-Brief.docx", "docx", "88 KB", "2026-07-18", "James Park"),
  f("harbour-dental", "Raw Content", "Dr-Nair-Interview.mov", "mov", "1.6 GB", "2026-08-24", "Ethan Walsh"),
  f("harbour-dental", "Approved Content", "Checkup-Signs-Carousel.png", "png", "7.2 MB", "2026-08-22", "Mia Thompson"),
  f("harbour-dental", "Contracts", "Harbour-Dental-Agreement-Signed.pdf", "pdf", "980 KB", "2026-02-09", "James Park"),
  f("harbour-dental", "Reports", "Harbour-Dental-July-Report.pdf", "pdf", "2.9 MB", "2026-08-04", "Chloe Martin"),

  // ── Solace Skin ──
  f("solace-skin", "Brand Assets", "Solace-Logo-Suite.zip", "zip", "2.4 MB", "2026-01-15", "Isabelle Fontaine", true),
  f("solace-skin", "Brand Assets", "Solace-Brand-Book.pdf", "pdf", "18.6 MB", "2026-01-15", "Isabelle Fontaine", true),
  f("solace-skin", "Brand Assets", "Product-Photography-Winter.zip", "zip", "220 MB", "2026-06-12", "Mia Thompson"),
  f("solace-skin", "Campaigns", "Spring-Reset-Campaign-Brief.docx", "docx", "104 KB", "2026-08-15", "Olivia Chen"),
  f("solace-skin", "Raw Content", "Winter-Routine-Reshoot.mov", "mov", "740 MB", "2026-08-24", "Ethan Walsh"),
  f("solace-skin", "Approved Content", "Niacinamide-Explainer-Final.mp4", "mp4", "58 MB", "2026-08-14", "Ethan Walsh"),
  f("solace-skin", "Approved Content", "Glow-Up-Carousel-Final.png", "png", "9.1 MB", "2026-08-23", "Mia Thompson"),
  f("solace-skin", "Contracts", "Solace-Upgrade-Agreement-Draft.pdf", "pdf", "890 KB", "2026-08-24", "Olivia Chen"),
  f("solace-skin", "Reports", "Solace-Skin-July-Report.pdf", "pdf", "3.2 MB", "2026-08-04", "Chloe Martin"),

  // ── Atlas Property ──
  f("atlas-property", "Brand Assets", "Atlas-Logo-Kit.zip", "zip", "3.1 MB", "2025-08-06", "Annika Sorensen", true),
  f("atlas-property", "Brand Assets", "Atlas-Templates-Master.pdf", "pdf", "8.8 MB", "2025-09-12", "Mia Thompson"),
  f("atlas-property", "Raw Content", "August-Market-Update-Master.mov", "mov", "3.4 GB", "2026-08-11", "Ethan Walsh"),
  f("atlas-property", "Approved Content", "Parramatta-Spotlight-Slides.png", "png", "6.4 MB", "2026-08-21", "Mia Thompson"),
  f("atlas-property", "Contracts", "Atlas-FSS-Agreement-Signed.pdf", "pdf", "1.2 MB", "2025-07-28", "Chloe Martin"),
  f("atlas-property", "Reports", "Atlas-Property-July-Report.pdf", "pdf", "4.1 MB", "2026-08-04", "Chloe Martin"),

  // ── Lumière ──
  f("lumiere-jewellery", "Brand Assets", "Lumiere-Identity-Suite.zip", "zip", "5.6 MB", "2025-10-22", "Elena Kovács", true),
  f("lumiere-jewellery", "Brand Assets", "Meridian-Collection-Shots.zip", "zip", "310 MB", "2026-07-30", "Mia Thompson"),
  f("lumiere-jewellery", "Campaigns", "Spring-Lookbook-Moodboard.pdf", "pdf", "22.8 MB", "2026-08-19", "Mia Thompson"),
  f("lumiere-jewellery", "Campaigns", "Lookbook-Shot-List.docx", "docx", "76 KB", "2026-08-22", "Mia Thompson"),
  f("lumiere-jewellery", "Raw Content", "Atelier-Process-Footage.mov", "mov", "2.8 GB", "2026-08-09", "Ethan Walsh"),
  f("lumiere-jewellery", "Contracts", "Lumiere-Agreement-Signed.pdf", "pdf", "1.0 MB", "2025-10-13", "Olivia Chen"),
  f("lumiere-jewellery", "Reports", "Lumiere-July-Report.pdf", "pdf", "3.7 MB", "2026-08-04", "Chloe Martin"),

  // ── Ember ──
  f("ember-hospitality", "Brand Assets", "Ember-Group-Brand-Pack.zip", "zip", "14.2 MB", "2025-06-12", "Freya Doyle", true),
  f("ember-hospitality", "Campaigns", "Cinder-Summer-Launch-Brief.docx", "docx", "112 KB", "2026-08-25", "Chloe Martin"),
  f("ember-hospitality", "Raw Content", "Chefs-Table-Ep1-Master.mov", "mov", "4.2 GB", "2026-08-18", "Ethan Walsh"),
  f("ember-hospitality", "Raw Content", "Chefs-Table-Ep2-Footage.mov", "mov", "3.8 GB", "2026-08-22", "Ethan Walsh"),
  f("ember-hospitality", "Approved Content", "Tallow-Winter-Menu-Final.mp4", "mp4", "48 MB", "2026-08-14", "Ethan Walsh"),
  f("ember-hospitality", "Contracts", "Ember-Renewal-Agreement-2026.pdf", "pdf", "1.1 MB", "2026-08-22", "Chloe Martin"),
  f("ember-hospitality", "Reports", "Ember-July-Report.pdf", "pdf", "4.4 MB", "2026-08-04", "Chloe Martin"),

  // ── Coastal Kitchens ──
  f("coastal-kitchens", "Brand Assets", "Coastal-Kitchens-Logo.png", "png", "268 KB", "2026-03-25", "Steve Callahan", true),
  f("coastal-kitchens", "Raw Content", "Freshwater-Project-Photos.zip", "zip", "142 MB", "2026-08-04", "Steve Callahan", true),
  f("coastal-kitchens", "Reports", "Coastal-Kitchens-July-Report.pdf", "pdf", "2.6 MB", "2026-08-04", "Chloe Martin"),

  // ── Bondi Wellness ──
  f("bondi-wellness", "Brand Assets", "Bondi-Wellness-Logo-Pack.zip", "zip", "1.8 MB", "2026-08-21", "Emma Richardson", true),
  f("bondi-wellness", "Brand Assets", "Studio-Photos-Phone.zip", "zip", "68 MB", "2026-08-23", "Emma Richardson", true),
  f("bondi-wellness", "Contracts", "Bondi-Wellness-Agreement-Signed.pdf", "pdf", "1.0 MB", "2026-08-18", "Olivia Chen"),
];

export const fileById = Object.fromEntries(files.map((x) => [x.id, x]));
