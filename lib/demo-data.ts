export type ServiceType = "TATUAJE" | "PIERCING" | "CONSULTA";

export type ReservaSerializada = {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  servicio: ServiceType;
  fecha: string;
  hora: string;
  duracion: number;
  descripcion: string;
};

export type BloqueoSerializado = {
  id: string;
  fecha: string;
  hora: string;
  duracion: number;
  motivo: string | null;
};

export type StudioSettings = {
  openHour: number;
  closeHour: number;
  slotInterval: number;
};

const demoReservas: ReservaSerializada[] = [
  {
    id: "demo-reserva-1",
    nombre: "Camila Torres",
    email: "camila@example.com",
    telefono: "+34 600 111 222",
    servicio: "TATUAJE",
    fecha: new Date().toISOString(),
    hora: "12:00",
    duracion: 120,
    descripcion: "Diseno minimalista en antebrazo"
  },
  {
    id: "demo-reserva-2",
    nombre: "Luis Perez",
    email: "luis@example.com",
    telefono: "+34 600 333 444",
    servicio: "PIERCING",
    fecha: new Date(Date.now() + 86400000).toISOString(),
    hora: "16:30",
    duracion: 30,
    descripcion: "Piercing en oreja izquierda"
  }
];

const demoBloqueos: BloqueoSerializado[] = [
  {
    id: "demo-bloqueo-1",
    fecha: new Date().toISOString(),
    hora: "18:00",
    duracion: 60,
    motivo: "Mantenimiento del estudio"
  }
];

let demoSettings: StudioSettings = {
  openHour: 11,
  closeHour: 21,
  slotInterval: 30
};

function createDemoId(prefix: string) {
  if (globalThis.crypto && "randomUUID" in globalThis.crypto) {
    return `${prefix}-${globalThis.crypto.randomUUID()}`;
  }
  const randomPart = Math.random().toString(16).slice(2);
  return `${prefix}-${Date.now()}-${randomPart}`;
}

export function listReservas() {
  return [...demoReservas];
}

export function listBloqueos() {
  return [...demoBloqueos];
}

export function getSettings() {
  return { ...demoSettings };
}

export function updateSettings(next: StudioSettings) {
  demoSettings = { ...next };
  return getSettings();
}

export function addReserva(payload: Omit<ReservaSerializada, "id">) {
  const created: ReservaSerializada = { ...payload, id: createDemoId("demo-reserva") };
  demoReservas.unshift(created);
  return created;
}

export function removeReserva(id: string) {
  const index = demoReservas.findIndex((item) => item.id === id);
  if (index >= 0) {
    demoReservas.splice(index, 1);
    return true;
  }
  return false;
}

export function addBloqueo(payload: Omit<BloqueoSerializado, "id">) {
  const created: BloqueoSerializado = { ...payload, id: createDemoId("demo-bloqueo") };
  demoBloqueos.unshift(created);
  return created;
}

export function removeBloqueo(id: string) {
  const index = demoBloqueos.findIndex((item) => item.id === id);
  if (index >= 0) {
    demoBloqueos.splice(index, 1);
    return true;
  }
  return false;
}
