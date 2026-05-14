import { Suspense } from "react";
import { AdminPanel } from "@/components/booking/admin-panel";
import { prisma } from "@/lib/prisma";
import { Skeleton } from "@/components/ui/skeleton";

async function AdminContent() {
  const [reservas, bloqueos] = await Promise.all([
    prisma.reserva.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.blockedSlot.findMany({ orderBy: { createdAt: "desc" }, take: 40 })
  ]);

  return (
    <AdminPanel
      initialReservas={reservas.map((item) => ({ ...item, fecha: item.fecha.toISOString() }))}
      initialBloqueos={bloqueos.map((item) => ({ ...item, fecha: item.fecha.toISOString() }))}
    />
  );
}

export default function AdminPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-black uppercase">Panel Admin</h1>
      <Suspense fallback={<Skeleton className="h-[520px] w-full" />}>
        <AdminContent />
      </Suspense>
    </main>
  );
}

