import { Suspense } from "react";
import { AdminPanel } from "@/components/booking/admin-panel";
import { listBloqueos, listReservas } from "@/lib/demo-data";
import { Skeleton } from "@/components/ui/skeleton";

function AdminContent() {
  return <AdminPanel initialReservas={listReservas()} initialBloqueos={listBloqueos()} />;
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

