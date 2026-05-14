"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-center">
      <h2 className="text-3xl font-black uppercase">Algo explotÃ³</h2>
      <p className="mt-3 text-[#b0b0b0]">No se pudo cargar la vista. Reintenta.</p>
      <Button className="mt-6" onClick={() => reset()}>Reintentar</Button>
    </main>
  );
}

