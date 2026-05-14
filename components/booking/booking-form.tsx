"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { buildSlots, serviceDurations, serviceLabels, type ServiceKey } from "@/lib/booking";
import { bookingSchema } from "@/lib/validators";

interface AvailabilityResponse {
  booked: Array<{ hora: string; duracion: number }>;
  blocked: Array<{ hora: string; duracion: number }>;
  settings: { openHour: number; closeHour: number; slotInterval: number };
}

type BookingFormData = {
  nombre: string;
  email: string;
  telefono: string;
  servicio: ServiceKey;
  fecha: string;
  hora: string;
  duracion: number;
  descripcion: string;
};

export function BookingForm() {
  const [day, setDay] = useState<Date | undefined>(new Date());
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      nombre: "",
      email: "",
      telefono: "",
      servicio: "TATUAJE",
      fecha: new Date().toISOString(),
      hora: "",
      duracion: 120,
      descripcion: ""
    }
  });

  const servicio = form.watch("servicio");

  useEffect(() => {
    const duration = serviceDurations[servicio][0];
    form.setValue("duracion", duration);
  }, [form, servicio]);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!day) return;
      setLoadingSlots(true);
      const res = await fetch(`/api/reservas?date=${day.toISOString()}`);
      const payload: AvailabilityResponse = await res.json();
      setAvailability(payload);
      setLoadingSlots(false);
    };

    void fetchAvailability();
  }, [day]);

  const slots = useMemo(() => {
    if (!availability) return [];
    return buildSlots(availability.settings.openHour, availability.settings.closeHour, availability.settings.slotInterval);
  }, [availability]);

  const unavailable = useMemo(() => {
    if (!availability) return new Set<string>();
    return new Set([
      ...availability.booked.map((item) => item.hora),
      ...availability.blocked.map((item) => item.hora)
    ]);
  }, [availability]);

  const onSubmit = form.handleSubmit(async (values) => {
    const targetDate = day ?? new Date();
    const body = { ...values, fecha: targetDate.toISOString() };
    const res = await fetch("/api/reservas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const payload = await res.json();
      toast.error(payload.error ?? "No se pudo crear la reserva");
      return;
    }

    toast.success("Reserva confirmada", {
      description: `${values.nombre} | ${serviceLabels[values.servicio]} | ${values.hora}`
    });

    form.reset({
      nombre: "",
      email: "",
      telefono: "",
      servicio: "TATUAJE",
      fecha: new Date().toISOString(),
      hora: "",
      duracion: 120,
      descripcion: ""
    });
  });

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
      <Card className="grid gap-6 p-5 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-2xl font-black uppercase">Reserva tu cita</h2>
          <Calendar mode="single" selected={day} onSelect={setDay} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} />
        </div>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-3">
            <FormField control={form.control} name="nombre" render={({ field }) => <FormItem><FormLabel>Nombre</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage name="nombre" /></FormItem>} />
            <FormField control={form.control} name="email" render={({ field }) => <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage name="email" /></FormItem>} />
            <FormField control={form.control} name="telefono" render={({ field }) => <FormItem><FormLabel>TelÃ©fono</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage name="telefono" /></FormItem>} />

            <FormField control={form.control} name="servicio" render={({ field }) => (
              <FormItem><FormLabel>Servicio</FormLabel><FormControl><Select value={field.value} onValueChange={(value) => field.onChange(value)}><SelectTrigger /><SelectContent>
                <SelectItem value="TATUAJE">Tatuaje</SelectItem><SelectItem value="PIERCING">Piercing</SelectItem><SelectItem value="CONSULTA">Consulta</SelectItem>
              </SelectContent></Select></FormControl><FormMessage name="servicio" /></FormItem>
            )} />

            <FormField control={form.control} name="duracion" render={({ field }) => (
              <FormItem><FormLabel>DuraciÃ³n</FormLabel><FormControl><Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}><SelectTrigger /><SelectContent>
                {serviceDurations[servicio].map((duration) => <SelectItem key={duration} value={String(duration)}>{duration} min</SelectItem>)}
              </SelectContent></Select></FormControl><FormMessage name="duracion" /></FormItem>
            )} />

            <FormField control={form.control} name="hora" render={({ field }) => (
              <FormItem><FormLabel>Hora</FormLabel><FormControl><Select value={field.value} onValueChange={field.onChange}><SelectTrigger />
                <SelectContent>
                  {loadingSlots ? <SelectItem value="loading" disabled>Cargando...</SelectItem> : slots.map((slot) => (
                    <SelectItem key={slot} value={slot} disabled={unavailable.has(slot)}>{slot}{unavailable.has(slot) ? " (ocupado)" : ""}</SelectItem>
                  ))}
                </SelectContent>
              </Select></FormControl><FormMessage name="hora" /></FormItem>
            )} />

            <FormField control={form.control} name="descripcion" render={({ field }) => <FormItem><FormLabel>DescripciÃ³n</FormLabel><FormControl><Textarea {...field} placeholder="Idea, estilo, zona del cuerpo..." /></FormControl><FormMessage name="descripcion" /></FormItem>} />

            <Button type="submit" className="w-full" size="lg">Confirmar reserva {day ? format(day, "dd/MM") : ""}</Button>
          </form>
        </Form>
      </Card>
    </motion.div>
  );
}

