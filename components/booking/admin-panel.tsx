"use client";

import { useState } from "react";
import { format } from "date-fns";
import type { BloqueoSerializado, ReservaSerializada } from "@/lib/demo-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

export function AdminPanel({
  initialReservas,
  initialBloqueos
}: {
  initialReservas: ReservaSerializada[];
  initialBloqueos: BloqueoSerializado[];
}) {
  const [reservas, setReservas] = useState(initialReservas);
  const [bloqueos, setBloqueos] = useState(initialBloqueos);
  const [bloqueo, setBloqueo] = useState({ fecha: "", hora: "", duracion: 60, motivo: "" });
  const [settings, setSettings] = useState({ openHour: 11, closeHour: 21, slotInterval: 30 });

  async function removeReserva(id: string) {
    const res = await fetch(`/api/reservas/${id}`, { method: "DELETE" });
    if (!res.ok) return toast.error("No se pudo eliminar");
    setReservas((prev) => prev.filter((item) => item.id !== id));
    toast.success("Reserva eliminada");
  }

  async function createBloqueo() {
    const res = await fetch("/api/admin/bloqueos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...bloqueo, fecha: new Date(bloqueo.fecha).toISOString() }) });
    if (!res.ok) return toast.error("No se pudo bloquear");
    const data = await res.json();
    setBloqueos((prev) => [data, ...prev]);
    toast.success("Horario bloqueado");
  }

  async function removeBloqueo(id: string) {
    const res = await fetch(`/api/admin/bloqueos/${id}`, { method: "DELETE" });
    if (!res.ok) return toast.error("No se pudo desbloquear");
    setBloqueos((prev) => prev.filter((item) => item.id !== id));
  }

  async function saveSettings() {
    const res = await fetch("/api/admin/disponibilidad", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
    if (!res.ok) return toast.error("No se pudo actualizar disponibilidad");
    toast.success("Disponibilidad actualizada");
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-xl font-black uppercase">Reservas</h2>
        <Table>
          <TableHeader><TableRow><TableHead>Cliente</TableHead><TableHead>Servicio</TableHead><TableHead>Fecha</TableHead><TableHead>DuraciÃ³n</TableHead><TableHead /></TableRow></TableHeader>
          <TableBody>
            {reservas.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.nombre}<div className="text-xs text-[#9c9c9c]">{item.email}</div></TableCell>
                <TableCell><Badge>{item.servicio}</Badge></TableCell>
                <TableCell>{format(new Date(item.fecha), "dd/MM/yyyy")} {item.hora}</TableCell>
                <TableCell>{item.duracion} min</TableCell>
                <TableCell><Button variant="destructive" size="sm" onClick={() => void removeReserva(item.id)}>Eliminar</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-[#2d2d2d] p-4">
          <h3 className="mb-3 font-black uppercase">Bloquear horario</h3>
          <div className="space-y-2">
            <Input type="date" value={bloqueo.fecha} onChange={(e) => setBloqueo((p) => ({ ...p, fecha: e.target.value }))} />
            <Input placeholder="Hora HH:mm" value={bloqueo.hora} onChange={(e) => setBloqueo((p) => ({ ...p, hora: e.target.value }))} />
            <Input type="number" value={bloqueo.duracion} onChange={(e) => setBloqueo((p) => ({ ...p, duracion: Number(e.target.value) }))} />
            <Input placeholder="Motivo" value={bloqueo.motivo} onChange={(e) => setBloqueo((p) => ({ ...p, motivo: e.target.value }))} />
            <Button onClick={() => void createBloqueo()} className="w-full">Bloquear</Button>
          </div>
          <div className="mt-4 space-y-2">
            {bloqueos.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-md border border-[#252525] p-2 text-sm">
                <span>{format(new Date(item.fecha), "dd/MM")} {item.hora} ({item.duracion}m)</span>
                <Button size="sm" variant="outline" onClick={() => void removeBloqueo(item.id)}>Quitar</Button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[#2d2d2d] p-4">
          <h3 className="mb-3 font-black uppercase">Disponibilidad</h3>
          <div className="space-y-2">
            <Input type="number" value={settings.openHour} onChange={(e) => setSettings((p) => ({ ...p, openHour: Number(e.target.value) }))} placeholder="Apertura" />
            <Input type="number" value={settings.closeHour} onChange={(e) => setSettings((p) => ({ ...p, closeHour: Number(e.target.value) }))} placeholder="Cierre" />
            <Input type="number" value={settings.slotInterval} onChange={(e) => setSettings((p) => ({ ...p, slotInterval: Number(e.target.value) }))} placeholder="Intervalo" />
            <Button onClick={() => void saveSettings()} className="w-full">Guardar disponibilidad</Button>
          </div>
        </div>
      </section>
    </div>
  );
}

