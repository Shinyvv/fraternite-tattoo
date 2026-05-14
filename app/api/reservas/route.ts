import { startOfDay } from "date-fns";
import { NextResponse } from "next/server";
import { endDateFromDuration, hasOverlap, isPastDay, toDateAtTime } from "@/lib/booking";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validators";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("date");

  if (!dateParam) {
    const reservas = await prisma.reserva.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
    return NextResponse.json(reservas);
  }

  const date = startOfDay(new Date(dateParam));
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 1);

  const [booked, blocked, settings] = await Promise.all([
    prisma.reserva.findMany({ where: { fecha: { gte: date, lt: nextDate } }, select: { hora: true, duracion: true } }),
    prisma.blockedSlot.findMany({ where: { fecha: { gte: date, lt: nextDate } }, select: { hora: true, duracion: true } }),
    prisma.studioSetting.upsert({ where: { id: "main" }, update: {}, create: { id: "main" } })
  ]);

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

  const [reservas, bloqueos] = await Promise.all([
    prisma.reserva.findMany({ where: { fecha: { gte: targetDate, lt: nextDay } }, select: { hora: true, duracion: true } }),
    prisma.blockedSlot.findMany({ where: { fecha: { gte: targetDate, lt: nextDay } }, select: { hora: true, duracion: true } })
  ]);

  const merged = [...reservas, ...bloqueos].map((item) => ({
    start: toDateAtTime(targetDate, item.hora),
    end: endDateFromDuration(targetDate, item.hora, item.duracion)
  }));

  if (hasOverlap(targetStart, targetEnd, merged)) {
    return NextResponse.json({ error: "Horario no disponible" }, { status: 409 });
  }

  const created = await prisma.reserva.create({ data: { ...data, fecha: targetDate } });
  return NextResponse.json(created, { status: 201 });
}

