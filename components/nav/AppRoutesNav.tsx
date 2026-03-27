"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ROUTES = [
  { href: "/", label: "Home" },
  { href: "/train", label: "Train" },
  { href: "/test", label: "Test" },
  { href: "/poses", label: "Poses" },
  { href: "/gloss", label: "Gloss" },
  { href: "/demo", label: "Demo" },
] as const;

export function AppRoutesNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex shrink-0 flex-wrap items-center gap-1 border-b bg-muted/40 px-2 py-1.5 text-sm",
        className
      )}
      aria-label="Main pages"
    >
      {ROUTES.map(({ href, label }) => {
        const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "rounded-md px-2.5 py-1 transition-colors hover:bg-muted hover:text-foreground",
              active ? "bg-background font-medium text-foreground shadow-sm" : "text-muted-foreground"
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
