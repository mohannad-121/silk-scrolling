import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useState } from "react";

import { useSalonData } from "@/lib/salon-data";

type ChatMessage = { from: "concierge" | "guest"; text: string; serviceId?: string };

export function SalonConcierge() {
  const { services, categories } = useSalonData();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      from: "concierge",
      text: "Welcome to ÉLAN. I can help you find a ritual, explain a service, or begin a reservation.",
    },
  ]);

  const respond = (question: string) => {
    const text = question.trim();
    if (!text) return;
    const lower = text.toLowerCase();
    const category = categories.find(
      (item) =>
        lower.includes(item.shortName.toLowerCase()) || lower.includes(item.name.toLowerCase()),
    );
    const named = services.find((service) => lower.includes(service.name.toLowerCase()));
    const match =
      named ??
      services.find((service) => category && service.categoryId === category.id && service.enabled);
    const response: ChatMessage = match
      ? {
          from: "concierge",
          text: `${match.name} is ${match.duration} minutes and AED ${match.price}. ${match.description}`,
          serviceId: match.id,
        }
      : {
          from: "concierge",
          text: "For a tailored recommendation, choose Nails, Pedicure, Laser, Spa or Jacuzzi and I’ll guide you to a reservation.",
        };
    setMessages((current) => [...current, { from: "guest", text }, response]);
    setDraft("");
  };

  return (
    <aside className="salon-concierge">
      {open && (
        <div className="concierge-panel" role="dialog" aria-label="ÉLAN concierge">
          <header>
            <span>
              <Sparkles size={14} /> ÉLAN concierge
            </span>
            <button onClick={() => setOpen(false)} aria-label="Close concierge">
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
                    Reserve this ritual <span>↗</span>
                  </a>
                )}
              </div>
            ))}
          </div>
          <div className="concierge-prompts">
            <button onClick={() => respond("I would like a manicure")}>Manicure</button>
            <button onClick={() => respond("Tell me about laser")}>Laser</button>
            <button onClick={() => respond("I want a private jacuzzi")}>Jacuzzi</button>
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
              placeholder="Ask about an experience…"
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
        aria-label={open ? "Close ÉLAN concierge" : "Open ÉLAN concierge"}
      >
        {open ? <X size={19} /> : <MessageCircle size={19} />}
        <span>{open ? "Close" : "Concierge"}</span>
      </button>
    </aside>
  );
}
