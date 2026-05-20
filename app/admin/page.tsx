import { Suspense } from "react";
import { AdminPanel, type BloqueoSerializado, type ReservaSerializada } from "@/components/booking/admin-panel";
import type { BlockedSlot, Reserva } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Skeleton } from "@/components/ui/skeleton";

function toIsoDate(value: Date) {
  return value.toISOString();
}

function serializeReserva(item: Reserva): ReservaSerializada {
  return {
    id: item.id,
    nombre: item.nombre,
    email: item.email,
    telefono: item.telefono,
    servicio: item.servicio,
    fecha: toIsoDate(item.fecha),
    hora: item.hora,
    duracion: item.duracion
  };
}

function serializeBloqueo(item: BlockedSlot): BloqueoSerializado {
  return {
    id: item.id,
    fecha: toIsoDate(item.fecha),
    hora: item.hora,
    duracion: item.duracion,
    motivo: item.motivo
  };
}

async function AdminContent() {
  const [reservas, bloqueos]: [Reserva[], BlockedSlot[]] = await Promise.all([
    prisma.reserva.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.blockedSlot.findMany({ orderBy: { createdAt: "desc" }, take: 40 })
  ]);

  return (
    <AdminPanel
      initialReservas={reservas.map((item) => serializeReserva(item))}
      initialBloqueos={bloqueos.map((item) => serializeBloqueo(item))}
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

