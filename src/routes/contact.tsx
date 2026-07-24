import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/stub-page";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — ÉLAN Nail & Spa" },
      {
        name: "description",
        content: "Visit ÉLAN Nail & Spa — Downtown location, opening hours, and WhatsApp contact.",
      },
      { property: "og:title", content: "Contact — ÉLAN Nail & Spa" },
      { property: "og:description", content: "Find and reach ÉLAN Nail & Spa." },
    ],
  }),
  component: () => <StubPage page="contact" />,
});
