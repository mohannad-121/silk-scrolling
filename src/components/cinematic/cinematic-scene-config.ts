import artist from "@/assets/scene-artist.jpg";
import exterior from "@/assets/scene-exterior.jpg";
import interior from "@/assets/scene-interior.jpg";
import manicure from "@/assets/scene-manicure.jpg";
import pedicure from "@/assets/scene-pedicure.jpg";
import spa from "@/assets/scene-spa.jpg";

export type CinematicSceneConfig = {
  id: "street" | "reception" | "manicure" | "look" | "pedicure" | "laser" | "jacuzzi";
  label: string;
  eyebrow: string;
  title: string;
  image: string;
  alt: string;
  start: number;
  end: number;
};

export const cinematicScenes: CinematicSceneConfig[] = [
  {
    id: "street",
    label: "01 / Arrival",
    eyebrow: "The Avenue · Dusk",
    title: "Where beauty becomes an experience.",
    image: exterior,
    alt: "ÉLAN salon exterior on a luxury street at dusk",
    start: 0,
    end: 0.28,
  },
  {
    id: "reception",
    label: "02 / The House",
    eyebrow: "Reception",
    title: "Welcome to your private beauty experience.",
    image: interior,
    alt: "ÉLAN luxury reception with marble desk and warm lighting",
    start: 0.27,
    end: 0.47,
  },
  {
    id: "manicure",
    label: "03 / The Atelier",
    eyebrow: "Manicure",
    title: "Every detail, deliberately yours.",
    image: manicure,
    alt: "Nail artist applying polish during a manicure",
    start: 0.44,
    end: 0.61,
  },
  {
    id: "look",
    label: "04 / The Reveal",
    eyebrow: "Finished Nails",
    title: "The final touch becomes the whole mood.",
    image: artist,
    alt: "Elegant hand presenting a refined manicure",
    start: 0.57,
    end: 0.71,
  },
  {
    id: "pedicure",
    label: "05 / Slow Ritual",
    eyebrow: "Pedicure Lounge",
    title: "Ease into a softer pace.",
    image: pedicure,
    alt: "Luxury pedicure lounge with warm water bowls and candles",
    start: 0.68,
    end: 0.8,
  },
  {
    id: "laser",
    label: "06 / Private Care",
    eyebrow: "Laser Suite",
    title: "Advanced care, quietly luxurious.",
    image: "/cinematic/laser/laser-suite.png",
    alt: "Private luxury laser treatment suite",
    start: 0.77,
    end: 0.89,
  },
  {
    id: "jacuzzi",
    label: "07 / The Private Suite",
    eyebrow: "Jacuzzi Ritual",
    title: "Let the day dissolve around you.",
    image: "/cinematic/jacuzzi/private-jacuzzi.png",
    alt: "Private luxury jacuzzi suite with warm candlelight",
    start: 0.86,
    end: 1,
  },
];

export const firstCinematicAssets = cinematicScenes.slice(0, 2).map((scene) => scene.image);
