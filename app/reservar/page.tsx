import { Suspense } from "react";
import { BookingForm } from "@/components/booking/booking-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReservarPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <Suspense fallback={<Skeleton className="h-[640px] w-full" />}>
        <BookingForm />
      </Suspense>
    </main>
  );
}

