import { addMinutes, format, isBefore, parse, startOfDay } from "date-fns";

export const serviceDurations = {
  TATUAJE: [120, 180, 240, 300, 360],
  PIERCING: [30],
  CONSULTA: [30]
} as const;

export type ServiceKey = keyof typeof serviceDurations;

export const serviceLabels: Record<ServiceKey, string> = {
  TATUAJE: "Tatuaje",
  PIERCING: "Piercing",
  CONSULTA: "Consulta"
};

export function toDateAtTime(date: Date, time: string) {
  return parse(time, "HH:mm", startOfDay(date));
}

export function endDateFromDuration(date: Date, time: string, duration: number) {
  return addMinutes(toDateAtTime(date, time), duration);
}

export function hasOverlap(
  targetStart: Date,
  targetEnd: Date,
  items: Array<{ start: Date; end: Date }>
) {
  return items.some((item) => targetStart < item.end && targetEnd > item.start);
}

export function buildSlots(openHour: number, closeHour: number, slotInterval: number) {
  const slots: string[] = [];
  for (let hour = openHour; hour < closeHour; hour += 1) {
    for (let minute = 0; minute < 60; minute += slotInterval) {
      if (hour === closeHour) {
        break;
      }
      slots.push(format(new Date(2000, 1, 1, hour, minute), "HH:mm"));
    }
  }
  return slots;
}

export function isPastDay(day: Date) {
  return isBefore(startOfDay(day), startOfDay(new Date()));
}

