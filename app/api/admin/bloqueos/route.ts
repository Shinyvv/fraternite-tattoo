import { startOfDay } from "date-fns";
import { NextResponse } from "next/server";
import { endDateFromDuration, hasOverlap, toDateAtTime } from "@/lib/booking";
import { prisma } from "@/lib/prisma";
import { blockSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = blockSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos invÃ¡lidos" }, { status: 400 });
  }

  const data = parsed.data;
  const day = startOfDay(new Date(data.fecha));
  const dayEnd = new Date(day);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const [reservas, bloqueos] = await Promise.all([
    prisma.reserva.findMany({ where: { fecha: { gte: day, lt: dayEnd } }, select: { hora: true, duracion: true } }),
    prisma.blockedSlot.findMany({ where: { fecha: { gte: day, lt: dayEnd } }, select: { hora: true, duracion: true } })
  ]);

  const start = toDateAtTime(day, data.hora);
  const end = endDateFromDuration(day, data.hora, data.duracion);
  const merged = [...reservas, ...bloqueos].map((item) => ({ start: toDateAtTime(day, item.hora), end: endDateFromDuration(day, item.hora, item.duracion) }));

  if (hasOverlap(start, end, merged)) {
    return NextResponse.json({ error: "Este tramo ya estÃ¡ ocupado" }, { status: 409 });
  }

  const created = await prisma.blockedSlot.create({ data: { ...data, fecha: day } });
  return NextResponse.json(created, { status: 201 });
}

