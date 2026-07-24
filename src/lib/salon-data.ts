import { useSyncExternalStore } from "react";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "waiting"
  | "checked_in"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

export type ServiceCategory = {
  id: string;
  name: string;
  shortName: string;
  description: string;
};

export type Specialist = {
  id: string;
  name: string;
  role: string;
  initials: string;
  serviceCategories: string[];
};

export type Service = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  buffer: number;
  enabled: boolean;
  specialistIds: string[];
};

export type Appointment = {
  id: string;
  bookingReference: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceId: string;
  specialistId: string | "any";
  appointmentDate: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  totalPrice: number;
  notes?: string;
  inspirationImageUrl?: string;
  inspirationLabel?: string;
  preferredContactMethod: "whatsapp" | "phone" | "email";
  status: AppointmentStatus;
  createdAt: string;
};

type SalonState = {
  categories: ServiceCategory[];
  specialists: Specialist[];
  services: Service[];
  appointments: Appointment[];
};

const categories: ServiceCategory[] = [
  {
    id: "nails",
    name: "Manicure & Nails",
    shortName: "Nails",
    description: "Precision manicure, sculpting and modern finishes.",
  },
  {
    id: "pedicure",
    name: "Pedicure",
    shortName: "Pedicure",
    description: "Restorative foot rituals in our quiet lounge.",
  },
  {
    id: "laser",
    name: "Laser Sessions",
    shortName: "Laser",
    description: "Private, considered treatments with modern technology.",
  },
  {
    id: "spa",
    name: "Spa & Massage",
    shortName: "Spa",
    description: "Slow, sensory rituals for complete restoration.",
  },
  {
    id: "jacuzzi",
    name: "Jacuzzi",
    shortName: "Jacuzzi",
    description: "Private water rituals and unhurried calm.",
  },
  {
    id: "packages",
    name: "Beauty Packages",
    shortName: "Packages",
    description: "Thoughtfully composed full-day experiences.",
  },
];

const specialists: Specialist[] = [
  {
    id: "layla",
    name: "Layla Farouk",
    role: "Master Nail Artist",
    initials: "LF",
    serviceCategories: ["nails", "pedicure"],
  },
  {
    id: "sara",
    name: "Sara Al-Hashimi",
    role: "Pedicure Specialist",
    initials: "SA",
    serviceCategories: ["pedicure", "spa", "jacuzzi"],
  },
  {
    id: "noura",
    name: "Noura Khalid",
    role: "Laser Therapist",
    initials: "NK",
    serviceCategories: ["laser"],
  },
  {
    id: "amelia",
    name: "Amelia Rossi",
    role: "Spa Therapist",
    initials: "AR",
    serviceCategories: ["spa", "jacuzzi", "packages"],
  },
];

