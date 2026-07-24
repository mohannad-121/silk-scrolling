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
export type Bilingual = { nameEn: string; nameAr: string };
export type ServiceCategory = Bilingual & {
  id: string;
  shortNameEn: string;
  shortNameAr: string;
  descriptionEn: string;
  descriptionAr: string;
};
export type Specialist = Bilingual & {
  id: string;
  roleEn: string;
  roleAr: string;
  initials: string;
  serviceCategories: string[];
};
export type Service = Bilingual & {
  id: string;
  categoryId: string;
  descriptionEn: string;
  descriptionAr: string;
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
    nameEn: "Manicure & Nails",
    nameAr: "مانيكير وأظافر",
    shortNameEn: "Nails",
    shortNameAr: "أظافر",
    descriptionEn: "Precision manicure, sculpting and modern finishes.",
    descriptionAr: "مانيكير دقيق ونحت ولمسات عصرية.",
  },
  {
    id: "pedicure",
    nameEn: "Pedicure",
    nameAr: "بديكير",
    shortNameEn: "Pedicure",
    shortNameAr: "بديكير",
    descriptionEn: "Restorative foot rituals in our quiet lounge.",
    descriptionAr: "طقوس قدمين مجددة في صالتنا الهادئة.",
  },
  {
    id: "laser",
    nameEn: "Laser Sessions",
    nameAr: "جلسات ليزر",
    shortNameEn: "Laser",
    shortNameAr: "ليزر",
    descriptionEn: "Private, considered treatments with modern technology.",
    descriptionAr: "جلسات خاصة ومدروسة بتقنية حديثة.",
  },
  {
    id: "spa",
    nameEn: "Spa & Massage",
    nameAr: "سبا ومساج",
    shortNameEn: "Spa",
    shortNameAr: "سبا",
    descriptionEn: "Slow, sensory rituals for complete restoration.",
    descriptionAr: "طقوس حسية هادئة لاستعادة العافية.",
  },
  {
    id: "jacuzzi",
    nameEn: "Jacuzzi",
    nameAr: "جاكوزي",
    shortNameEn: "Jacuzzi",
    shortNameAr: "جاكوزي",
    descriptionEn: "Private water rituals and unhurried calm.",
    descriptionAr: "طقوس ماء خاصة وهدوء بلا عجلة.",
  },
  {
    id: "packages",
    nameEn: "Beauty Packages",
    nameAr: "باقات الجمال",
    shortNameEn: "Packages",
    shortNameAr: "باقات",
    descriptionEn: "Thoughtfully composed full-day experiences.",
    descriptionAr: "تجارب يوم كامل مُنسقة بعناية.",
  },
];

const specialists: Specialist[] = [
  {
    id: "layla",
    nameEn: "Layla Farouk",
    nameAr: "ليلى فاروق",
    roleEn: "Master Nail Artist",
    roleAr: "خبيرة أظافر رئيسية",
    initials: "LF",
    serviceCategories: ["nails", "pedicure"],
  },
  {
    id: "sara",
    nameEn: "Sara Al-Hashimi",
    nameAr: "سارة الهاشمي",
    roleEn: "Pedicure Specialist",
    roleAr: "أخصائية بديكير",
    initials: "SA",
    serviceCategories: ["pedicure", "spa", "jacuzzi"],
  },
  {
    id: "noura",
    nameEn: "Noura Khalid",
    nameAr: "نورا خالد",
    roleEn: "Laser Therapist",
    roleAr: "أخصائية ليزر",
    initials: "NK",
    serviceCategories: ["laser"],
  },
  {
    id: "amelia",
    nameEn: "Amelia Rossi",
    nameAr: "أميليا روسي",
    roleEn: "Spa Therapist",
    roleAr: "أخصائية سبا",
    initials: "AR",
    serviceCategories: ["spa", "jacuzzi", "packages"],
  },
];

