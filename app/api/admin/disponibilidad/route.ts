import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { availabilitySchema } from "@/lib/validators";

export async function PATCH(request: Request) {
  const body = await request.json();
  const parsed = availabilitySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos invÃ¡lidos" }, { status: 400 });
  }

  const updated = await prisma.studioSetting.upsert({
    where: { id: "main" },
    create: { id: "main", ...parsed.data },
    update: parsed.data
  });

  return NextResponse.json(updated);
}

