import { z } from "zod";

export const bookingSchema = z.object({
  nombre: z.string().min(2),
  email: z.string().email(),
  telefono: z.string().min(8),
  servicio: z.enum(["TATUAJE", "PIERCING", "CONSULTA"]),
  fecha: z.string().datetime(),
  hora: z.string().regex(/^\d{2}:\d{2}$/),
  duracion: z.number().int().min(30).max(360),
  descripcion: z.string().min(5).max(500)
});

export const blockSchema = z.object({
  fecha: z.string().datetime(),
  hora: z.string().regex(/^\d{2}:\d{2}$/),
  duracion: z.number().int().min(30).max(360),
  motivo: z.string().max(140).optional()
});

export const availabilitySchema = z.object({
  openHour: z.number().int().min(0).max(23),
  closeHour: z.number().int().min(1).max(24),
  slotInterval: z.number().int().min(15).max(60)
}).refine((value) => value.closeHour > value.openHour, {
  message: "closeHour debe ser mayor que openHour"
});