const service = (
  id: string,
  categoryId: string,
  nameEn: string,
  nameAr: string,
  descriptionEn: string,
  descriptionAr: string,
  duration: number,
  price: number,
  specialistIds: string[],
  buffer = 10,
): Service => ({
  id,
  categoryId,
  nameEn,
  nameAr,
  descriptionEn,
  descriptionAr,
  duration,
  price,
  buffer,
  enabled: true,
  specialistIds,
});
const services: Service[] = [
  service(
    "classic-manicure",
    "nails",
    "Classic Manicure",
    "مانيكير كلاسيكي",
    "Care, shape and a high-shine polish finish.",
    "عناية وتشكيل ولمسة طلاء لامعة.",
    45,
    10,
    ["layla"],
  ),
  service(
    "gel-manicure",
    "nails",
    "Gel Manicure",
    "مانيكير جل",
    "Long-wear colour with meticulous cuticle care.",
    "لون ثابت مع عناية دقيقة بالجلد المحيط.",
    60,
    18,
    ["layla"],
  ),
  service(
    "russian-manicure",
    "nails",
    "Russian Manicure",
    "مانيكير روسي",
    "A precise dry manicure with a seamless finish.",
    "مانيكير جاف دقيق بلمسة متجانسة.",
    75,
    20,
    ["layla"],
    15,
  ),
  service(
    "french-manicure",
    "nails",
    "French Manicure",
    "مانيكير فرنسي",
    "An editorial take on an enduring classic.",
    "لمسة تحريرية على كلاسيكية خالدة.",
    70,
    18,
    ["layla"],
  ),
  service(
    "builder-gel",
    "nails",
    "Builder Gel",
    "بيلدر جل",
    "Strength and structure in a refined natural shape.",
    "قوة وبنية لشكل طبيعي أنيق.",
    90,
    25,
    ["layla"],
    15,
  ),
  service(
    "acrylic-extensions",
    "nails",
    "Acrylic Extensions",
    "أكريليك",
    "Tailored length, silhouette and a luxury finish.",
    "طول وشكل مصممان لك ولمسة فاخرة.",
    120,
    30,
    ["layla"],
    15,
  ),
  service(
    "nail-art",
    "nails",
    "Nail Art",
    "فن أظافر",
    "A custom, expressive finish created at the atelier.",
    "لمسة فنية مخصصة تُصنع في الأتولييه.",
    90,
    3,
    ["layla"],
    15,
  ),
  service(
    "nail-repair",
    "nails",
    "Nail Repair",
    "إصلاح الظفر",
    "A focused restorative appointment for one or more nails.",
    "موعد إصلاحي مركز لظفر واحد أو أكثر.",
    30,
    2,
    ["layla"],
    5,
  ),
  service(
    "classic-pedicure",
    "pedicure",
    "Classic Pedicure",
    "بديكير كلاسيكي",
    "An immaculate polish ritual with detailed care.",
    "طقس طلاء متقن بعناية تفصيلية.",
    60,
    15,
    ["sara"],
  ),
  service(
    "gel-pedicure",
    "pedicure",
    "Gel Pedicure",
    "بديكير جل",
    "Long-wear colour and soft, restorative finishing.",
    "لون ثابت ولمسات ناعمة مجددة.",
    75,
    22,
    ["sara"],
  ),
  service(
    "spa-pedicure",
    "pedicure",
    "Spa Pedicure",
    "بديكير سبا",
    "Exfoliation, mask and warm water therapy.",
    "تقشير وقناع وعلاج بالماء الدافئ.",
    90,
    25,
    ["sara"],
    15,
  ),
  service(
    "luxury-pedicure",
    "pedicure",
    "Luxury Pedicure",
    "بديكير فاخر",
    "Our most enveloping foot ritual, complete with massage.",
    "أكثر طقوس القدمين دفئاً واكتمالاً مع مساج.",
    105,
    30,
    ["sara"],
    15,
  ),
  service(
    "full-body-laser",
    "laser",
    "Full Body Laser",
    "ليزر كامل الجسم",
    "A private full-body consultation and laser session.",
    "استشارة وجلسة ليزر خاصة لكامل الجسم.",
    120,
    80,
    ["noura"],
    20,
  ),
  service(
    "full-legs-laser",
    "laser",
    "Full Legs Laser",
    "ليزر كامل الساقين",
    "A tailored full-leg laser session.",
    "جلسة ليزر مخصصة لكامل الساقين.",
    60,
    45,
    ["noura"],
    15,
  ),
  service(
    "underarms-laser",
    "laser",
    "Underarms Laser",
    "ليزر تحت الإبط",
    "A focused, discreet laser treatment.",
    "جلسة ليزر مركزة وخصوصية.",
    25,
    15,
    ["noura"],
  ),
  service(
    "brazilian-laser",
    "laser",
    "Brazilian Laser",
    "ليزر برازيلي",
    "A carefully managed private laser appointment.",
    "موعد ليزر خاص ومدروس بعناية.",
    45,
    30,
    ["noura"],
    15,
  ),
  service(
    "face-laser",
    "laser",
    "Face Laser",
    "ليزر الوجه",
    "A gentle targeted facial laser session.",
    "جلسة ليزر لطيفة ومركزة للوجه.",
    30,
    20,
    ["noura"],
  ),
  service(
    "private-jacuzzi",
    "jacuzzi",
    "Private Jacuzzi Session",
    "جلسة جاكوزي خاصة",
    "A private candlelit water ritual in our spa suite.",
    "طقس ماء خاص على ضوء الشموع في جناح السبا.",
    60,
    35,
    ["amelia", "sara"],
    20,
  ),
  service(
    "relaxation-massage",
    "spa",
    "Relaxation Massage",
    "مساج استرخاء",
    "A slow full-body release with warm aromatic oils.",
    "استرخاء كامل للجسم بزيوت عطرية دافئة.",
    60,
    30,
    ["amelia"],
    15,
  ),
  service(
    "deep-relaxation",
    "spa",
    "Deep Relaxation Massage",
    "مساج استرخاء عميق",
    "A longer restorative ritual for complete release.",
    "طقس أطول لاستعادة العافية بالكامل.",
    90,
    40,
    ["amelia"],
    15,
  ),
  service(
    "body-scrub",
    "spa",
    "Body Scrub",
    "تقشير الجسم",
    "A luminous exfoliating ritual with silk-soft finishing.",
    "طقس تقشير مضيء بلمسة حريرية ناعمة.",
    45,
    35,
    ["amelia"],
  ),
  service(
    "facial-treatment",
    "spa",
    "Facial Treatment",
    "علاج الوجه",
    "A tailored facial ritual for clarity and glow.",
    "طقس وجه مخصص للنضارة والإشراق.",
    60,
    30,
    ["amelia"],
    15,
  ),
  service(
    "full-beauty-day",
    "packages",
    "Full Beauty Day",
    "يوم جمال كامل",
    "A composed journey across nails, spa and private water ritual.",
    "رحلة متكاملة بين الأظافر والسبا وطقس الماء الخاص.",
    240,
    120,
    ["amelia", "layla"],
    30,
  ),
  service(
    "bridal-spa",
    "packages",
    "Bridal Spa Package",
    "باقة سبا العروس",
    "A calm, luminous preparation ritual for your day.",
    "طقس هادئ ومضيء للاستعداد ليومك.",
    180,
    100,
    ["amelia"],
    30,
  ),
];

