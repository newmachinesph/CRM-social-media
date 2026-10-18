"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Clapperboard,
  FolderKanban,
  Receipt,
  UserPlus,
  Users,
  ArrowRight,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { agencyNav } from "@/components/layout/nav-config";
import { clients } from "@/data/clients";
import { projects } from "@/data/projects";
import { useStore } from "@/lib/store";
import { aud } from "@/lib/format";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const { content, leads, invoices } = useStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const go = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Search" description="Search across Northstar Social">
      <CommandInput placeholder="Search clients, content, invoices, pages…" />
      <CommandList className="thin-scroll">
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Clients">
          {clients.map((c) => (
            <CommandItem key={c.id} value={`${c.name} ${c.industry} client`} onSelect={() => go(`/clients/${c.id}`)}>
              <Users className="size-4" />
              <span>{c.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">Client</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />
        <CommandGroup heading="Content">
          {content.slice(0, 8).map((item) => (
            <CommandItem key={item.id} value={`${item.title} ${item.type} content`} onSelect={() => go(`/content/${item.id}`)}>
              <Clapperboard className="size-4" />
              <span className="truncate">{item.title}</span>
              <span className="ml-auto shrink-0 text-xs text-muted-foreground">{item.type}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />
        <CommandGroup heading="Projects">
          {projects.map((p) => (
            <CommandItem key={p.id} value={`${p.name} project`} onSelect={() => go(`/projects/${p.id}`)}>
              <FolderKanban className="size-4" />
              <span className="truncate">{p.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">Project</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />
        <CommandGroup heading="Leads">
          {leads.slice(0, 6).map((l) => (
            <CommandItem key={l.id} value={`${l.name} ${l.company} lead`} onSelect={() => go("/leads")}>
              <UserPlus className="size-4" />
              <span>
                {l.name} · {l.company}
              </span>
              <span className="ml-auto text-xs text-muted-foreground">{aud(l.value)}/mo</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />
        <CommandGroup heading="Invoices">
          {invoices.slice(0, 6).map((inv) => (
            <CommandItem key={inv.id} value={`${inv.number} invoice`} onSelect={() => go(`/invoices/${inv.id}`)}>
              <Receipt className="size-4" />
              <span>{inv.number}</span>
              <span className="ml-auto text-xs text-muted-foreground">Invoice</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />
        <CommandGroup heading="Pages">
          {agencyNav.flatMap((s) => s.items).map((item) => (
            <CommandItem key={item.href} value={`${item.label} page go to`} onSelect={() => go(item.href)}>
              <ArrowRight className="size-4" />
              <span>Go to {item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
