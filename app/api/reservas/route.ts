import { startOfDay } from "date-fns";
import { NextResponse } from "next/server";
import { endDateFromDuration, hasOverlap, isPastDay, toDateAtTime } from "@/lib/booking";
import {
  addReserva,
  getSettings,
  listBloqueos,
  listReservas,
  type ReservaSerializada
} from "@/lib/demo-data";
import { bookingSchema } from "@/lib/validators";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("date");

  if (!dateParam) {
    return NextResponse.json(listReservas());
  }

  const date = startOfDay(new Date(dateParam));
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 1);

  const booked = listReservas()
    .filter((item) => {
      const itemDate = startOfDay(new Date(item.fecha));
      return itemDate >= date && itemDate < nextDate;
    })
    .map((item) => ({ hora: item.hora, duracion: item.duracion }));
  const blocked = listBloqueos()
    .filter((item) => {
      const itemDate = startOfDay(new Date(item.fecha));
      return itemDate >= date && itemDate < nextDate;
    })
    .map((item) => ({ hora: item.hora, duracion: item.duracion }));
  const settings = getSettings();

  return NextResponse.json({ booked, blocked, settings });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = bookingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos invÃ¡lidos" }, { status: 400 });
  }

  const data = parsed.data;
  const targetDate = startOfDay(new Date(data.fecha));

  if (isPastDay(targetDate)) {
    return NextResponse.json({ error: "No se puede reservar en fechas pasadas" }, { status: 400 });
  }

  const targetStart = toDateAtTime(targetDate, data.hora);
  const targetEnd = endDateFromDuration(targetDate, data.hora, data.duracion);

  const nextDay = new Date(targetDate);
  nextDay.setDate(nextDay.getDate() + 1);

  const reservas = listReservas().filter((item) => {
    const itemDate = startOfDay(new Date(item.fecha));
    return itemDate >= targetDate && itemDate < nextDay;
  });
  const bloqueos = listBloqueos().filter((item) => {
    const itemDate = startOfDay(new Date(item.fecha));
    return itemDate >= targetDate && itemDate < nextDay;
  });

  const merged = [...reservas, ...bloqueos].map((item) => ({
    start: toDateAtTime(targetDate, item.hora),
    end: endDateFromDuration(targetDate, item.hora, item.duracion)
  }));

  if (hasOverlap(targetStart, targetEnd, merged)) {
    return NextResponse.json({ error: "Horario no disponible" }, { status: 409 });
  }

  const created = addReserva({
    nombre: data.nombre,
    email: data.email,
    telefono: data.telefono,
    servicio: data.servicio,
    fecha: new Date(data.fecha).toISOString(),
    hora: data.hora,
    duracion: data.duracion,
    descripcion: data.descripcion
  } satisfies Omit<ReservaSerializada, "id">);
  return NextResponse.json(created, { status: 201 });
}

