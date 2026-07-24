import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/salon-i18n";
import { useSalonData } from "@/lib/salon-data";

type ChatMessage = { from: "concierge" | "guest"; text: string; serviceId?: string };
export function SalonConcierge() {
  const { services, categories } = useSalonData();
  const { t, text, formatCurrency, language } = useI18n();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  useEffect(() => setMessages([{ from: "concierge", text: t("chat.welcome") }]), [language, t]);
  const respond = (question: string) => {
    const value = question.trim();
    if (!value) return;
    const lower = value.toLocaleLowerCase();
    const category = categories.find((item) =>
      [text(item, "shortName"), text(item, "name")].some((label) =>
        lower.includes(label.toLocaleLowerCase()),
      ),
    );
    const named = services.find(
      (item) =>
        lower.includes(text(item, "name").toLocaleLowerCase()) ||
        lower.includes(item.nameEn.toLowerCase()) ||
        lower.includes(item.nameAr),
    );
    const match =
      named ?? services.find((item) => category && item.categoryId === category.id && item.enabled);
    const response: ChatMessage = match
      ? {
          from: "concierge",
          text: `${text(match, "name")} · ${match.duration} ${t("common.minutes")} · ${formatCurrency(match.price)}. ${text(match, "description")}`,
          serviceId: match.id,
        }
      : { from: "concierge", text: t("chat.fallback") };
    setMessages((current) => [...current, { from: "guest", text: value }, response]);
    setDraft("");
  };
  const prompts =
    language === "ar" ? ["مانيكير", "ليزر", "جاكوزي"] : ["Manicure", "Laser", "Jacuzzi"];
  return (
    <aside className="salon-concierge">
      {open && (
        <div className="concierge-panel" role="dialog" aria-label={t("chat.concierge")}>
          <header>
            <span>
              <Sparkles size={14} /> {t("chat.concierge")}
            </span>
            <button onClick={() => setOpen(false)} aria-label={t("chat.close")}>
              <X size={17} />
            </button>
          </header>
          <div className="concierge-messages">
            {messages.map((message, index) => (
              <div
                key={`${message.text}-${index}`}
                className={`concierge-message concierge-message--${message.from}`}
              >
                <p>{message.text}</p>
                {message.serviceId && (
                  <a href={`/book?service=${message.serviceId}`}>
                    {t("chat.reserve")} <span>↗</span>
                  </a>
                )}
              </div>
            ))}
          </div>
          <div className="concierge-prompts">
            {prompts.map((prompt) => (
              <button key={prompt} onClick={() => respond(prompt)}>
                {prompt}
              </button>
            ))}
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              respond(draft);
            }}
          >
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={t("chat.placeholder")}
            />
            <button aria-label="Send">
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
      <button
        className="concierge-toggle"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? t("chat.close") : t("chat.open")}
      >
        {open ? <X size={19} /> : <MessageCircle size={19} />}
        <span>{open ? t("common.close") : t("chat.concierge")}</span>
      </button>
    </aside>
  );
}
