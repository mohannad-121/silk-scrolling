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
import { useI18n } from "@/i18n/salon-i18n";
import {
  createAppointment,
  getAvailableSlots,
  getJordanToday,
  getSpecialistsForService,
  type Appointment,
  type BookingDraft,
  useSalonData,
} from "@/lib/salon-data";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book — ELAN Nail & Spa" },
      { name: "description", content: "Reserve an ELAN ritual with live availability in Amman." },
    ],
  }),
  component: BookPage,
});

function BookPage() {
  const { categories, services, specialists } = useSalonData();
  const { t, text, formatCurrency, formatDate, language } = useI18n();
  const stepLabels = [
    t("booking.category"),
    t("booking.service"),
    t("booking.specialist"),
    t("booking.time"),
    t("booking.details"),
    t("booking.review"),
  ];
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
    const requested = params.get("service");
    const selected = services.find((item) => item.id === requested && item.enabled);
    if (selected) {
      setCategoryId(selected.categoryId);
      setServiceId(selected.id);
      setStep(1);
    }
    if (params.get("look"))
      setInspirationLabel(language === "ar" ? "إطلالة أظافر ملهمة" : "Editorial nail look");
  }, [services, language]);
  const selectedService = services.find((item) => item.id === serviceId);
  const selectedCategory = categories.find((item) => item.id === categoryId);
  const selectedSpecialist = specialists.find((item) => item.id === specialistId);
  const eligibleSpecialists = useMemo(() => getSpecialistsForService(serviceId), [serviceId]);
  const slots = useMemo(
    () => getAvailableSlots(date, serviceId, specialistId),
    [date, serviceId, specialistId],
  );
  useEffect(() => {
    if (time && !slots.includes(time)) setTime("");
  }, [slots, time]);
  const selectCategory = (next: string) => {
    setCategoryId(next);
    setServiceId("");
    setSpecialistId("any");
    setTime("");
    setStep(1);
  };
  const selectService = (next: string) => {
    setServiceId(next);
    setSpecialistId("any");
    setTime("");
    setStep(2);
  };
  const upload = (file?: File) => {
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
  const confirm = () => {
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
      setError(t("booking.taken"));
      setStep(3);
      return;
    }
    setBooking(result.appointment);
  };
  if (booking)
    return (
      <BookingSuccess
        booking={booking}
        service={selectedService ? text(selectedService, "name") : "ELAN"}
        specialist={
          specialists.find((item) => item.id === booking.specialistId)
            ? text(
                specialists.find((item) => item.id === booking.specialistId)!,
                "name",
              )
            : t("common.anyAvailable")
        }
      />
    );
  return (
    <div className="booking-page min-h-screen bg-ivory pb-24 pt-28 text-espresso md:pt-36">
      <div className="booking-orbit booking-orbit--one" />
      <div className="booking-orbit booking-orbit--two" />
      <div className="relative mx-auto grid max-w-[1340px] gap-10 px-6 md:px-10 lg:grid-cols-[0.82fr_1.18fr]">
        <aside className="booking-intro lg:sticky lg:top-32 lg:h-fit">
          <Link to="/" className="booking-back">
            <ChevronLeft size={15} /> {t("booking.back")}
          </Link>
          <span className="eyebrow mt-12 block">{t("booking.eyebrow")}</span>
          <h1>{t("booking.title")}</h1>
          <p>{t("booking.copy")}</p>
          <div className="booking-support">
            <Phone size={17} />
            <span>
              {t("booking.help")} <a href="tel:+962790000000">+962 7 9000 0000</a>
            </span>
          </div>
          <p className="booking-demo-note">{t("booking.demo")}</p>
        </aside>
        <main className="booking-panel">
          <ol className="booking-steps" aria-label="Booking progress">
            {stepLabels.map((label, index) => (
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
                <StepHeading number="01" title={t("booking.what")} copy={t("booking.whatCopy")} />
                <div className="booking-category-grid">
                  {categories.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => selectCategory(item.id)}
                      className="booking-category-card"
                    >
                      <Sparkles size={17} />
                      <span>{text(item, "shortName")}</span>
                      <small>{text(item, "description")}</small>
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
                      ? `${t("booking.chooseService")} — ${text(selectedCategory, "shortName")}`
                      : t("booking.chooseService")
                  }
                  copy={t("booking.chooseServiceCopy")}
                />
                <div className="booking-service-list">
                  {services
                    .filter((item) => item.categoryId === categoryId && item.enabled)
                    .map((item) => (
                      <button
                        key={item.id}
                        onClick={() => selectService(item.id)}
                        className="booking-service-choice"
                      >
                        <span>
                          <b>{text(item, "name")}</b>
                          <small>{text(item, "description")}</small>
                        </span>
                        <span>
                          <small>
                            {item.duration} {t("common.minutes")}
                          </small>
                          <b>{formatCurrency(item.price)}</b>
                        </span>
                        <ChevronRight size={17} />
                      </button>
                    ))}
                </div>
              </section>
            )}
            {step === 2 && selectedService && (
              <section>
                <StepHeading number="03" title={t("booking.who")} copy={t("booking.whoCopy")} />
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
                      <b>{t("common.anyAvailable")}</b>
                      <small>{t("booking.anyCopy")}</small>
                    </span>
                  </button>
                  {eligibleSpecialists.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSpecialistId(item.id);
                        setStep(3);
                      }}
                      className={`booking-specialist ${specialistId === item.id ? "is-selected" : ""}`}
                    >
                      <span className="booking-avatar">{item.initials}</span>
                      <span>
                        <b>{text(item, "name")}</b>
                        <small>{text(item, "role")}</small>
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
                  title={t("booking.when")}
                  copy={`${selectedService.duration} ${t("common.minutes")} · ${text(selectedService, "name")}`}
                />
                <label className="booking-field">
                  <span>{t("booking.date")}</span>
                  <input
                    type="date"
                    min={getJordanToday()}
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
                          ? `· ${t("common.anyAvailable")}`
                          : `· ${selectedSpecialist ? text(selectedSpecialist, "name") : ""}`}
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
                        <span className="booking-no-slots">{t("booking.noSlots")}</span>
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
                  title={t("booking.detailsTitle")}
                  copy={t("booking.detailsCopy")}
                />
                <div className="booking-fields-grid">
                  <Field
                    label={t("booking.name")}
                    value={name}
                    onChange={setName}
                    autoComplete="name"
                    placeholder={language === "ar" ? "اسمك" : "Your name"}
                  />
                  <Field
                    label={t("booking.phone")}
                    value={phone}
                    onChange={setPhone}
                    autoComplete="tel"
                    placeholder="+962 …"
                  />
                  <Field
                    label={`${t("booking.email")} (${t("common.optional")})`}
                    value={email}
                    onChange={setEmail}
                    autoComplete="email"
                    type="email"
                    placeholder="you@email.com"
                  />
                  <label className="booking-field">
                    <span>{t("booking.contact")}</span>
                    <select
                      value={contactMethod}
                      onChange={(event) =>
                        setContactMethod(event.target.value as typeof contactMethod)
                      }
                    >
                      <option value="whatsapp">WhatsApp</option>
                      <option value="phone">{language === "ar" ? "هاتف" : "Phone"}</option>
                      <option value="email">{language === "ar" ? "بريد إلكتروني" : "Email"}</option>
                    </select>
                  </label>
                </div>
                <label className="booking-field mt-5">
                  <span>
                    {t("booking.notes")} <small>{t("common.optional")}</small>
                  </span>
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder={t("booking.notesPlaceholder")}
                    rows={3}
                  />
                </label>
                <label className="booking-upload">
                  <ImagePlus size={18} />
                  <span>
                    <b>{inspirationLabel ?? t("booking.image")}</b>
                    <small>{t("booking.imageCopy")}</small>
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={(event) => upload(event.target.files?.[0])}
                  />
                </label>
                <label className="booking-confirm">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(event) => setConfirmed(event.target.checked)}
                  />
                  {t("booking.consent")}
                </label>
              </section>
            )}
            {step === 5 && selectedService && (
              <section>
                <StepHeading
                  number="06"
                  title={t("booking.review")}
                  copy={
                    language === "ar"
                      ? "راجعي تفاصيل موعدك قبل تثبيته."
                      : "Review your appointment before it is held."
                  }
                />
                <div className="booking-review">
                  <Review
                    label={t("booking.service")}
                    value={text(selectedService, "name")}
                    detail={`${selectedService.duration} ${t("common.minutes")} · ${formatCurrency(selectedService.price)}`}
                  />
                  <Review
                    label={t("booking.specialist")}
                    value={
                      selectedSpecialist
                        ? text(selectedSpecialist, "name")
                        : t("common.anyAvailable")
                    }
                    detail={
                      selectedSpecialist ? text(selectedSpecialist, "role") : t("booking.anyCopy")
                    }
                  />
                  <Review
                    label={t("booking.time")}
                    value={date ? formatDate(date) : ""}
                    detail={`${time} · ${formatCurrency(selectedService.price)}`}
                  />
                  <Review label={t("booking.details")} value={name} detail={phone} />
                </div>
                {error && <p className="booking-error">{error}</p>}
              </section>
            )}
          </div>
          <div className="booking-actions">
            <button
              className="booking-previous"
              onClick={() => setStep((value) => Math.max(0, value - 1))}
              disabled={step === 0}
            >
              <ChevronLeft size={15} /> {t("common.previous")}
            </button>
            {step < 5 ? (
              <button
                className="booking-next"
                onClick={() => canContinue && setStep((value) => value + 1)}
                disabled={!canContinue}
              >
                {t("common.next")} <ChevronRight size={15} />
              </button>
            ) : (
              <button className="booking-next" onClick={confirm}>
                {t("booking.confirm")} <Check size={15} />
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
    <div className="booking-heading">
      <span>{number}</span>
      <h2>{title}</h2>
      <p>{copy}</p>
    </div>
  );
}
function Field({
  label,
  value,
  onChange,
  type = "text",
  ...props
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <label className="booking-field">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        {...props}
      />
    </label>
  );
}
function Review({ label, value, detail }: { label: string; value: string; detail: string }) {
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
  const { t, formatDate } = useI18n();
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
      `SUMMARY:ELAN — ${service}`,
      "LOCATION:ELAN Nail & Spa, Amman",
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
  const copy = async () => {
    await navigator.clipboard.writeText(booking.bookingReference);
    setCopied(true);
  };
  const whatsapp = `https://wa.me/962790000000?text=${encodeURIComponent(`Hello ELAN, I’m confirming my reservation ${booking.bookingReference}.`)}`;
  return (
    <div className="booking-success min-h-screen bg-espresso px-6 pb-20 pt-32 text-ivory md:pt-40">
      <div className="booking-success-glow" />
      <main className="relative mx-auto max-w-3xl text-center">
        <span className="booking-success-mark">
          <Check size={24} />
        </span>
        <span className="eyebrow text-champagne">{t("booking.held")}</span>
        <h1>{t("booking.waiting")}</h1>
        <p>{t("booking.success")}</p>
        <div className="booking-success-card">
          <span>{t("booking.reference")}</span>
          <b>{booking.bookingReference}</b>
          <button onClick={copy}>
            {copied ? <Check size={14} /> : <Copy size={14} />}{" "}
            {copied ? t("booking.copied") : t("booking.copyRef")}
          </button>
          <hr />
          <p>
            {service} · {specialist}
          </p>
          <p>
            {formatDate(booking.appointmentDate)} · {booking.startTime}–{booking.endTime}
          </p>
        </div>
        <div className="booking-success-actions">
          <button onClick={addToCalendar}>
            <Download size={16} /> {t("booking.calendar")}
          </button>
          <a href={whatsapp} target="_blank" rel="noreferrer">
            <MessageCircle size={16} /> {t("booking.whatsapp")}
          </a>
        </div>
        <p className="booking-cancel-note">{t("booking.cancel")}</p>
        <Link to="/" className="booking-home-link">
          {t("booking.return")}
        </Link>
      </main>
    </div>
  );
}