const initialState: SalonState = { categories, specialists, services, appointments: [] };
const storageKey = "elan-salon-demo-v1";
const changeEvent = "elan-salon-data-change";
let state = initialState;
let hydrated = false;
const isBrowser = () => typeof window !== "undefined";

function migrate<T extends { id: string }>(stored: unknown, seed: T[]) {
  if (!Array.isArray(stored)) return seed;
  return seed.map((base) => {
    const previous = stored.find(
      (item): item is Record<string, unknown> =>
        Boolean(item) && typeof item === "object" && (item as { id?: string }).id === base.id,
    );
    if (!previous) return base;
    const legacy = previous as Record<string, unknown>;
    return {
      ...base,
      ...legacy,
      nameEn:
        typeof legacy.nameEn === "string"
          ? legacy.nameEn
          : typeof legacy.name === "string"
            ? legacy.name
            : (base as unknown as Bilingual).nameEn,
      descriptionEn:
        typeof legacy.descriptionEn === "string"
          ? legacy.descriptionEn
          : typeof legacy.description === "string"
            ? legacy.description
            : (base as Record<string, unknown>).descriptionEn,
    } as T;
  });
}
function hydrate() {
  if (!isBrowser() || hydrated) return;
  hydrated = true;
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<SalonState>;
      state = {
        categories: migrate(parsed.categories, categories),
        specialists: migrate(parsed.specialists, specialists),
        services: migrate(parsed.services, services),
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
  return snapshot().services.find((item) => item.id === serviceId);
}
export function getSpecialistsForService(serviceId?: string) {
  const item = getService(serviceId);
  return item
    ? snapshot().specialists.filter((specialist) => item.specialistIds.includes(specialist.id))
    : [];
}
export function upsertService(item: Service) {
  const current = snapshot().services;
  const index = current.findIndex((entry) => entry.id === item.id);
  const next = [...current];
  if (index === -1) next.push(item);
  else next[index] = item;
  update({ services: next });
}
export function archiveService(serviceId: string) {
  const item = getService(serviceId);
  if (item) upsertService({ ...item, enabled: false });
}
export function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  update({
    appointments: snapshot().appointments.map((item) =>
      item.id === id ? { ...item, status } : item,
    ),
  });
}
export function getJordanToday() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Amman",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const pick = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${pick("year")}-${pick("month")}-${pick("day")}`;
}
export function getAvailableSlots(date: string, serviceId?: string, specialistId?: string | "any") {
  const item = getService(serviceId);
  if (!item || !date) return [];
  const candidates = specialistId && specialistId !== "any" ? [specialistId] : item.specialistIds;
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
            overlaps(
              start,
              item.duration + item.buffer,
              appointment.startTime,
              appointment.durationMinutes,
            ),
        ),
    ),
  );
}
function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}
function fromMinutes(minutes: number) {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
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
  const item = getService(draft.serviceId);
  if (!item || !item.enabled)
    return { ok: false as const, error: "That service is no longer available." };
  const candidates = draft.specialistId === "any" ? item.specialistIds : [draft.specialistId];
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
            item.duration + item.buffer,
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
    endTime: fromMinutes(toMinutes(draft.startTime) + item.duration),
    durationMinutes: item.duration,
    totalPrice: item.price,
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
