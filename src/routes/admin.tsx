import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  LayoutDashboard,
  Plus,
  Search,
  Settings2,
  UsersRound,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { useI18n } from "@/i18n/salon-i18n";
import {
  type AppointmentStatus,
  type Service,
  archiveService,
  getJordanToday,
  updateAppointmentStatus,
  upsertService,
  useSalonData,
} from "@/lib/salon-data";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Studio Console — ELAN" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminPage,
});
const statuses: AppointmentStatus[] = [
  "pending",
  "confirmed",
  "waiting",
  "checked_in",
  "in_progress",
  "completed",
  "cancelled",
  "no_show",
];
function AdminPage() {
  const { appointments, categories, services, specialists } = useSalonData();
  const { t, text, formatCurrency } = useI18n();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<AppointmentStatus | "all">("all");
  const today = getJordanToday();
  const activeToday = appointments.filter(
    (item) => item.appointmentDate === today && !["cancelled", "no_show"].includes(item.status),
  );
  const revenue = activeToday.reduce((total, item) => total + item.totalPrice, 0);
  const filtered = appointments
    .filter((item) => {
      const service = services.find((entry) => entry.id === item.serviceId);
      const haystack =
        `${item.customerName} ${item.customerPhone} ${service ? `${service.nameEn} ${service.nameAr}` : ""}`.toLowerCase();
      return haystack.includes(query.toLowerCase()) && (status === "all" || item.status === status);
    })
    .sort((a, b) =>
      `${a.appointmentDate}${a.startTime}`.localeCompare(`${b.appointmentDate}${b.startTime}`),
    );
  return (
    <div className="admin-page min-h-screen bg-[#f7f1ea] text-espresso">
      <header className="admin-header">
        <Link to="/" className="font-serif text-2xl tracking-[0.22em]">
          ELAN
        </Link>
        <div>
          <span>{t("admin.console")}</span>
          <span className="admin-demo-pill">{t("admin.demo")}</span>
        </div>
      </header>
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <a href="#overview">
            <LayoutDashboard size={16} /> {t("admin.overview")}
          </a>
          <a href="#appointments">
            <CalendarDays size={16} /> {t("admin.appointments")} <span>{appointments.length}</span>
          </a>
          <a href="#services">
            <Settings2 size={16} /> {t("admin.services")}
          </a>
          <a href="#specialists">
            <UsersRound size={16} /> {t("admin.specialists")}
          </a>
          <Link to="/book" className="admin-book-link">
            {t("admin.openBooking")} <ChevronRight size={15} />
          </Link>
        </aside>
        <main className="admin-main">
          <section id="overview">
            <span className="eyebrow">{t("admin.today")}</span>
            <h1>{t("admin.title")}</h1>
            <p className="admin-subtitle">{t("admin.copy")}</p>
            <div className="admin-metrics">
              <Metric
                label={t("admin.todayAppointments")}
                value={activeToday.length}
                icon={<CalendarDays size={18} />}
              />
              <Metric
                label={t("admin.pending")}
                value={appointments.filter((item) => item.status === "pending").length}
                icon={<Clock3 size={18} />}
              />
              <Metric
                label={t("admin.inProgress")}
                value={appointments.filter((item) => item.status === "in_progress").length}
                icon={<UsersRound size={18} />}
              />
              <Metric
                label={t("admin.revenue")}
                value={formatCurrency(revenue)}
                icon={<CircleDollarSign size={18} />}
              />
            </div>
          </section>
          <section id="appointments" className="admin-section">
            <SectionTitle
              eyebrow={t("admin.queue")}
              title={t("admin.appointments")}
              side={`${filtered.length} ${t("admin.shown")}`}
            />
            <div className="admin-filters">
              <label>
                <Search size={16} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t("admin.search")}
                />
              </label>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as typeof status)}
              >
                <option value="all">{t("admin.allStatuses")}</option>
                {statuses.map((item) => (
                  <option value={item} key={item}>
                    {t(`admin.status.${item}`)}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-appointments">
              {filtered.length ? (
                filtered.map((item) => (
                  <AppointmentRow
                    key={item.id}
                    appointment={item}
                    services={services}
                    specialists={specialists}
                  />
                ))
              ) : (
                <div className="admin-empty">{t("admin.empty")}</div>
              )}
            </div>
          </section>
          <section id="services" className="admin-section">
            <SectionTitle
              eyebrow={t("admin.menu")}
              title={t("admin.manage")}
              side={`${services.filter((item) => item.enabled).length} ${t("admin.active")}`}
            />
            <ServiceCreator categories={categories} specialists={specialists} />
            <div className="admin-service-grid">
              {categories.map((category) => (
                <div className="admin-service-group" key={category.id}>
                  <h3>{text(category, "name")}</h3>
                  {services
                    .filter((item) => item.categoryId === category.id)
                    .map((item) => (
                      <ServiceEditor
                        service={item}
                        key={item.id}
                        categoryId={category.id}
                        specialistIds={specialists
                          .filter((specialist) =>
                            specialist.serviceCategories.includes(category.id),
                          )
                          .map((specialist) => specialist.id)}
                      />
                    ))}
                </div>
              ))}
            </div>
          </section>
          <section id="specialists" className="admin-section">
            <SectionTitle eyebrow={t("admin.team")} title={t("admin.specialists")} />
            <div className="admin-specialists">
              {specialists.map((item) => (
                <article key={item.id}>
                  <span>{item.initials}</span>
                  <div>
                    <h3>{text(item, "name")}</h3>
                    <p>{text(item, "role")}</p>
                    <small>
                      {item.serviceCategories
                        .map((id) => {
                          const category = categories.find((entry) => entry.id === id);
                          return category ? text(category, "shortName") : "";
                        })
                        .join(" · ")}
                    </small>
                  </div>
                  <b>10:00–20:00</b>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
function SectionTitle({ eyebrow, title, side }: { eyebrow: string; title: string; side?: string }) {
  return (
    <div className="admin-section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {side && <span>{side}</span>}
    </div>
  );
}
function Metric({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | string;
  icon: ReactNode;
}) {
  return (
    <article>
      <span>{icon}</span>
      <small>{label}</small>
      <b>{value}</b>
    </article>
  );
}
function AppointmentRow({
  appointment,
  services,
  specialists,
}: {
  appointment: ReturnType<typeof useSalonData>["appointments"][number];
  services: Service[];
  specialists: ReturnType<typeof useSalonData>["specialists"];
}) {
  const { t, text } = useI18n();
  const service = services.find((item) => item.id === appointment.serviceId);
  const specialist = specialists.find((item) => item.id === appointment.specialistId);
  return (
    <article className="admin-appointment">
      <div className="admin-time">
        <b>{appointment.startTime}</b>
        <span>{appointment.appointmentDate}</span>
      </div>
      <div>
        <b>{appointment.customerName}</b>
        <span>{appointment.customerPhone}</span>
      </div>
      <div>
        <b>{service ? text(service, "name") : t("common.archived")}</b>
        <span>{specialist ? text(specialist, "name") : t("common.anyAvailable")}</span>
      </div>
      <div>
        <span className={`admin-status admin-status--${appointment.status}`}>
          {t(`admin.status.${appointment.status}`)}
        </span>
        <select
          aria-label={`Update ${appointment.customerName} status`}
          value={appointment.status}
          onChange={(event) =>
            updateAppointmentStatus(appointment.id, event.target.value as AppointmentStatus)
          }
        >
          {statuses.map((item) => (
            <option value={item} key={item}>
              {t(`admin.status.${item}`)}
            </option>
          ))}
        </select>
      </div>
    </article>
  );
}
function ServiceCreator({
  categories,
  specialists,
}: Pick<ReturnType<typeof useSalonData>, "categories" | "specialists">) {
  const { t, text } = useI18n();
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "nails");
  const [price, setPrice] = useState("20");
  const [duration, setDuration] = useState("60");
  const add = () => {
    if (!nameEn.trim() || !nameAr.trim()) return;
    upsertService({
      id: `custom-${crypto.randomUUID()}`,
      categoryId,
      nameEn: nameEn.trim(),
      nameAr: nameAr.trim(),
      descriptionEn: "A new tailored ELAN ritual.",
      descriptionAr: "طقس إيلان جديد ومصمم لك.",
      price: Number(price) || 0,
      duration: Number(duration) || 30,
      buffer: 10,
      enabled: true,
      specialistIds: specialists
        .filter((item) => item.serviceCategories.includes(categoryId))
        .map((item) => item.id),
    });
    setNameEn("");
    setNameAr("");
  };
  return (
    <div className="admin-service-create">
      <b>
        <Plus size={16} /> {t("admin.addService")}
      </b>
      <input
        value={nameEn}
        onChange={(event) => setNameEn(event.target.value)}
        placeholder={t("admin.nameEn")}
      />
      <input
        value={nameAr}
        onChange={(event) => setNameAr(event.target.value)}
        placeholder={t("admin.nameAr")}
      />
      <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
        {categories.map((item) => (
          <option key={item.id} value={item.id}>
            {text(item, "name")}
          </option>
        ))}
      </select>
      <input
        value={duration}
        onChange={(event) => setDuration(event.target.value)}
        inputMode="numeric"
        aria-label={t("admin.duration")}
      />
      <input
        value={price}
        onChange={(event) => setPrice(event.target.value)}
        inputMode="decimal"
        aria-label={t("admin.price")}
      />
      <button onClick={add}>{t("common.add")}</button>
    </div>
  );
}
function ServiceEditor({
  service,
  categoryId,
  specialistIds,
}: {
  service: Service;
  categoryId: string;
  specialistIds: string[];
}) {
  const { t } = useI18n();
  const [draft, setDraft] = useState(service);
  const changed = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(service),
    [draft, service],
  );
  return (
    <article
      className={`admin-service-row admin-service-row--bilingual ${service.enabled ? "" : "is-archived"}`}
    >
      <label>
        <span>{t("admin.nameEn")}</span>
        <input
          value={draft.nameEn}
          onChange={(event) => setDraft({ ...draft, nameEn: event.target.value })}
        />
      </label>
      <label>
        <span>{t("admin.nameAr")}</span>
        <input
          value={draft.nameAr}
          onChange={(event) => setDraft({ ...draft, nameAr: event.target.value })}
        />
      </label>
      <label>
        <span>{t("admin.descriptionEn")}</span>
        <input
          value={draft.descriptionEn}
          onChange={(event) => setDraft({ ...draft, descriptionEn: event.target.value })}
        />
      </label>
      <label>
        <span>{t("admin.descriptionAr")}</span>
        <input
          value={draft.descriptionAr}
          onChange={(event) => setDraft({ ...draft, descriptionAr: event.target.value })}
        />
      </label>
      <label>
        <span>{t("admin.duration")}</span>
        <input
          value={draft.duration}
          inputMode="numeric"
          onChange={(event) => setDraft({ ...draft, duration: Number(event.target.value) || 0 })}
        />
      </label>
      <label>
        <span>{t("admin.price")}</span>
        <input
          value={draft.price}
          inputMode="decimal"
          onChange={(event) => setDraft({ ...draft, price: Number(event.target.value) || 0 })}
        />
      </label>
      <div>
        <button
          onClick={() => upsertService({ ...draft, categoryId, specialistIds })}
          disabled={!changed}
        >
          {t("common.save")}
        </button>
        <button onClick={() => archiveService(service.id)} className="admin-archive">
          {service.enabled ? t("common.archive") : t("common.archived")}
        </button>
      </div>
    </article>
  );
}
