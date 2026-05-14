import Link from "next/link";
import { Flame } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#222] bg-black/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em]">
          <Flame className="h-4 w-4 text-[#ff5a00]" /> La Fraternite
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/reservar" className="hover:text-[#ffcc00]">Reservar</Link>
          <Link href="/admin" className="hover:text-[#ffcc00]">Admin</Link>
        </nav>
      </div>
    </header>
  );
}

