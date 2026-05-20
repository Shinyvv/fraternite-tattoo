import { NextResponse } from "next/server";
import { removeReserva } from "@/lib/demo-data";

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const removed = removeReserva(id);
  return NextResponse.json({ ok: removed });
}