const services: Service[] = [
  {
    id: "classic-manicure",
    categoryId: "nails",
    name: "Classic Manicure",
    description: "Care, shape and a high-shine polish finish.",
    duration: 45,
    price: 150,
    buffer: 10,
    enabled: true,
    specialistIds: ["layla"],
  },
  {
    id: "gel-manicure",
    categoryId: "nails",
    name: "Gel Manicure",
    description: "Long-wear colour with meticulous cuticle care.",
    duration: 60,
    price: 220,
    buffer: 10,
    enabled: true,
    specialistIds: ["layla"],
  },
  {
    id: "russian-manicure",
    categoryId: "nails",
    name: "Russian Manicure",
    description: "A precise dry manicure with a seamless finish.",
    duration: 75,
    price: 280,
    buffer: 15,
    enabled: true,
    specialistIds: ["layla"],
  },
  {
    id: "builder-gel",
    categoryId: "nails",
    name: "Builder Gel",
    description: "Strength and structure in a refined natural shape.",
    duration: 90,
    price: 330,
    buffer: 15,
    enabled: true,
    specialistIds: ["layla"],
  },
  {
    id: "acrylic-extensions",
    categoryId: "nails",
    name: "Acrylic Extensions",
    description: "Tailored length, silhouette and a luxury finish.",
    duration: 120,
    price: 450,
    buffer: 15,
    enabled: true,
    specialistIds: ["layla"],
  },
  {
    id: "french-manicure",
    categoryId: "nails",
    name: "French Manicure",
    description: "An editorial take on an enduring classic.",
    duration: 70,
    price: 260,
    buffer: 10,
    enabled: true,
    specialistIds: ["layla"],
  },
  {
    id: "nail-art",
    categoryId: "nails",
    name: "Nail Art",
    description: "A custom, expressive finish created at the atelier.",
    duration: 90,
    price: 360,
    buffer: 15,
    enabled: true,
    specialistIds: ["layla"],
  },
  {
    id: "nail-repair",
    categoryId: "nails",
    name: "Nail Repair",
    description: "A focused restorative appointment for one or more nails.",
    duration: 30,
    price: 90,
    buffer: 5,
    enabled: true,
    specialistIds: ["layla"],
  },
  {
    id: "classic-pedicure",
    categoryId: "pedicure",
    name: "Classic Pedicure",
    description: "An immaculate polish ritual with detailed care.",
    duration: 60,
    price: 210,
    buffer: 10,
    enabled: true,
    specialistIds: ["sara"],
  },
  {
    id: "gel-pedicure",
    categoryId: "pedicure",
    name: "Gel Pedicure",
    description: "Long-wear colour and soft, restorative finishing.",
    duration: 75,
    price: 270,
    buffer: 10,
    enabled: true,
    specialistIds: ["sara"],
  },
  {
    id: "spa-pedicure",
    categoryId: "pedicure",
    name: "Spa Pedicure",
    description: "Exfoliation, mask and warm water therapy.",
    duration: 90,
    price: 340,
    buffer: 15,
    enabled: true,
    specialistIds: ["sara"],
  },
  {
    id: "luxury-pedicure",
    categoryId: "pedicure",
    name: "Luxury Pedicure",
    description: "Our most enveloping foot ritual, complete with massage.",
    duration: 105,
    price: 420,
    buffer: 15,
    enabled: true,
    specialistIds: ["sara"],
  },
  {
    id: "full-body-laser",
    categoryId: "laser",
    name: "Full Body Laser",
    description: "A private full-body consultation and laser session.",
    duration: 120,
    price: 1250,
    buffer: 20,
    enabled: true,
    specialistIds: ["noura"],
  },
  {
    id: "full-legs-laser",
    categoryId: "laser",
    name: "Full Legs Laser",
    description: "A tailored full-leg laser session.",
    duration: 60,
    price: 520,
    buffer: 15,
    enabled: true,
    specialistIds: ["noura"],
  },
  {
    id: "underarms-laser",
    categoryId: "laser",
    name: "Underarms Laser",
    description: "A focused, discreet laser treatment.",
    duration: 25,
    price: 160,
    buffer: 10,
    enabled: true,
    specialistIds: ["noura"],
  },
  {
    id: "brazilian-laser",
    categoryId: "laser",
    name: "Brazilian Laser",
    description: "A carefully managed private laser appointment.",
    duration: 45,
    price: 390,
    buffer: 15,
    enabled: true,
    specialistIds: ["noura"],
  },
  {
    id: "face-laser",
    categoryId: "laser",
    name: "Face Laser",
    description: "A gentle targeted facial laser session.",
    duration: 30,
    price: 240,
    buffer: 10,
    enabled: true,
    specialistIds: ["noura"],
  },
  {
    id: "private-jacuzzi",
    categoryId: "jacuzzi",
    name: "Private Jacuzzi Session",
    description: "A private candlelit water ritual in our spa suite.",
    duration: 60,
    price: 480,
    buffer: 20,
    enabled: true,
    specialistIds: ["amelia", "sara"],
  },
  {
    id: "relaxation-massage",
    categoryId: "spa",
    name: "Relaxation Massage",
    description: "A slow full-body release with warm aromatic oils.",
    duration: 60,
    price: 420,
    buffer: 15,
    enabled: true,
    specialistIds: ["amelia"],
  },
  {
    id: "deep-relaxation",
    categoryId: "spa",
    name: "Deep Relaxation Massage",
    description: "A longer restorative ritual for complete release.",
    duration: 90,
    price: 590,
    buffer: 15,
    enabled: true,
    specialistIds: ["amelia"],
  },
  {
    id: "body-scrub",
    categoryId: "spa",
    name: "Body Scrub",
    description: "A luminous exfoliating ritual with silk-soft finishing.",
    duration: 45,
    price: 340,
    buffer: 10,
    enabled: true,
    specialistIds: ["amelia"],
  },
  {
    id: "facial-treatment",
    categoryId: "spa",
    name: "Facial Treatment",
    description: "A tailored facial ritual for clarity and glow.",
    duration: 60,
    price: 430,
    buffer: 15,
    enabled: true,
    specialistIds: ["amelia"],
  },
  {
    id: "full-beauty-day",
    categoryId: "packages",
    name: "Full Beauty Day",
    description: "A composed journey across nails, spa and private water ritual.",
    duration: 240,
    price: 1500,
    buffer: 30,
    enabled: true,
    specialistIds: ["amelia", "layla"],
  },
  {
    id: "bridal-spa",
    categoryId: "packages",
    name: "Bridal Spa Package",
    description: "A calm, luminous preparation ritual for your day.",
    duration: 180,
    price: 1200,
    buffer: 30,
    enabled: true,
    specialistIds: ["amelia"],
  },
];

