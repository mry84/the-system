import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/archive", label: "Archive" },
  { href: "/people", label: "Members" },
  { href: "/log", label: "The Log" },
];

export function Nav() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="text-[22px] font-semibold tracking-tight">
            The System
          </Link>
          <div className="flex items-center gap-4">
            <nav className="hidden items-center gap-6 text-sm text-muted sm:flex">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-paper">
                  {link.label}
                </Link>
              ))}
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md sm:hidden">
        <div className="grid grid-cols-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex min-h-14 items-center justify-center px-2 text-sm text-muted"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
