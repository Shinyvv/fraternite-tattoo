import { NextResponse } from "next/server";
import { removeBloqueo } from "@/lib/demo-data";

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const removed = removeBloqueo(id);
  return NextResponse.json({ ok: removed });
}

