import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  Download,
  ImagePlus,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  createAppointment,
  getAvailableSlots,
  getSpecialistsForService,
  type Appointment,
  type BookingDraft,
  useSalonData,
} from "@/lib/salon-data";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book — ÉLAN Nail & Spa" },
      {
        name: "description",
        content: "Reserve an ÉLAN ritual with live demo availability and specialist selection.",
      },
      { property: "og:title", content: "Book — ÉLAN Nail & Spa" },
      { property: "og:description", content: "Reserve your ÉLAN experience." },
    ],
  }),
  component: BookPage,
});

const steps = ["Category", "Service", "Specialist", "Time", "Details", "Review"];

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", { weekday: "short", month: "long", day: "numeric" }).format(
    new Date(`${date}T12:00:00`),
  );
}

function BookPage() {
  const { categories, services, specialists } = useSalonData();
  const [step, setStep] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [specialistId, setSpecialistId] = useState<string | "any">("any");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [contactMethod, setContactMethod] = useState<"whatsapp" | "phone" | "email">("whatsapp");
  const [confirmed, setConfirmed] = useState(false);
  const [inspirationImageUrl, setInspirationImageUrl] = useState<string>();
  const [inspirationLabel, setInspirationLabel] = useState<string>();
  const [booking, setBooking] = useState<Appointment>();
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedService = params.get("service");
    const requestedLook = params.get("look");
    const service = services.find((item) => item.id === requestedService && item.enabled);
    if (service) {
      setCategoryId(service.categoryId);
      setServiceId(service.id);
      setStep(1);
    }
    if (requestedLook)
      setInspirationLabel(
        `${requestedLook[0].toUpperCase()}${requestedLook.slice(1)} editorial nail look`,
      );
  }, [services]);

  const selectedService = services.find((service) => service.id === serviceId);
  const selectedCategory = categories.find((category) => category.id === categoryId);
  const eligibleSpecialists = useMemo(() => getSpecialistsForService(serviceId), [serviceId]);
  const selectedSpecialist = specialists.find((specialist) => specialist.id === specialistId);
  const slots = useMemo(
    () => getAvailableSlots(date, serviceId, specialistId),
    [date, serviceId, specialistId],
  );
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (time && !slots.includes(time)) setTime("");
  }, [slots, time]);

  const selectCategory = (nextCategory: string) => {
    setCategoryId(nextCategory);
    setServiceId("");
    setSpecialistId("any");
    setTime("");
    setStep(1);
  };

  const selectService = (nextService: string) => {
    setServiceId(nextService);
    setSpecialistId("any");
    setTime("");
    setStep(2);
  };

  const uploadInspiration = (file?: File) => {
    if (!file) return;
    setInspirationLabel(file.name);
    const reader = new FileReader();
    reader.onload = () =>
      setInspirationImageUrl(typeof reader.result === "string" ? reader.result : undefined);
    reader.readAsDataURL(file);
  };

  const canContinue = [
    Boolean(categoryId),
    Boolean(serviceId),
    Boolean(specialistId),
    Boolean(date && time),
    Boolean(name.trim() && phone.trim() && confirmed),
    true,
  ][step];

  const next = () => {
    if (!canContinue) return;
    setError("");
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const confirmBooking = () => {
    if (!selectedService || !date || !time || !name.trim() || !phone.trim()) return;
    const draft: BookingDraft = {
      customerName: name.trim(),
      customerPhone: phone.trim(),
      customerEmail: email.trim() || undefined,
      serviceId: selectedService.id,
      specialistId,
      appointmentDate: date,
      startTime: time,
      durationMinutes: selectedService.duration,
      totalPrice: selectedService.price,
      notes: notes.trim() || undefined,
      inspirationImageUrl,
      inspirationLabel,
      preferredContactMethod: contactMethod,
    };
    const result = createAppointment(draft);
    if (!result.ok) {
      setError(result.error);
      setStep(3);
      return;
    }
    setBooking(result.appointment);
  };

  if (booking)
    return (
      <BookingSuccess
        booking={booking}
        service={selectedService?.name ?? "ÉLAN ritual"}
        specialist={
          specialists.find((item) => item.id === booking.specialistId)?.name ??
          "Any available specialist"
        }
      />
    );

  return (
    <div className="booking-page min-h-screen bg-ivory pt-28 pb-24 text-espresso md:pt-36">
      <div className="booking-orbit booking-orbit--one" />
      <div className="booking-orbit booking-orbit--two" />
      <div className="relative mx-auto grid max-w-[1340px] gap-10 px-6 md:px-10 lg:grid-cols-[0.82fr_1.18fr]">
        <aside className="booking-intro lg:sticky lg:top-32 lg:h-fit">
          <Link to="/" className="booking-back">
            <ChevronLeft size={15} /> Back to the house
          </Link>
          <span className="eyebrow mt-12 block">Private reservation</span>
          <h1>
            Book your <em>ÉLAN</em> moment.
          </h1>
          <p>Choose a ritual, your preferred artist and a time that belongs only to you.</p>
          <div className="booking-support">
            <Phone size={17} />
            <span>
              Need a hand? <a href="tel:+97140000000">+971 4 000 0000</a>
            </span>
          </div>
          <p className="booking-demo-note">
            Live local demo · availability and appointments persist in this browser.
          </p>
        </aside>

        <main className="booking-panel">
          <ol className="booking-steps" aria-label="Booking progress">
            {steps.map((label, index) => (
              <li
                key={label}
                className={index === step ? "is-current" : index < step ? "is-complete" : ""}
              >
                <span>
                  {index < step ? <Check size={12} /> : String(index + 1).padStart(2, "0")}
                </span>
                <small>{label}</small>
              </li>
            ))}
          </ol>

          <div className="booking-stage">
            {step === 0 && (
              <section>
                <StepHeading
                  number="01"
                  title="What would you like to explore?"
                  copy="Begin with a broad ritual. The details can come later."
                />
                <div className="booking-category-grid">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => selectCategory(category.id)}
                      className="booking-category-card"
                    >
                      <Sparkles size={17} />
                      <span>{category.shortName}</span>
                      <small>{category.description}</small>
                      <i>→</i>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {step === 1 && (
              <section>
                <StepHeading
                  number="02"
                  title={
                    selectedCategory
                      ? `Choose your ${selectedCategory.shortName.toLowerCase()} ritual.`
                      : "Choose a service."
                  }
                  copy="Every service includes a dedicated moment of consultation."
                />
                <div className="booking-service-list">
                  {services
                    .filter((service) => service.categoryId === categoryId && service.enabled)
                    .map((service) => (
                      <button
                        key={service.id}
                        onClick={() => selectService(service.id)}
                        className="booking-service-choice"
                      >
                        <span>
                          <b>{service.name}</b>
                          <small>{service.description}</small>
                        </span>
                        <span>
                          <small>{service.duration} min</small>
                          <b>AED {service.price}</b>
                        </span>
                        <ChevronRight size={17} />
                      </button>
                    ))}
                </div>
              </section>
            )}

            {step === 2 && selectedService && (
              <section>
                <StepHeading
                  number="03"
                  title="Who would you like to see?"
                  copy="Choose a specialist or let us find the best available match."
                />
                <div className="booking-specialist-grid">
                  <button
                    onClick={() => {
                      setSpecialistId("any");
                      setStep(3);
                    }}
                    className={`booking-specialist ${specialistId === "any" ? "is-selected" : ""}`}
                  >
                    <span className="booking-avatar booking-avatar--any">✦</span>
                    <span>
                      <b>Any available</b>
                      <small>We’ll reserve the earliest suitable artist.</small>
                    </span>
                  </button>
                  {eligibleSpecialists.map((specialist) => (
                    <button
                      key={specialist.id}
                      onClick={() => {
                        setSpecialistId(specialist.id);
                        setStep(3);
                      }}
                      className={`booking-specialist ${specialistId === specialist.id ? "is-selected" : ""}`}
                    >
                      <span className="booking-avatar">{specialist.initials}</span>
                      <span>
                        <b>{specialist.name}</b>
                        <small>{specialist.role}</small>
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {step === 3 && selectedService && (
              <section>
                <StepHeading
                  number="04"
                  title="Find your unhurried time."
                  copy={`${selectedService.duration} minutes reserved for ${selectedService.name}.`}
                />
                <label className="booking-field">
                  <span>Preferred date</span>
                  <input
                    type="date"
                    min={today}
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                  />
                </label>
                {date && (
                  <div className="booking-times">
                    <p>
                      {formatDate(date)}{" "}
                      <span>
                        {specialistId === "any"
                          ? "· earliest artist"
                          : `· ${selectedSpecialist?.name}`}
                      </span>
                    </p>
                    <div>
                      {slots.length ? (
                        slots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setTime(slot)}
                            className={time === slot ? "is-selected" : ""}
                          >
                            {slot}
                          </button>
                        ))
                      ) : (
                        <span className="booking-no-slots">
                          No times remain on this date. Please choose another day.
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </section>
            )}

            {step === 4 && (
              <section>
                <StepHeading
                  number="05"
                  title="A few details for your reservation."
                  copy="We only use these details to coordinate your visit."
                />
                <div className="booking-fields-grid">
                  <label className="booking-field">
                    <span>Full name *</span>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      autoComplete="name"
                      placeholder="Your name"
                    />
                  </label>
                  <label className="booking-field">
                    <span>Phone number *</span>
                    <input
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      autoComplete="tel"
                      placeholder="+971 …"
                    />
                  </label>
                  <label className="booking-field">
                    <span>
                      Email <small>optional</small>
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoComplete="email"
                      placeholder="you@email.com"
                    />
                  </label>
                  <label className="booking-field">
                    <span>Preferred contact</span>
                    <select
                      value={contactMethod}
                      onChange={(event) =>
                        setContactMethod(event.target.value as typeof contactMethod)
                      }
                    >
                      <option value="whatsapp">WhatsApp</option>
                      <option value="phone">Phone</option>
                      <option value="email">Email</option>
                    </select>
                  </label>
                </div>
                <label className="booking-field mt-5">
                  <span>
                    Notes <small>optional</small>
                  </span>
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Anything your specialist should know?"
                    rows={3}
                  />
                </label>
                <label className="booking-upload">
                  <ImagePlus size={18} />
                  <span>
                    <b>{inspirationLabel ?? "Add an inspiration image"}</b>
                    <small>Optional · JPG or PNG</small>
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(event) => uploadInspiration(event.target.files?.[0])}
                  />
                </label>
                <label className="booking-confirm">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(event) => setConfirmed(event.target.checked)}
                  />
                  <span>
                    I confirm the appointment details and agree to be contacted about this
                    reservation.
                  </span>
                </label>
              </section>
            )}

            {step === 5 && selectedService && (
              <section>
                <StepHeading
                  number="06"
                  title="Your reservation, at a glance."
                  copy="Please take a moment to review before we hold your time."
                />
                <div className="booking-review">
                  <ReviewItem
                    label="Ritual"
                    value={selectedService.name}
                    detail={`${selectedService.duration} min · AED ${selectedService.price}`}
                  />
                  <ReviewItem
                    label="Specialist"
                    value={selectedSpecialist?.name ?? "Any available specialist"}
                    detail={
                      selectedSpecialist?.role ??
                      "We’ll match you with the earliest suitable artist."
                    }
                  />
                  <ReviewItem
                    label="When"
                    value={date ? `${formatDate(date)} · ${time}` : "Not selected"}
                    detail="The salon will confirm your arrival details."
                  />
                  <ReviewItem
                    label="Guest"
                    value={name}
                    detail={`${phone}${email ? ` · ${email}` : ""}`}
                  />
                  {inspirationLabel && (
                    <ReviewItem
                      label="Inspiration"
                      value={inspirationLabel}
                      detail="Shared with your specialist."
                    />
                  )}
                </div>
                {error && (
                  <p className="booking-error" role="alert">
                    {error}
                  </p>
                )}
              </section>
            )}
          </div>

          <div className="booking-actions">
            <button
              onClick={() => setStep((current) => Math.max(0, current - 1))}
              disabled={step === 0}
              className="booking-previous"
            >
              <ChevronLeft size={17} /> Back
            </button>
            {step < 5 ? (
              <button onClick={next} disabled={!canContinue} className="booking-next">
                Continue <ChevronRight size={17} />
              </button>
            ) : (
              <button onClick={confirmBooking} className="booking-next">
                Confirm reservation <Check size={17} />
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function StepHeading({ number, title, copy }: { number: string; title: string; copy: string }) {
  return (
    <header className="booking-heading">
      <span>{number}</span>
      <h2>{title}</h2>
      <p>{copy}</p>
    </header>
  );
}

function ReviewItem({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div>
      <span>{label}</span>
      <p>{value}</p>
      <small>{detail}</small>
    </div>
  );
}

function BookingSuccess({
  booking,
  service,
  specialist,
}: {
  booking: Appointment;
  service: string;
  specialist: string;
}) {
  const [copied, setCopied] = useState(false);
  const addToCalendar = () => {
    const start = `${booking.appointmentDate.replaceAll("-", "")}T${booking.startTime.replace(":", "")}00`;
    const end = `${booking.appointmentDate.replaceAll("-", "")}T${booking.endTime.replace(":", "")}00`;
    const content = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `UID:${booking.id}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:ÉLAN — ${service}`,
      "LOCATION:ÉLAN Nail & Spa, The Avenue",
      `DESCRIPTION:Booking reference ${booking.bookingReference}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([content], { type: "text/calendar" }));
    link.download = `elan-${booking.bookingReference}.ics`;
    link.click();
    URL.revokeObjectURL(link.href);
  };
  const copyReference = async () => {
    await navigator.clipboard.writeText(booking.bookingReference);
    setCopied(true);
  };
  const whatsapp = `https://wa.me/97140000000?text=${encodeURIComponent(`Hello ÉLAN, I’m confirming my reservation ${booking.bookingReference}.`)}`;
  return (
    <div className="booking-success min-h-screen bg-espresso px-6 pt-32 pb-20 text-ivory md:pt-40">
      <div className="booking-success-glow" />
      <main className="relative mx-auto max-w-3xl text-center">
        <span className="booking-success-mark">
          <Check size={24} />
        </span>
        <span className="eyebrow text-champagne">Reservation held</span>
        <h1>
          Your ÉLAN moment is <em>waiting.</em>
        </h1>
        <p>
          We’ve held your private appointment. A concierge will confirm the final details via your
          preferred contact method.
        </p>
        <div className="booking-success-card">
          <span>Booking reference</span>
          <b>{booking.bookingReference}</b>
          <button onClick={copyReference}>
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}
          </button>
          <hr />
          <p>
            {service} with {specialist}
          </p>
          <p>
            {formatDate(booking.appointmentDate)} · {booking.startTime}–{booking.endTime}
          </p>
        </div>
        <div className="booking-success-actions">
          <button onClick={addToCalendar}>
            <Download size={16} /> Add to calendar
          </button>
          <a href={whatsapp} target="_blank" rel="noreferrer">
            <MessageCircle size={16} /> WhatsApp us
          </a>
        </div>
        <p className="booking-cancel-note">
          Need to reschedule? Please contact us at least 12 hours before your appointment with your
          reference number.
        </p>
        <Link to="/" className="booking-home-link">
          Return to the house
        </Link>
      </main>
    </div>
  );
}
