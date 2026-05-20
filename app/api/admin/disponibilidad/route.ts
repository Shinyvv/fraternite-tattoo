import { NextResponse } from "next/server";
import { updateSettings } from "@/lib/demo-data";
import { availabilitySchema } from "@/lib/validators";

export async function PATCH(request: Request) {
  const body = await request.json();
  const parsed = availabilitySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos invÃ¡lidos" }, { status: 400 });
  }

  const updated = updateSettings(parsed.data);
  return NextResponse.json(updated);
}