const initialState: SalonState = { categories, specialists, services, appointments: [] };
const storageKey = "elan-salon-demo-v1";
const changeEvent = "elan-salon-data-change";
let state = initialState;
let hydrated = false;

function isBrowser() {
  return typeof window !== "undefined";
}

function hydrate() {
  if (!isBrowser() || hydrated) return;
  hydrated = true;
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<SalonState>;
      state = {
        categories: parsed.categories?.length ? parsed.categories : categories,
        specialists: parsed.specialists?.length ? parsed.specialists : specialists,
        services: parsed.services?.length ? parsed.services : services,
        appointments: parsed.appointments ?? [],
      };
    }
  } catch {
    state = initialState;
  }
}

function broadcast() {
  if (!isBrowser()) return;
  window.localStorage.setItem(storageKey, JSON.stringify(state));
  window.dispatchEvent(new Event(changeEvent));
}

function update(next: Partial<SalonState>) {
  hydrate();
  state = { ...state, ...next };
  broadcast();
}

function subscribe(callback: () => void) {
  if (!isBrowser()) return () => undefined;
  window.addEventListener(changeEvent, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(changeEvent, callback);
    window.removeEventListener("storage", callback);
  };
}

function snapshot() {
  hydrate();
  return state;
}

export function useSalonData() {
  return useSyncExternalStore(subscribe, snapshot, () => initialState);
}

export function getSalonSnapshot() {
  return snapshot();
}

export function getService(serviceId?: string) {
  return snapshot().services.find((service) => service.id === serviceId);
}

export function getSpecialistsForService(serviceId?: string) {
  const service = getService(serviceId);
  if (!service) return [];
  return snapshot().specialists.filter((specialist) =>
    service.specialistIds.includes(specialist.id),
  );
}

export function upsertService(service: Service) {
  const existing = snapshot().services;
  const index = existing.findIndex((item) => item.id === service.id);
  const next = [...existing];
  if (index === -1) next.push(service);
  else next[index] = service;
  update({ services: next });
}

export function archiveService(serviceId: string) {
  const service = getService(serviceId);
  if (service) upsertService({ ...service, enabled: false });
}

export function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  update({
    appointments: snapshot().appointments.map((appointment) =>
      appointment.id === id ? { ...appointment, status } : appointment,
    ),
  });
}

export function getAvailableSlots(date: string, serviceId?: string, specialistId?: string | "any") {
  const service = getService(serviceId);
  if (!service || !date) return [];
  const candidates =
    specialistId && specialistId !== "any" ? [specialistId] : service.specialistIds;
  const starts = [
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
  ];
  const duration = service.duration + service.buffer;
  const booked = snapshot().appointments.filter(
    (appointment) =>
      appointment.appointmentDate === date &&
      !["cancelled", "no_show"].includes(appointment.status),
  );
  return starts.filter((start) =>
    candidates.some(
      (candidate) =>
        !booked.some(
          (appointment) =>
            appointment.specialistId === candidate &&
            overlaps(start, duration, appointment.startTime, appointment.durationMinutes),
        ),
    ),
  );
}

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function fromMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function overlaps(startA: string, durationA: number, startB: string, durationB: number) {
  const a = toMinutes(startA);
  const b = toMinutes(startB);
  return a < b + durationB && b < a + durationA;
}

export type BookingDraft = Omit<
  Appointment,
  "id" | "bookingReference" | "endTime" | "status" | "createdAt"
>;

export function createAppointment(draft: BookingDraft) {
  const service = getService(draft.serviceId);
  if (!service || !service.enabled)
    return { ok: false as const, error: "That service is no longer available." };
  const candidates = draft.specialistId === "any" ? service.specialistIds : [draft.specialistId];
  const current = snapshot().appointments;
  const selected = candidates.find(
    (candidate) =>
      !current.some(
        (appointment) =>
          appointment.appointmentDate === draft.appointmentDate &&
          appointment.specialistId === candidate &&
          !["cancelled", "no_show"].includes(appointment.status) &&
          overlaps(
            draft.startTime,
            service.duration + service.buffer,
            appointment.startTime,
            appointment.durationMinutes,
          ),
      ),
  );
  if (!selected)
    return {
      ok: false as const,
      error: "That time has just been taken. Please choose another time.",
    };

  const appointment: Appointment = {
    ...draft,
    id: crypto.randomUUID(),
    bookingReference: `ELN-${Math.random().toString(36).slice(2, 7).toUpperCase()}-${String(Date.now()).slice(-4)}`,
    specialistId: selected,
    endTime: fromMinutes(toMinutes(draft.startTime) + service.duration),
    durationMinutes: service.duration,
    totalPrice: service.price,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  update({ appointments: [...current, appointment] });
  return { ok: true as const, appointment };
}

export function resetSalonDemo() {
  state = initialState;
  hydrated = true;
  broadcast();
}
