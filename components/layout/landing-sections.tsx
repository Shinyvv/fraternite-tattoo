"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  { name: "Tatuajes", description: "Disenos custom con sesiones largas y detalle extremo.", tone: "#ff2a2a" },
  { name: "Piercings", description: "Perforacion segura con joyeria premium y protocolo esteril.", tone: "#ff5a00" },
  { name: "Insumos", description: "Venta de productos para cuidado y curacion profesional.", tone: "#ffcc00" }
];

export function LandingSections() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-12 px-4 py-10">
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="grid-bg relative overflow-hidden rounded-2xl border border-[#282828] p-8">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[#ff2a2a]/20 blur-3xl" />
        <Image src="/tiger-logo.svg" alt="Logo Tigre La Fraternite" width={120} height={120} className="mb-4 glow-fire rounded-xl p-1" priority />
        <Badge className="mb-4 border-[#ff5a00]/70 text-[#ffcc00]">Talagante, Chile</Badge>
        <h1 className="max-w-xl text-4xl font-black uppercase leading-tight md:text-6xl">Tatuajes que marcan identidad</h1>
        <p className="mt-4 max-w-lg text-[#d0d0d0]">Underground moderno. Cultura tattoo real. Reserva en segundos y asegura tu sesion.</p>
        <Button asChild size="lg" className="mt-8"><Link href="/reservar">Reservar ahora</Link></Button>
      </motion.section>

      <section>
        <h2 className="mb-4 text-2xl font-black uppercase">Servicios</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {services.map((service) => (
            <Card key={service.name} className="transition hover:-translate-y-1 hover:border-[#ff5a00]">
              <CardHeader>
                <Badge className="w-fit" style={{ borderColor: service.tone, color: service.tone }}>{service.name}</Badge>
                <CardTitle>{service.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[#2d2d2d] bg-gradient-to-r from-[#110000] to-[#1a0900] p-8 text-center">
        <h3 className="text-3xl font-black uppercase">Agenda tu sesion</h3>
        <p className="mx-auto mt-3 max-w-xl text-[#cecece]">Bloques reales de disponibilidad, sin sobreventa y con confirmacion inmediata.</p>
        <Button asChild size="lg" className="mt-6"><Link href="/reservar">Reservar</Link></Button>
      </section>
    </main>
  );
}
