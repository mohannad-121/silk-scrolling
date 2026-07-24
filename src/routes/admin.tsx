import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarDays,
  Check,
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

import {
  type AppointmentStatus,
  type Service,
  archiveService,
  updateAppointmentStatus,
  upsertService,
  useSalonData,
} from "@/lib/salon-data";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Studio Console — ÉLAN" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminPage,
});

const statusLabels: Record<AppointmentStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  waiting: "Waiting",
  checked_in: "Checked in",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No-show",
};

function AdminPage() {
  const { appointments, categories, services, specialists } = useSalonData();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<AppointmentStatus | "all">("all");
  const today = new Date().toISOString().slice(0, 10);
  const activeToday = appointments.filter(
    (appointment) =>
      appointment.appointmentDate === today &&
      !["cancelled", "no_show"].includes(appointment.status),
  );
  const revenue = activeToday.reduce((total, appointment) => total + appointment.totalPrice, 0);
  const filtered = appointments
    .filter((appointment) => {
      const service = services.find((item) => item.id === appointment.serviceId);
      const haystack =
        `${appointment.customerName} ${appointment.customerPhone} ${service?.name ?? ""}`.toLowerCase();
      return (
        haystack.includes(query.toLowerCase()) &&
        (status === "all" || appointment.status === status)
      );
    })
    .sort((a, b) =>
      `${a.appointmentDate}${a.startTime}`.localeCompare(`${b.appointmentDate}${b.startTime}`),
    );

  return (
    <div className="admin-page min-h-screen bg-[#f7f1ea] text-espresso">
      <header className="admin-header">
        <Link to="/" className="font-serif text-2xl tracking-[0.22em]">
          ÉLAN
        </Link>
        <div>
          <span>Studio console</span>
          <span className="admin-demo-pill">Local demo mode</span>
        </div>
      </header>
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <a href="#overview">
            <LayoutDashboard size={16} /> Overview
          </a>
          <a href="#appointments">
            <CalendarDays size={16} /> Appointments <span>{appointments.length}</span>
          </a>
          <a href="#services">
            <Settings2 size={16} /> Services
          </a>
          <a href="#specialists">
            <UsersRound size={16} /> Specialists
          </a>
          <Link to="/book" className="admin-book-link">
            Open booking flow <ChevronRight size={15} />
          </Link>
        </aside>
        <main className="admin-main">
          <section id="overview">
            <span className="eyebrow">Today · live</span>
            <h1>The house at a glance.</h1>
            <p className="admin-subtitle">
              All changes update the booking flow and concierge instantly in this browser.
            </p>
            <div className="admin-metrics">
              <Metric
                label="Today’s appointments"
                value={activeToday.length}
                icon={<CalendarDays size={18} />}
              />
              <Metric
                label="Pending confirmation"
                value={
                  appointments.filter((appointment) => appointment.status === "pending").length
                }
                icon={<Clock3 size={18} />}
              />
              <Metric
                label="Guests in progress"
                value={
                  appointments.filter((appointment) => appointment.status === "in_progress").length
                }
                icon={<UsersRound size={18} />}
              />
              <Metric
                label="Today’s revenue"
                value={`AED ${revenue.toLocaleString()}`}
                icon={<CircleDollarSign size={18} />}
              />
            </div>
          </section>

          <section id="appointments" className="admin-section">
            <div className="admin-section-heading">
              <div>
                <span className="eyebrow">Live queue</span>
                <h2>Appointments</h2>
              </div>
              <span>{filtered.length} shown</span>
            </div>
            <div className="admin-filters">
              <label>
                <Search size={16} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search guest or phone"
                />
              </label>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as typeof status)}
              >
                <option value="all">All statuses</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option value={value} key={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-appointments">
              {filtered.length ? (
                filtered.map((appointment) => (
                  <AppointmentRow
                    key={appointment.id}
                    appointment={appointment}
                    services={services}
                    specialists={specialists}
                  />
                ))
              ) : (
                <div className="admin-empty">
                  No appointments match this view. New online bookings appear here immediately.
                </div>
              )}
            </div>
          </section>

          <section id="services" className="admin-section">
            <div className="admin-section-heading">
              <div>
                <span className="eyebrow">Public menu</span>
                <h2>Service management</h2>
              </div>
              <span>{services.filter((service) => service.enabled).length} active</span>
            </div>
            <ServiceCreator categories={categories} specialists={specialists} />
            <div className="admin-service-grid">
              {categories.map((category) => (
                <div className="admin-service-group" key={category.id}>
                  <h3>{category.name}</h3>
                  {services
                    .filter((service) => service.categoryId === category.id)
                    .map((service) => (
                      <ServiceEditor
                        service={service}
                        key={service.id}
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
            <div className="admin-section-heading">
              <div>
                <span className="eyebrow">Team & schedule</span>
                <h2>Specialists</h2>
              </div>
            </div>
            <div className="admin-specialists">
              {specialists.map((specialist) => (
                <article key={specialist.id}>
                  <span>{specialist.initials}</span>
                  <div>
                    <h3>{specialist.name}</h3>
                    <p>{specialist.role}</p>
                    <small>
                      {specialist.serviceCategories
                        .map(
                          (categoryId) =>
                            categories.find((category) => category.id === categoryId)?.shortName,
                        )
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
        <b>{service?.name ?? "Archived service"}</b>
        <span>{specialist?.name ?? "Any available"}</span>
      </div>
      <div>
        <span className={`admin-status admin-status--${appointment.status}`}>
          {statusLabels[appointment.status]}
        </span>
        <select
          aria-label={`Update ${appointment.customerName} status`}
          value={appointment.status}
          onChange={(event) =>
            updateAppointmentStatus(appointment.id, event.target.value as AppointmentStatus)
          }
        >
          {Object.entries(statusLabels).map(([value, label]) => (
            <option value={value} key={value}>
              {label}
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
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "nails");
  const [price, setPrice] = useState("200");
  const [duration, setDuration] = useState("60");
  const addService = () => {
    if (!name.trim()) return;
    upsertService({
      id: `custom-${crypto.randomUUID()}`,
      categoryId,
      name: name.trim(),
      description: "A new tailored ÉLAN ritual.",
      price: Number(price) || 0,
      duration: Number(duration) || 30,
      buffer: 10,
      enabled: true,
      specialistIds: specialists
        .filter((specialist) => specialist.serviceCategories.includes(categoryId))
        .map((specialist) => specialist.id),
    });
    setName("");
  };
  return (
    <div className="admin-service-create">
      <b>
        <Plus size={16} /> Add a service
      </b>
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Service name"
      />
      <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <input
        value={duration}
        onChange={(event) => setDuration(event.target.value)}
        inputMode="numeric"
        aria-label="Duration in minutes"
      />
      <input
        value={price}
        onChange={(event) => setPrice(event.target.value)}
        inputMode="decimal"
        aria-label="Price in AED"
      />
      <button onClick={addService}>Add</button>
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
  const [draft, setDraft] = useState(service);
  const changed = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(service),
    [draft, service],
  );
  return (
    <article className={`admin-service-row ${service.enabled ? "" : "is-archived"}`}>
      <label>
        <span>Name</span>
        <input
          value={draft.name}
          onChange={(event) => setDraft({ ...draft, name: event.target.value })}
        />
      </label>
      <label>
        <span>Minutes</span>
        <input
          value={draft.duration}
          inputMode="numeric"
          onChange={(event) => setDraft({ ...draft, duration: Number(event.target.value) || 0 })}
        />
      </label>
      <label>
        <span>AED</span>
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
          Save
        </button>
        <button onClick={() => archiveService(service.id)} className="admin-archive">
          {service.enabled ? "Archive" : "Archived"}
        </button>
      </div>
    </article>
  );
}
