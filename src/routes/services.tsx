import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/stub-page";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — ÉLAN Nail & Spa" },
      { name: "description", content: "Manicure, pedicure, nail art, and spa services at ÉLAN — full catalogue with prices and durations." },
      { property: "og:title", content: "Services — ÉLAN Nail & Spa" },
      { property: "og:description", content: "Explore our full menu of nail and spa services." },
    ],
  }),
  component: () => <StubPage title="The Menu" tagline="Services" body="Full filterable catalogue with add-ons and specialist assignment is next in the build." />,
});